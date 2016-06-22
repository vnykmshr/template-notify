'use strict';

var util = require('util');
var nodemailer = require('nodemailer');
var transport = require('nodemailer-smtp-pool');

var mailer = {
  transport: null,
  config: null,

  init: function (config) {
    if (!config) {
      throw new Error('Missing mailer configuration');
    }

    if (mailer.transport) {
      util.log('Skipping, transport already initialized!');
      return;
    }

    mailer.transport = nodemailer.createTransport(transport(config.email));
    mailer.config = config;
  },

  send: function (options, cb) {
    if (!mailer.config || !mailer.transport) {
      return cb(new Error('Mailer not initialized'));
    }

    var mail = {
      from: options.from || mailer.config.sender,
      subject: mailer.config.subjectPrefix ? mailer.config.subjectPrefix + ' ' + options.subject : options
        .subject,
      html: options.body,
      generateTextFromHTML: options.generateTextFromHTML || true,
      sender: mailer.config.sender || (mailer.config.auth ? mailer.config.auth.user : 'No-name'),
      attachments: options.attachments || [],
      replyTo: options.replyTo || mailer.config.sender
    };

    ['bcc', 'cc', 'to'].forEach(function (key) {
      if (options[key]) {
        mail[key] = options[key];
      }
    });

    mailer.transport.sendMail(mail, cb);
  }
};

module.exports = mailer;


// -- Test Code ---------------------------------------------------------
if (require.main === module) {
  (function () {
    var config = {};
    var mail = {
      from: 'Test Client <test.client@localhost>'
    };
    mailer.init(config);
    mailer.send(mail, console.log);
  })();
}
