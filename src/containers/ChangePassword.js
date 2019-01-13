import React, { Component } from "react";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import PasswordControl from "../components/PasswordControl";
import "./ChangePassword.css";

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      oldPassword: "",
      isChanging: false
    };
  }

  validateForm() {
    return this.state.oldPassword.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleChangeClick = async event => {
    event.preventDefault();

    this.setState({ isChanging: true });

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(
        currentUser,
        this.state.oldPassword,
        this.state.password
      );

      this.props.history.push("/settings");
    } catch (e) {
      alert(e.message);
      this.setState({ isChanging: false });
    }
  };

  render() {
    return (
      <div className="ChangePassword">
        <form onSubmit={this.handleChangeClick}>
          <PasswordControl
            bsSize="large"
            controlId="oldPassword"
            onChange={this.handleChange}
            value={this.state.oldPassword}
          >
            Old Password
          </PasswordControl>
          <hr />
          <PasswordControl
            bsSize="large"
            controlId="password"
            value={this.state.password}
            onChange={this.handleChange}
          >
            New Password
          </PasswordControl>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            text="Change Password"
            loadingText="Changing…"
            disabled={!this.validateForm()}
            isLoading={this.state.isChanging}
          />
        </form>
      </div>
    );
  }
}
