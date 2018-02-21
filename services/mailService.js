const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

module.exports = config => {
  const createTransport = config => {
    if (config.service === "SendGrid") {
      config = sgTransport(config);
    }
    return nodemailer.createTransport(config);
  };

  const sendMail = options => {
    return new Promise((resolve, reject) => {
      const transporter = createTransport(config);
      transporter.sendMail(options, function(err) {
        if (err) {
          return reject(err);
        }
        resolve({
          success: true,
          msg: "Mail is sent successfully"
        });
      });
    });
  };

  return {
    createTransport,
    sendMail
  };
};
