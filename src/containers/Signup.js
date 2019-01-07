import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      formMessage: { code: "", message: "" },
      passwordVisible: false
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handlePasswordVisibleDown = () => {
    this.setState({ passwordVisible: true });
  };

  handlePasswordVisibleUp = () => {
    this.setState({ passwordVisible: false });
  };

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({
        formMessage: {
          code: "signup",
          message: "Please check your emails for a verification link"
        }
      });
    } catch (e) {
      if (e.code === "UsernameExistsException") {
        try {
          await Auth.resendSignUp(this.state.email);
          this.setState({
            formMessage: {
              code: "resend",
              message:
                "Looks like you already tried signing up. We have resent you a verification link."
            }
          });
        } catch (e) {
          this.setState({ formMessage: e });
        }
      } else {
        this.setState({ formMessage: e });
      }
    }

    this.setState({ isLoading: false });
  };

  renderMessages() {
    return (
      <div
        className={
          this.state.formMessage.code === "signup"
            ? "alert alert-success"
            : "alert alert-danger"
        }
      >
        <p>{this.state.formMessage.message}</p>
      </div>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.formMessage.code && this.renderMessages()}
        {this.state.formMessage.code !== "signup" &&
          this.state.formMessage.code !== "resend" &&
          this.renderForm()}
      </div>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <div className="input-group">
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type={this.state.passwordVisible ? "text" : "password"}
            />
            <div
              className="input-group-addon"
              onMouseDown={this.handlePasswordVisibleDown}
              onTouchStart={this.handlePasswordVisibleDown}
              onMouseUp={this.handlePasswordVisibleUp}
              onMouseOut={this.handlePasswordVisibleUp}
              onTouchEnd={this.handlePasswordVisibleUp}
            >
              <span
                className={
                  this.state.passwordVisible
                    ? "glyphicon glyphicon-eye-close"
                    : "glyphicon glyphicon-eye-open"
                }
                aria-hidden="true"
              />
            </div>
          </div>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }
}
