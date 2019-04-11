'use strict';

var joi = require('joi');

let MethodSchema = {
    type:joi.any().valid("GET","POST","PUT","DELETE"),
    range:joi.string().min(1),
    mapping:joi.boolean(),
    search:joi.object()
};
let ResourceSchema = {
    name: joi.string().min(1),
    path: joi.string().min(1).required(),
    methods:joi.array().items(MethodSchema),
    resources:joi.array()
};

let APISchema = {
    name: joi.string().required(),
    version: joi.number().required(),
    sheetId: joi.string().required(),
    authorization: joi.object().keys({
        key:joi.string(),
        dir:joi.string()
    }).xor('dir','key').required(),
    resources:joi.array().items(ResourceSchema)
};

module.exports = {
    MethodSchema,
    APISchema,
    ResourceSchema
};
