"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Immutable = require("seamless-immutable");
var state_1 = require("./state");
function initialize(initialState, options) {
    options = options || { domain: 'default' };
    var cacheKey = "reflux-cache:" + options.domain;
    if (options.hotLoad) {
        // for dev builds
        state_1.State.next(Immutable.from(JSON.parse(localStorage.getItem(cacheKey) || 'null') || initialState));
        state_1.State.subscribe(function (state) { return localStorage.setItem(cacheKey, JSON.stringify(state)); }, function (error) { return console.error(error); }, undefined);
    }
    else if (initialState != undefined) {
        // for production
        state_1.State.next(Immutable.from(initialState));
    }
}
exports.initialize = initialize;
