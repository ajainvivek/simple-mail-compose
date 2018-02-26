import React from "react";
import Form from "react-jsonschema-form";
import { connect } from "react-redux";
import { sendEmail } from "../actions/compose";
import Messages from "./Messages";

class Compose extends React.Component {
  getSchema() {
    return {
      title: "New Message",
      type: "object",
      required: ["to", "from", "subject"],
      properties: {
        from: { type: "string", title: "From", default: "" },
        to: { type: "string", title: "To", default: "" },
        cc: { type: "string", title: "Cc", default: "" },
        bcc: { type: "string", title: "Bcc", default: "" },
        subject: { type: "string", title: "Subject", default: "" }
      }
    };
  }

  getUiSchema() {
    return {
      to: {
        "ui:autofocus": true,
        "ui:widget": "email",
        "ui:emptyValue": ""
      },
      from: {
        "ui:widget": "email"
      },
      cc: {
        "ui:widget": "email"
      },
      bcc: {
        "ui:widget": "email"
      },
      subject: {
        "ui:widget": "textarea"
      }
    };
  }

  handleSubmit({ formData }) {
    event.preventDefault();
    this.props.dispatch(sendEmail(formData));
  }

  render() {
    const schema = this.getSchema();
    const uiSchema = this.getUiSchema();
    return (
      <div className="container">
        <Messages messages={this.props.messages} />
        <Form schema={schema} uiSchema={uiSchema} onSubmit={this.handleSubmit}>
          <div>
            <button type="submit" className="btn btn-info">
              Send
            </button>
          </div>
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
