var androidVersionFile = require('./androidVersion'),
    ExecShell = require('./exec-shell');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var firextRepository = require('./repositories/firextRepository');
var gcm = require('./utils/gcm');

var project = {
    name: "Firext",
    repo: "https://github.com/colymore/firext-android.git"
};


module.exports = function (options) {
    "use strict";

    var buildDirectory = options.buildDirectory;
    var branch = options.branch !== undefined ? options.branch : 'master';

    var gitClone = function (callback) {
        new ExecShell('git clone -b ' + branch + ' ' + project.repo + ' ' + buildDirectory, '.').run(callback);
    };

    var buildAndroid = function (callback) {
        new ExecShell('./gradlew assembleRelease', buildDirectory).run(callback);
    };

    var copyApkToDeployDir = function (callback) {
        new ExecShell('cp Firext/Firext/build/outputs/apk/Firext-release.apk ../../android/apk/', buildDirectory).run(callback);
    };

    var generateAndroidVersionFile = function (callback) {
        androidVersionFile(buildDirectory + '/Firext/src/main/AndroidManifest.xml', "android/apk/", callback);
    };

    var removeBuildDirectory = function (callback) {
        new ExecShell('rm -rf ../*', buildDirectory).run(callback);
    };

    var notify = function () {
        mongoClient.connect('mongodb://127.0.0.1/firext', function (err, db) {
            if (err) {
                throw err;
            }

            var errorGcm = function (error) {
                next(error);
            };

            var successGcm = function () {
            };


            firextRepository.getAll(db, function (docs) {
                for (var i = 0; i < docs.length; i++) {
                    gcm(docs[i].gcmId, 1, successGcm, errorGcm);
                    console.log("GCM:" + docs[i].gcmId);
                }
            });
        });
    };

    return [
        gitClone,
        buildAndroid,
        copyApkToDeployDir,
        generateAndroidVersionFile,
        removeBuildDirectory,
        notify
    ];
};
