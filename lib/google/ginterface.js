function ginterface(ss){
    var gapi = ss;
    const sheet = {
        get:()=>{
            return new Promise((resolve,reject)=>{
                gapi.get({},(err,data)=>{
                    if(err!==null){
                        reject(err);
                    }else{
                        resolve(data.data);
                    }
                })
            });
        }
    };

    const values = {
        get:(range,dim="ROWS")=>{
            return new Promise((resolve,reject)=>{
                gapi.values.get({
                    range:range,
                    majorDimension: dim
                },(err,data)=>{
                    if(err!==null){
                        reject(err);
                    }else{
                        resolve(data.data);
                    }
                })
            });
        },
        update:(range,resource)=>{
            return new Promise((resolve,reject)=>{
                gapi.values.update({
                    range:range,
                    valueInputOption:"USER_ENTERED",
                    includeValuesInResponse:true,
                    resource:resource,
                },(err,data)=>{
                    if(err!==null){
                        reject(err);
                    }else{
                        resolve(data.data);
                    }
                })
            });
        }
    };
    return {
        values,
        sheet
    }
}

module.exports = ginterface;