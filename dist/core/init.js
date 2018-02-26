"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("./immutable");
var state_1 = require("./state");
var action_1 = require("./action");
function initialize(initialState, options) {
    options = options || { domain: 'default' };
    action_1.Action.showError = options.showError;
    var cacheKey = "statex-cache:" + options.domain;
    if (options.hotLoad === true && options.cache != undefined) {
        // for nodejs / electron projects
        var fs_1 = require('fs');
        var cacheFile_1 = require('path').resolve(process.cwd(), options.cache);
        try {
            state_1.State.next(immutable_1.default.from(JSON.parse(fs_1.readFileSync(cacheFile_1) || 'null') || initialState));
        }
        catch (e) { }
        state_1.State.subscribe(function (state) { return fs_1.writeFileSync(cacheFile_1, JSON.stringify(state)); }, function (error) { return console.error(error); }, undefined);
    }
    else if (options.hotLoad === true && typeof localStorage !== 'undefined') {
        // for dev builds in browser
        state_1.State.next(immutable_1.default.from(JSON.parse(localStorage.getItem(cacheKey) || 'null') || initialState));
        state_1.State.subscribe(function (state) { return localStorage.setItem(cacheKey, JSON.stringify(state)); }, function (error) { return console.error(error); }, undefined);
    }
    else if (initialState != undefined) {
        // for production
        state_1.State.next(immutable_1.default.from(initialState));
    }
}
exports.initialize = initialize;
