import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";
import { API } from "aws-amplify";

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

  renderPiecesList(pieces) {
    return [{}].concat(pieces).map((pieces, i) =>
      i !== 0 ? (
        <LinkContainer key={pieces.pieceId} to={`/pieces/${pieces.pieceId}`}>
          <ListGroupItem header={pieces.content.trim().split("\n")[0]}>
            {"Created: " + new Date(pieces.createdAt).toLocaleString()}
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
