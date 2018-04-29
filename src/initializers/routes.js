"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
const express = require('express');
function initialize(app, routes_dir) {
    fs.readdirSync(routes_dir).forEach(function (file) {
        var fullName = path.join(routes_dir, file);
        var stat = fs.lstatSync(fullName);
        if (stat.isDirectory()) {
            initialize(app, fullName);
        }
        else if (file.toLowerCase().indexOf('.js') > 0 && file.toLowerCase().indexOf('.map') < 0) {
            var fn = require('../routes/' + file);
            fn.routes(app);
        }
    });
    app.get(/^((?!\.).)*$/, (req, res) => {
        var path = "index.html";
        res.sendfile(path, { root: "./apex/public" });
    });
    app.use(express.static("./apex/public"));
}
exports.initialize = initialize;
//# sourceMappingURL=routes.js.map