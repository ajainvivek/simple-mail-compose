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
  req.assert("name", "Name cannot be blank").notEmpty();
  req.assert("email", "Email is not valid").isEmail();
  req.assert("email", "Email cannot be blank").notEmpty();
  req.assert("message", "Message cannot be blank").notEmpty();
  req.sanitize("email").normalizeEmail({ remove_dots: false });

  let errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  // mail options to be passed
  let mailOptions = {
    from: req.body.name + " " + "<" + req.body.email + ">",
    to: "your@email.com",
    subject: req.body.subject || "",
    text: req.body.message
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
      api_user: process.env.SENDGRID_USERNAME,
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
