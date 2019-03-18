const fs = require('fs');
const {google} = require('googleapis');
const chalk = require('chalk');

var connector = {

};

connector.connect = async (header) =>{

	connector.key = header.authorization.key;
	connector.dir = header.authorization.dir;
	connector.file = header.authorization.file;
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
		let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
		return helper.getToken(oAuth2Client);
	}else{
		return connector.key;
	}
};

let helper = {
	getToken : async (oAuth2Client)=>{
		if(!fs.existsSync(connector.dir+"/token.json")){
			try{
				connector.token = await helper.getNewToken(oAuth2Client);
			}catch (e) {
				if(!e instanceof TypeError){
					fs.unlinkSync(connector.dir+"/code.txt");
					helper.getToken(oAuth2Client);
				}else{
					throw e;
				}
			}
		}else{
			connector.token = JSON.parse(fs.readFileSync(connector.dir+"/token.json"));
		}
		oAuth2Client.setCredentials({
			access_token:connector.token.access_token
		});
		return oAuth2Client;
	},

	getNewToken : async (oAuth2Client) => {
		if (!fs.existsSync(connector.dir + "/scopes.json")) {
			connector.scopes = ["https://www.googleapis.com/auth/spreadsheets"];
			fs.writeFile(connector.dir + "/scopes.json", JSON.stringify(connector.scopes), (err) => {
				if (err) return console.error(err);
				console.log('Scopes stored');
			});
		} else {
			connector.scopes = JSON.parse(fs.readFileSync(connector.dir + "/scopes.json"));
		}

		if (fs.existsSync(connector.dir + "/code.txt")) {
			connector.code = fs.readFileSync(connector.dir + "/code.txt").toString("UTF-8");
			let res = await oAuth2Client.getToken(connector.code);
			fs.writeFileSync(connector.dir+"/token.json", JSON.stringify(res.tokens));
			console.log('Token stored');
			return res;
		} else {
			const authUrl = oAuth2Client.generateAuthUrl({
				access_type: 'offline',
				scope: connector.scopes,
			});
			console.error('Authorize this app by visiting this url:', authUrl);
			fs.writeFileSync(connector.dir+"/code.txt","");
			throw new TypeError("You should first generate a code and then paste it into " + connector.dir + "/code.txt file and re-run the app");
		}
	}
};

module.exports =  connector;