import React, { Component } from "react";
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
  Button,
  Badge
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";
import { API } from "aws-amplify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { isToday } from "../libs/dateLib";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      pieces: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const pieces = await this.pieces();
      this.setState({ pieces });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  pieces() {
    return API.get("pieces", "/pieces");
  }

  handlePiecePractised = async pieceId => {
    API.post("pieces", `/practise/${pieceId}`, {});
    const updatedPieces = this.state.pieces.map(p => {
      if (p.pieceId === pieceId) {
        p.practiseCount = p.practiseCount + 1;
        p.lastPractisedAt = new Date().toUTCString();
      }
      return p;
    });
    this.setState({ updatedPieces });
  };

  renderPiecesList(pieces) {
    return [{}].concat(pieces).map((pieces, i) =>
      i !== 0 ? (
        <LinkContainer key={pieces.pieceId} to={`/pieces/${pieces.pieceId}`}>
          <ListGroupItem>
            <Badge>{pieces.practiseCount}</Badge>
            <h4>{pieces.content.trim().split("\n")[0]}</h4>

            {pieces.lastPractisedAt &&
            isToday(new Date(pieces.lastPractisedAt)) ? (
              <FontAwesomeIcon
                onClick={event => event.preventDefault()}
                size="5x"
                color="green"
                icon={faSmile}
              />
            ) : (
              <Button
                onClick={event => {
                  event.preventDefault();
                  this.handlePiecePractised(pieces.pieceId);
                }}
              >
                <FontAwesomeIcon size="5x" color="yellow" icon={faSmile} />
              </Button>
            )}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/pieces/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new piece
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>PieceNotes</h1>
        <p>A music practice app</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderPieces() {
    return (
      <div className="pieces">
        <PageHeader>Your Pieces</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderPiecesList(this.state.pieces)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderPieces() : this.renderLander()}
      </div>
    );
  }
}
