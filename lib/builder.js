const chalk = require('chalk');
const joi = require('joi');
const schemas = require('./schemas');

function builder(){
    var googleInterface;

    const api = (gapi,app,api)=>{
        if(api.resources){
            api.resources.forEach(item => {
                resource(app,item, "");
            });
        }
        googleInterface = gapi;
    };

    function resource(app,item,parent){
        let absPath = parent + "/" + item.path;

        console.log(chalk.bold("Resource "),chalk.red(absPath));

        joi.validate(item,schemas.ResourceSchema).catch(err=>{
            throw err;
        });

        if(item.hasOwnProperty("methods")){
            if(item.methods.length > 0){
                let r = app.route(absPath);
                item.methods.forEach(met=>{
                    r = method(met,r);
                });
            }
        }

        if(item.hasOwnProperty("resources")){
            item.resources.forEach(elem=>{
                resource(app,elem,absPath);
            });
        }
    }

    const method = (met,r)=>{
        console.log(chalk.bold("\tMethod "),chalk.red(met.type));
        if(met.type === "GET"){
            r.get(async (req,res)=>{
                try{
                    let data = await googleInterface.get(met.range);
                    res.json(data.values);
                }catch (e) {
                    res.status(500).json({"error":e.message});
                }
            })
        }else{
            console.log(chalk.yellow(chalk.bold("\tMethod "+met.type+" unknown or not yet implemented")));
        }
        return r;
    };
    return {
        api,
        resource,
        method
    };
}


module.exports = builder();