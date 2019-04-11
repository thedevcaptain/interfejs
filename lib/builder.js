const chalk = require('chalk');
const joi = require('joi');
const schemas = require('./schemas');

function builder(){
    var googleInterface;
    var connector;
    var lineFormula = 1;

    const api = (gapi,app,api,gcon)=>{
        connector = gcon;
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

    const mapping = (data)=>{
        let headers = data[0];
        data = data.slice(1);
        let res = [];
        data.forEach(el=>{
            let k = 0;
            let obj = {};
            el.forEach((j,k)=>{
                if(headers.length<=k){
                    obj[k] = j;
                }else{
                    obj[headers[k]] = j ;
                }
                k++;
            });
            res.push(obj);
        });
        return data;
    };
    const searchDo = async (val,met)=>{
        let data = await googleInterface.values.get(met.search.column+":"+met.search.column,"COLUMNS");
        data = data.values[0];
        let i = 0;
        console.log(data);
        return {
            param: met.search.param,
            data: val,
            result: data.indexOf(val)+1
        };
    };
    const search = async (val,met)=>{
        if(!isNaN(Number(val))){
            val = Number(val);
        }
        var line = lineFormula++;
        let range = "Z"+(line)+":Z"+(line);
        let resource = {
            range: range,
            majorDimension: "ROWS",
            values: [
                [
                    "=MATCH("+JSON.stringify(val)+";"+met.search.column+":"+met.search.column+";0)"
                ]
            ]
        };
        let data = await googleInterface.values.update(range,resource);
        data = data.updatedData;
        lineFormula--;
        return {
            param: met.search.param,
            data: val,
            result: (data.values[0][0] !== "#N/A")?data.values[0][0]:-1
        };
    };

    const method = (met,r)=>{
        console.log(chalk.bold("\tMethod "),chalk.red(met.type));
        if(met.type === "GET"){
            r.get(async (req,res)=>{
                try{
                    var data = [];
                    if(met.search!==undefined){
                        data = await search(req.query[met.search.param],met);
                    }else{
                        data = await googleInterface.values.get(met.range);
                        data = data.values;
                        if(met.mapping){
                            data = mapping(data);
                        }
                    }
                    res.json(data);
                }catch (e) {
                    console.log(e);
                    res.status(500).json(e.message);
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