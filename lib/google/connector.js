const fs = require('fs');
const {google} = require('googleapis');
const chalk = require('chalk');
const axios = require("axios");
var authService = axios.create();

var connector = {};

connector.connect = async (header) =>{

	connector.key = header.authorization.key;
	connector.dir = header.authorization.dir;

	let auth = await connector.authorize();

	return google.sheets({version:"v4",auth:auth,params :{
			spreadsheetId: header.sheetId
		}
	});
};
connector.authorize = async () => {
	if(connector.dir){
		console.log(chalk.green("Connecting with oAuth2 to Google sheets API"));

		//check for files
		if(!fs.existsSync(connector.dir+"/credentials.json")){
			throw "Please place the credentials file from the firebase project as "+connector.dir+"/credentials.json";
		}else{
			if(!fs.lstatSync(connector.dir).isDirectory()){
				throw "Please make sure that "+connector.dir+" is a directory";
			}
		}

		connector.credentials = JSON.parse(fs.readFileSync(connector.dir+"/credentials.json"));
		const {client_secret, client_id, redirect_uris} = connector.credentials.installed;

		connector.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

		return helper.getToken();
	}else{
		return connector.key;
	}
};

let helper = {

	getToken : async ()=>{
		if(!fs.existsSync(connector.dir+"/token.json")){
			try{
				connector.token = await helper.getNewToken();
			}catch (e) {
				if(!e instanceof TypeError){
					fs.unlinkSync(connector.dir+"/code.txt");
					helper.getToken();
				}else{
					throw e;
				}
			}
		}else{
			connector.token = JSON.parse(fs.readFileSync(connector.dir+"/token.json"));
		}
		connector.oAuth2Client.setCredentials({
			access_token:connector.token.access_token,
			refresh_token:connector.token.refresh_token
		});
		return connector.oAuth2Client;
	},
	generateToken : async  ()=>{
		let postToken = await authService.post("https://www.googleapis.com/oauth2/v4/token?code="+connector.code+"&client_id="+connector.credentials.installed.client_id+"&client_secret="+connector.credentials.installed.client_secret+"&redirect_uri="+connector.credentials.installed.redirect_uris[0]+"&grant_type=authorization_code");
		return postToken.data;
	},

	getNewToken : async () => {
		connector.scopes = ["https://www.googleapis.com/auth/spreadsheets"];

		if (fs.existsSync(connector.dir + "/code.txt")) {
			connector.code = fs.readFileSync(connector.dir + "/code.txt").toString("UTF-8");
			//generating new credentials
			let res = await helper.generateToken();
			fs.writeFileSync(connector.dir+"/token.json", JSON.stringify(res));
			fs.unlinkSync(connector.dir + "/code.txt");
			console.log('Token stored');
			return res;
		} else {
			const authUrl = connector.oAuth2Client.generateAuthUrl({
				access_type: 'offline',
				scope: connector.scopes,
				prompt:"consent"
			});
			console.error('Authorize this app by visiting this url:', authUrl);

			fs.writeFileSync(connector.dir+"/code.txt","");
			throw new TypeError("You should first generate a code and then paste it into " + connector.dir + "/code.txt file and re-run the app");
		}
	}
};

module.exports =  connector;