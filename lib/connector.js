const fs = require('fs');
const {google} = require('googleapis');

var connector = {
};

connector.connect = async (dir) =>{
	connector.dir = dir;
	//check for files
	if(!fs.existsSync(dir+"/credentials.json")){
		throw "Please place the credentials file from the firebase project as "+dir+"/credentials.json";
	}
	this.credentials = JSON.parse(fs.readFileSync(dir+"/credentials.json"));
	let auth = await connector.authorize(this.credentials.credential);
	return google.sheets({version:"v4",auth:auth})
};
connector.authorize = async ()=> {
	const {client_secret, client_id, redirect_uris} = this.credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
	return helper.getToken(oAuth2Client);
};

let helper = {
	getToken : async (oAuth2Client)=>{
		if(!fs.existsSync(connector.dir+"/token.json")){
			connector.token = await this.getNewToken(oAuth2Client);
		}else{
			connector.token = JSON.parse(fs.readFileSync(connector.dir+"/token.json"));
		}
		oAuth2Client.setCredentials(connector.token);
		return oAuth2Client;
	},

	getNewToken : (oAuth2Client)=>{
		if(!fs.existsSync(connector.dir+"/token.json")){
			connector.scopes =  ["https://www.googleapis.com/auth/spreadsheets"];
			fs.writeFile(connector.dir+"/scopes.json", JSON.stringify(connector.scopes), (err) => {
				if (err) return console.error(err);
				console.log('Scopes stored');
			});
		}else{
			connector.scopes = JSON.parse(fs.readFileSync(connector.dir+"/scopes.json"));
		}

		if(fs.existsSync(connector.dir+"/code.txt")){
			connector.code = fs.readFileSync(connector.dir+"/code.txt");
			return new Promise((resolve,reject)=>{
				oAuth2Client.getToken(connector.code, (err, data) => {
					if (err) reject(err);
					fs.writeFile(connector.dir+"/token.json", JSON.stringify(data), (err) => {
						if (err) return console.error(err);
						console.log('Token stored');
					});
					resolve(oAuth2Client);
				});
			});
		}else{
			const authUrl = oAuth2Client.generateAuthUrl({
				access_type: 'offline',
				scope: scopes,
			});
			console.error('Authorize this app by visiting this url:', authUrl);
			throw "You should first generate a code and then paste it into "+connector.dir+"/code.txt file and re-run the app";
		}
	}
};

module.exports =  connector;