'use strict';

const fs = require('fs');
var connector = require('./connector');
var builders = require('./builder');
var logger = require('./logger');
var schemas = require('./schemas');
var ginterface = require('./ginterface');

var chalk = require('chalk');
var joi = require('joi');

var gsheet = {};
var header = {
	sheetId : ""
};

gsheet.init = (app,file="./api.json") => {
	if(!fs.existsSync(file)) throw file + " api file does not exists!";

	let api = JSON.parse(fs.readFileSync(file));

	joi.validate(api,schemas.APISchema).catch(err=>{
		throw err;
	});
	header.authorization = api.authorization;
	header.sheetId = api.sheetId;
	header.app = app;

	if (!header.app) throw "You must pass and Express App!";
	header.api = api;
};

gsheet.run = async (logLevel = 0) => {
	header.gapi = await connector.connect(header);
	if(!header.gapi){
		throw "There is some problems with your authorization, please check the authorization attribute";
	}
	//Init and loading
	console.log(chalk.bold("Loading Api "), chalk.red(header.api.name), " v", header.api.version);
	console.log(chalk.bold("Loading resources and methods ..."));

	logger.activate(logLevel,header.app);

	builders.api(ginterface(header.gapi.spreadsheets),header.app,header.api);

	//starting up
	header.app.listen(3000, function () {
		console.log('Listening on port 3000!');
	});

};

module.exports = gsheet;

