var exec = require('child_process').exec;

/**
 * Objeto que permite la ejecución de un comando de shell
 * @param cmd
 * @param cwd
 * @constructor
 */
function ExecShell(cmd, cwd) {
    "use strict";

    this.cmd = cmd;
    this.cwd = cwd;
}

/**
 * Ejecuta el comando
 * @param {ExecShell~callback} callback - Callback llamado una vez finalizada la ejecución del comando
 */
ExecShell.prototype.run = function (callback) {
    "use strict";

    console.log('Running ' + this.cmd);
    console.log('on ' + this.cwd);
    exec(this.cmd, {"cwd": this.cwd}, function (err, stdout) {
        console.log(stdout);
        callback(err, stdout);
    });
};

/**
 * @typedef {function} ExecShell~callback
 * @param err
 * @param out
 */

module.exports = ExecShell;