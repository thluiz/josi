"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_service_1 = require("../services/firebase-service");
function firebaseEmitter(collection, type) {
    return function (target, method, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield originalMethod.apply(this, args);
                console.log(result);
                if (result.success) {
                    firebase_service_1.FirebaseService.emit_event(collection, {
                        type, data: JSON.stringify(result.data)
                    });
                }
                return result;
            });
        };
        return descriptor;
    };
}
exports.firebaseEmitter = firebaseEmitter;
function firebaseMultipleEmitter(collection, type) {
    return function (target, method, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield originalMethod.apply(this, args);
                if (result.success) {
                    result.data.forEach(element => {
                        firebase_service_1.FirebaseService.emit_event(collection, {
                            type, data: JSON.stringify(result.data)
                        });
                    });
                }
                return result;
            });
        };
        return descriptor;
    };
}
exports.firebaseMultipleEmitter = firebaseMultipleEmitter;
//# sourceMappingURL=firebase-emitter-decorator.js.map