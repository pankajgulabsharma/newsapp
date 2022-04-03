var _ = require("lodash");

const nodemailer = require("nodemailer");

var config = {
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "pankajgs1997@gmail.com",
    pass: "Pankaj@321",
  },
  // secure: false, // This is added by me      Note:-> this line and its below line (tls) no need in production otherwise create error
  // tls: {
  //   rejectUnauthorized: false,
  // },
};

var transporter = nodemailer.createTransport(config);

var defaultMail = {
  from: "pankajgs1997@gmail.com",
  text: "test test",
};

const send = (to, subject, html) => {
  //use default setting
  mail = _.merge({ html }, defaultMail, to);

  transporter.sendMail(mail, function (error, info) {
    if (error) return console.log(error);
    console.log("mail sent", info.response);
  });
};

module.exports = { send };
