import React from "react";
import {
  Form,
  Button,
  FormControl,
  FormGroup,
  ControlLabel,
  HelpBlock
} from "react-bootstrap";
import { connect } from "react-redux";
import { sendEmail } from "../actions/compose";
import Messages from "./Messages";

function FieldGroup(props) {
  let { id, label, help } = props;
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

class Compose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "ajain",
      email: "ajainvivek16@gmail.com",
      message: "hey there"
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.dispatch(
      sendEmail(this.state.name, this.state.email, this.state.message)
    );
  }

  render() {
    return (
      <div className="container">
        <h4>New Message</h4>
        <Messages messages={this.props.messages} />
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <FieldGroup
            id="sendTo"
            type="email"
            label="Email"
            placeholder="To"
            value={this.state.email}
            onChange={this.handleChange.bind(this)}
          />
          <FieldGroup
            id="subject"
            type="text"
            label="Subject"
            placeholder="Subject"
            value={this.state.name}
            onChange={this.handleChange.bind(this)}
          />
          <FieldGroup
            id="message"
            type="textarea"
            label="Message"
            placeholder="Enter message..."
            value={this.state.message}
            onChange={this.handleChange.bind(this)}
          />
          <br />
          <Button type="submit">Send</Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Compose);
