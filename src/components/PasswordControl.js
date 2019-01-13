import React, { Component } from "react";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup,
  Button
} from "react-bootstrap";

class PasswordControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordVisible: false
    };
  }

  handleClick = () => {
    this.setState({ passwordVisible: !this.state.passwordVisible });
  };

  render() {
    return (
      <FormGroup controlId={this.props.controlId} bsSize={this.props.bsSize}>
        <ControlLabel>{this.props.children || "Password"}</ControlLabel>
        <InputGroup>
          <FormControl
            value={this.props.value}
            onChange={this.props.onChange}
            type={this.state.passwordVisible ? "text" : "password"}
          />
          <InputGroup.Button>
            <Button onClick={this.handleClick} bsSize={this.props.bsSize}>
              {this.state.passwordVisible ? "Hide" : "Show"}
            </Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    );
  }
}

export default PasswordControl;
