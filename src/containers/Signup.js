import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import PasswordControl from "../components/PasswordControl";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      formMessage: { code: "", message: "" },
      passwordVisible: false,
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true, formMessage: { code: "", message: "" } });

    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({
        newUser
      });
    } catch (e) {
      if (e.code === "UsernameExistsException") {
        try {
          await Auth.resendSignUp(this.state.email);
          this.setState({
            newUser: "resend"
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

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true, formMessage: { code: "", message: "" } });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      if (e.code === "NotAuthorizedException") {
        this.props.history.push("/login");
      } else {
        this.setState({ formMessage: e, isLoading: false });
      }
    }
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
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
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
        <PasswordControl
          controlId="password"
          bsSize="large"
          onChange={this.handleChange}
          value={this.state.password}
        />
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
