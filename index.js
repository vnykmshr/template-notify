'use strict';

var path = require('path');

module.exports = function (emailConfig, templateConfig) {
    // initialize mailer
    require('./lib/mailer').init(emailConfig);

    // initialize templates
    templateConfig.dir = templateConfig.dir || path.join(process.cwd(), 'resources/templates');
    templateConfig.delimiter = templateConfig.delimiter || '\n\n';
    require('./lib/templates').init(templateConfig);

    return {
        email: require('./lib/email'),
        sms: require('./lib/sms')
    };
};

//-- Test Code ----------------------------------------------------------
if (require.main === module) {
    (function () {
        console.log(module.exports);
    })();
}
