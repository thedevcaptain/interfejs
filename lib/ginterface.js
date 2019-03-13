function ginterface(ss){
    var spreadsheets = ss;
    const get = (range) => {
        return new Promise((resolve,reject)=>{
            spreadsheets.values.get({
                range: range
            }, (err, res) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(res.data);
                }
            });
        });
    };
    return {
        get
    }
}

module.exports = ginterface;