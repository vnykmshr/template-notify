'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var pug = require('pug');
var putils = require('proc-utils');

var templates = {
  map: {},

  load: function (config, cb) {

    var files = putils.scan(config.dir, '.jade');

    if (!files || !files.length) {
      return cb(new Error('no files: ' + config.dir));
    }

    var data = [];

    files.forEach(function (f) {
      var file = {
        filename: path.basename(f),
        filepath: f
      };

      var contents = fs.readFileSync(file.filepath).toString();
      var split = contents.indexOf(config.delimiter);
      var hsplit, name, val;
      contents.substring(0, split).split('\n').forEach(function (h) {
        hsplit = h.indexOf(':');
        name = h.substring(0, hsplit);
        if (h[hsplit + 1] === ' ') hsplit++;
        val = h.substring(hsplit + 1);
        file[name.toLowerCase()] = val;
      });

      file.body = contents.substring(split + config.delimiter.length);
      data.push(file);
    });

    cb(null, data);
  },

  init: function (config, cb) {
    cb = cb || logcb;

    if (!config || !config.dir) {
      throw new Error('Template config dir not set: ' + JSON.stringify(config));
    }

    templates.load(config, loadedTemplates);

    function loadedTemplates(err, files) {
      if (err || !files) {
        return cb(err || new Error('no template loaded! config: ' + JSON.stringify(config)));
      }

      files.forEach(function (file) {
        try {
          file.subject = pug.compile(file.subject);
          file.body = pug.compile(file.body);

          templates.map[file.name || file.filename.split('.').shift()] = file;
        } catch (e) {
          // continue loading other templates
          util.log('error loading template: ' + file.name + ' ' + e.message);
        }
      });

      cb();
    }
  }
};

function logcb(err) {
  if (err) console.log(err);
  util.log('Loaded templates: ' + Object.keys(templates.map).toString());
}

module.exports = templates;
