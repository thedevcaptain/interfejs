'use strict';

var fs = require('fs');
var connector = require('./google/connector');
var builders = require('./builder');
var logger = require('./logger');
var schemas = require('./schemas');
var ginterface = require('./google/ginterface');

var chalk = require('chalk');
var joi = require('joi');

var interfejs = {};
var header = {};

interfejs.init = (app,file="./api.json") => {
	//API file loading
	if(!fs.existsSync(file)) throw file + " api file does not exists!";
	let api = JSON.parse(fs.readFileSync(file));

	//API file validation
	joi.validate(api,schemas.APISchema).catch(err=>{
		throw err;
	});

	header.authorization = api.authorization;
	header.sheetId = api.sheetId;
	header.app = app;
	header.api = api;

	if (!header.app) throw "You must provide an Express App!";
};

interfejs.run = async (logLevel = 0) => {
	header.connector = await connector.connect(header);

	if(!header.connector){
		throw "There is some problems with your authorization, please check the authorization attribute";
	}

	//Init and loading
	console.log(chalk.bold("Loading Api "), chalk.red(header.api.name), " v", header.api.version);
	console.log(chalk.bold("Loading resources and methods ..."));

	logger.activate(logLevel,header.app);

	try{
		//building the apis
		builders.api(ginterface(header.connector.spreadsheets),header.app,header.api,connector);
	}catch (e) {
		console.log(e);
	}

	//starting up
	header.app.listen(3000, function () {
		console.log('Listening on port 3000!');
	});

};

module.exports = interfejs;

