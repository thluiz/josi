var fs = require('fs');
var path = require('path');
const express = require('express');

export function initialize(app, routes_dir, level = 0) {
    fs.readdirSync(routes_dir).forEach(function(file) {
        var fullName = path.join(routes_dir, file);
        var stat = fs.lstatSync(fullName);

        if (stat.isDirectory()) {            
            initialize(app, fullName);
        } else if (file.toLowerCase().indexOf('.js') > 0 && file.toLowerCase().indexOf('.map') < 0) {            
            let module_path = path.join(routes_dir, file).replace("src\\", "..\\");
            
            var fn = require(module_path);            
            fn.routes(app);            
        }
    });    
}