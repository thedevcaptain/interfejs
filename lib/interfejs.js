'use strict';

var gsheet = require("./sheet");

module.exports = startApplication;

function startApplication(file, credentialDir) {
    gsheet.init(file, credentialDir);
    return gsheet;
}