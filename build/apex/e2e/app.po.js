"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var MatngularPage = /** @class */ (function () {
    function MatngularPage() {
    }
    MatngularPage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    MatngularPage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    return MatngularPage;
}());
exports.MatngularPage = MatngularPage;
//# sourceMappingURL=app.po.js.map