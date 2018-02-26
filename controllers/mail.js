const mailService = require("./../services/mailService");
const CircuitBreaker = require("circuit-breaker-js");

// initialize circuit breaker with fault tolerance config
const breaker = new CircuitBreaker({
  timeoutDuration: 1000,
  volumeThreshold: 1,
  errorThreshold: 50
});

/**
 * POST /mail
 */
exports.mailPost = function(req, res) {
  req.assert("to", "To address is not valid email").isEmail();
  req.assert("to", "To address cannot be blank").notEmpty();
  req.assert("from", "From address is not valid email").isEmail();
  req.assert("from", "From address cannot be blank").notEmpty();
  req.assert("subject", "Subject cannot be blank").notEmpty();
  req.assert("message", "Message cannot be blank").notEmpty();
  req.sanitize("to").normalizeEmail({ remove_dots: false });
  req.sanitize("from").normalizeEmail({ remove_dots: false });

  let errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  const { to, from, subject, message, cc, bcc } = req.body;

  // mail options to be passed
  let mailOptions = {
    from,
    to,
    subject,
    text: message
  };

  // mailgun config
  let mgConfig = {
    service: "Mailgun",
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD
    }
  };

  // sendgrid config
  let sgConfig = {
    service: "SendGrid",
    auth: {
      api_key: process.env.SENDGRID_PASSWORD
    }
  };

  // fallback if the command execution fails
  let fallback = () => {
    mailService(mgConfig)
      .sendMail(mailOptions)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        res.send({
          success: false
        });
      });
  };

  // command to initially execute
  let command = (success, failure) => {
    mailService(sgConfig)
      .sendMail(mailOptions)
      .then(response => {
        res.send(response);
        success();
      })
      .catch(err => {
        fallback();
        failure();
      });
  };

  breaker.run(command, fallback);
};
