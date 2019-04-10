'use strict';

var interfejs = require("./application");

module.exports = startApplication;

function startApplication(file, credentialDir) {
    interfejs.init(file, credentialDir);
    return interfejs;
}