var androidVersionFile = require('./androidVersion'),
    ExecShell = require('./exec-shell');

var project = {
    name: "Firext",
    repo: "https://colymore:21082108@bitbucket.org/colymore/firext.git"
};

/**
 * Tareas para compilar
 * @param options Opciones de compilación
 * @param {string} options.buildDirectory - El directorio donde se hará la build.
 * @param {string} options.branch - La rama a compilar
 */
module.exports = function (options) {
    "use strict";

    var buildDirectory = options.buildDirectory;
    var branch = options.branch !== undefined ? options.branch : 'master';

    var gitClone = function (callback) {
        new ExecShell('git clone -b ' + branch + ' ' + project.repo + ' ' + buildDirectory, '.').run(callback);
    };

    var buildAndroid = function (callback) {
        new ExecShell('gradle assembleRelease', buildDirectory).run(callback);
    };

    var copyApkToDeployDir = function (callback) {
        new ExecShell('cp Firext/build/apk/Firext-release.apk ../../android/apk/' , buildDirectory).run(callback);
    };

    var generateAndroidVersionFile = function (callback) {
        androidVersionFile(buildDirectory + '/Firext/src/main/AndroidManifest.xml', "android/apk/", callback);
    };

    var removeBuildDirectory = function (callback){
        new ExecShell('rm -rf ../*' , buildDirectory).run(callback);
    };

    return [
        gitClone,
        buildAndroid,
        copyApkToDeployDir,
        generateAndroidVersionFile,
        removeBuildDirectory
    ];
};
