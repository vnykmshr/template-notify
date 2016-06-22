'use strict';

var path = require('path');
var util = require('util');

var emailConfig = {
  sender: 'Sender <xxx@xxx.xxx>',
  subjectPrefix: '',
  name: 'XXX',
  host: 'xxx-smtp-host',
  port: 'xxx-smtp-port',
  auth: {
    user: 'xxx-smtp-user',
    pass: 'xxx-smtp-pass'
  }
};

var templateConfig = {
  dir: path.join(__dirname, 'resources', 'templates')
};

var nm = require('../')(emailConfig, templateConfig);

var recipients = ['xxx@xxx.xxx'];

var options = {
  template: 'welcome'
};

nm.email.send(recipients, options, logcb);

function logcb(err, result) {
  util.log(err || JSON.stringify(result));
}
