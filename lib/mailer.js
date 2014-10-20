'use strict';

var util = require('util');
var nodemailer = require('nodemailer');

var mailer = {
    transport: null,

    config: null,

    init: function (config) {
        if (!config) {
            throw new Error('Missing mailer configuration');
        }

        if (mailer.transport) {
            util.log('Attempting to re-initialize mailer, aborting');
            return;
        }

        mailer.transport = nodemailer.createTransport(config.email);
        mailer.config = config;
    },

    send: function (options, cb) {
        var realOptions = {};

        realOptions.from = options.from || mailer.config.sender;

        ['bcc', 'cc', 'to'].forEach(function (key) {
            if (options[key]) realOptions[key] = options[key];
        });

        realOptions.subject = options.subject;
        if (mailer.config.subjectPrefix) {
            realOptions.subject = mailer.config.subjectPrefix + ' ' +
                realOptions.subject;
        }
        realOptions.html = options.body;
        realOptions.generateTextFromHTML = options.generateTextFromHTML || true;
        realOptions.sender = mailer.config.sender || mailer.config.auth.user;
        realOptions.attachments = options.attachments || [];
        realOptions.replyTo = options.replyTo || mailer.config.sender;
        mailer.transport.sendMail(realOptions, cb);
    }
};

module.exports = mailer;
