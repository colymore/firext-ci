var path = require('path'),
    fs = require('fs');

/**
 * Obtiene el android:versionCode del manifiesto y genera un fichero
 * txt con este numero en la carpeta especificada.
 * @param manifestFilePath
 * @param outputPath
 * @param callback
 */
module.exports = function (manifestFilePath, outputPath, callback) {
    "use strict";
    console.log('Creating Android Version File'+'\r');

    var opt = {
        encoding: 'utf8'
    };

    fs.readFile(manifestFilePath, opt, function (err, data) {
        if (err) {
            callback(err);
        }
        var rg = new RegExp('android:versionCode="(\\d+)"', "g");
        var match = rg.exec(data);
        console.log('Android Application Version: ' + match[1]+'\r');

        var versionFile = path.join(outputPath, 'version.txt');

        fs.writeFile(versionFile, match[1], function (err) {
            if (err) {
                callback(err);
            }

            callback(err);
        });
    });
};