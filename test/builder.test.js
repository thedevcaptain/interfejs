const assert = require("assert");
const sinon = require("sinon");
var builder = require('../lib/builder');

describe("api building",()=>{
    it('should build and empty api', function () {
        //arrange
        let app = {
            route:(route)=>{
                return {
                    get:()=>{

                    }
                };
            }
        };
        let gapi = {
            get:sinon.spy()
        };
        let api = {
            name:"api 1",
            version:1,
            authorization:{key:"ciao"}
        };
        builder.api(gapi,app,api);
    });

    it('should build a simple api, empty resources', function () {
        //arrange
        let app = {
            route:(route)=>{
                return {
                    get:()=>{

                    }
                };
            }
        };
        let gapi = {
            get:sinon.spy()
        };
        let api = {
            name:"api 1",
            version:1,
            authorization:{key:"ciao"},
            resources:[
                {

                }
            ]
        };
        builder.api(gapi,app,api);
    });

    it('should not build the api', function () {
        //arrange
        let app = {
            route:(route)=>{
                return {
                    get:()=>{

                    }
                };
            }
        };
        let gapi = {
            get:sinon.spy()
        };
        let api = {
            name:"api 1",
            version:1,
            authorization:{key:"ciao"},
            resources:{

            }
        };
        assert.throws(()=>{
            builder.api(gapi,app,api);
        }, TypeError);
    });

});