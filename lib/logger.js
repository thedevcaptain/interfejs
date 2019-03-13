var bodyParser = require('body-parser');
var logger = require('morgan');
var loggerBody = require('morgan-body');

const activate = (logLevel,app)=>{
    app.use(bodyParser.json());
    if(logLevel === 1){
        app.use(logger("dev"));
    }
    if(logLevel > 1){
        loggerBody(app,{
            "theme":"inverted"
        });
    }
};

module.exports = {
    activate
};
