var run = require('./run-tasks');

/**
 * Realiza una compilación.
 * @param options
 * @param callback
 */
module.exports = function (options, callback) {
    "use strict";

    var now = new Date();
    var y = now.getFullYear() + '';
    var m = (now.getMonth() + 1) + '';
    var d = now.getDate() + '';
    var buildDirectory = 'builds/' + y + m + d + "_" + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
    var tasks = require('./build-tasks')({
        buildDirectory: buildDirectory,
        branch: options.branch,
        name : options.name
    });

    run(tasks, function (err, stdout) {
        callback(err, stdout, buildDirectory);
    });
};