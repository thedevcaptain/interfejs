'use strict';

var joi = require('joi');

let MethodSchema = {
    type:joi.any().valid("GET","POST","PUT","DELETE"),
    range:joi.string().min(1)
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
    resources:joi.array()
};

module.exports = {
    MethodSchema,
    APISchema,
    ResourceSchema
};