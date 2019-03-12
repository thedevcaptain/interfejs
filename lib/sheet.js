'use strict';

const fs = require('fs');
var connector = require('./connector');
var schemas = require('./schemas');

var chalk = require('chalk');
var joi = require('joi');
var bodyParser = require('body-parser');
var logger = require('morgan');
var loggerBody = require('morgan-body');


var gsheet = {};
var config = {
	sheetId : ""
};

gsheet.init = (app,file="./api.json",credentialsDir = "./credentials") => {
	if(!fs.existsSync(file)) throw file + " api file does not exists!";

	this.api = JSON.parse(fs.readFileSync(file));
	config.credentialsDir = credentialsDir;
	config.sheetId = this.api.sheetId;
	config.app = app;
	if (!config.app) throw "You must pass and Express App!";
};

gsheet.run = async (logLevel = 0) => {
	config.gapi = await connector.connect(config.credentialsDir);

	//Init and loading
	console.log(chalk.bold("Loading Api "), chalk.red(this.api.name), " v", this.api.version);
	console.log(chalk.bold("Loading resources and methods ..."));

	let valid = joi.validate(this.api, schemas.APISchema).error;
	if (valid) throw valid;

	activateLogger(logLevel, config.app);

	this.api.resources.forEach(item => {
		parseResource(item, "");
	});

	//starting up
	config.app.listen(3000, function () {
		console.log('Listening on port 3000!');
	});

};

function parseResource(item,parent){
	let absPath = parent + "/" + item.path;
	console.log(chalk.bold("Resource "),chalk.red(absPath));

	let valid = joi.validate(item,schemas.ResourceSchema).error;
	if(valid) throw valid;

	if(item.hasOwnProperty("methods")){
		if(item.methods.length > 0){
			let r = config.app.route(absPath);
			item.methods.forEach(met=>{
				r = parseMethod(met,r);
			});
		}
	}

	if(item.hasOwnProperty("resources")){
		item.resources.forEach(elem=>{
			parseResource(elem,absPath);
		});
	}

}

function parseMethod(met,r){
	console.log(chalk.bold("\tMethod "),chalk.red(met.type));
	if(met.type === "GET"){
		r.get(async (req,res)=>{
			let data = await ginterface.getData(met.range);
			res.json(data.values);
		})
	}else{
		console.log(chalk.yellow(chalk.bold("\tMethod "+met.type+" unknown or not yet implemented")));
	}

	return r;
}

function activateLogger(logLevel,app){
	app.use(bodyParser.json());
	if(logLevel === 1){
		app.use(logger("dev"));
	}
	if(logLevel > 1){
		loggerBody(app,{
			"theme":"inverted"
		});
	}
}

let ginterface = {
	getData : (range) => {
		return new Promise((resolve,reject)=>{
			config.gapi.spreadsheets.values.get({
				spreadsheetId: config.sheetId,
				range: range
			}, (err, res) => {
				if (err) reject(err);
				resolve(res.data);
			});
		});
	}
};

module.exports = gsheet;

