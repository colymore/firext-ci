/**
 * Ejecuta en orden todas las tareas especificadas
 * El callback es llamado con dos parametros: err y stdout.
 * err es undefined si no hubo errors
 * stdout contiene el texto del error, si lo hubo
 * @param tasks
 * @param {function} callback
 */
module.exports = function (tasks, callback) {
    "use strict";

    var i = 0;

    var next = function (err, stdout) {
        if (err) {
            console.log(err);
            callback(err, stdout);
            return;
        }

        if (stdout !== undefined) {
            console.log(stdout);
        }

        if (i < tasks.length) {
            tasks[i](next);
            i = i + 1;
        } else {
            if (callback !== undefined) {
                callback();
            }
        }
    };

    next();
};