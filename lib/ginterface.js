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
        get:(range)=>{
            return new Promise((resolve,reject)=>{
                gapi.values.get({
                    range:range
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