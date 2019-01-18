import React, { Component } from "react";
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
  Button,
  ButtonGroup
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
        p.practiseCount = p.practiseCount ? p.practiseCount + 1 : 1;
        p.weekPractiseCount = p.weekPractiseCount ? p.weekPractiseCount + 1 : 1;
        p.lastPractisedAt = new Date().toUTCString();
      }
      return p;
    });
    this.setState({ updatedPieces });
  };

  handleNewPiece = () => {
    this.props.history.push("/pieces/new");
  };

  handleResetWeek = async () => {
    API.post("pieces", `/resetWeek`, {});
    const updatedPieces = this.state.pieces.map(p => {
      p.weekPractiseCount = 0;
      return p;
    });
    this.setState({ updatedPieces });
  };

  renderPiecesList(pieces) {
    // For each piece
    return pieces.map(piece => {
      // Work out this weeks stamps - if not practised today then first one is a yellow clickable one
      let thisWeeksStamps = [];
      if (!piece.lastPractisedAt || !isToday(new Date(piece.lastPractisedAt))) {
        thisWeeksStamps.push(
          <FontAwesomeIcon
            key="0"
            onClick={event => {
              event.preventDefault();
              this.handlePiecePractised(piece.pieceId);
            }}
            size="5x"
            color="yellow"
            icon={faSmile}
          />
        );
      }
      // Rest are green ones
      for (let i = 0; i < piece.weekPractiseCount; i++) {
        thisWeeksStamps.push(
          <FontAwesomeIcon key={i + 1} size="5x" color="green" icon={faSmile} />
        );
      }

      // Return this list contianer - clickable through to edit the piece
      return (
        <LinkContainer key={piece.pieceId} to={`/pieces/${piece.pieceId}`}>
          <ListGroupItem>
            <span>
              Practised {piece.practiseCount ? piece.practiseCount : 0} time
              {piece.practiseCount > 0 && "s"}
            </span>
            <h4>{piece.content.trim().split("\n")[0]}</h4>
            <div className="weeklyStamps">{thisWeeksStamps}</div>
          </ListGroupItem>
        </LinkContainer>
      );
    });
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
        <ButtonGroup justified>
          <Button
            onClick={this.handleNewPiece}
            bsStyle="primary"
            bsSize="lg"
            href="#"
          >
            Add new piece
          </Button>
          <Button onClick={this.handleResetWeek} bsSize="lg" href="#">
            Clear stamps
          </Button>
        </ButtonGroup>
        <br />
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
