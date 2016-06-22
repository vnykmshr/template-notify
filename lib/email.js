'use strict';

var util = require('util');

var mailer = require('./mailer');
var templates = require('./templates');

var em = {
  send: function (recipients, options, cb) {
    if (!util.isArray(recipients)) {
      recipients = [recipients];
    }

    var tmpl = templates.map[options.template];
    if (!tmpl) {
      return cb(new Error('no such template:' + options.template));
    }

    var mail = {
      to: recipients,
      subject: tmpl.subject(options),
      body: tmpl.body(options),
      attachments: options.attachments
    };

    mailer.send(mail, cb);
  }
};

module.exports = em;
