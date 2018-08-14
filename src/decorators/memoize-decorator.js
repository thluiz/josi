"use strict";
/// from https://gist.github.com/fracz/972ff3abdaf00b2b6dd94888df0a393b
/// and https://github.com/darrylhodgins/typescript-memoize
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function Memoize(asyncMemoize = false, timeout, hashFunction) {
    return (target, propertyKey, descriptor) => {
        if (descriptor.value != null) {
            descriptor.value = getNewFunction(descriptor.value, hashFunction, asyncMemoize, timeout);
        }
        else if (descriptor.get != null) {
            descriptor.get = getNewFunction(descriptor.get, hashFunction, asyncMemoize, timeout);
        }
        else {
            throw new Error("Only put a Memoize() decorator on a method or get accessor.");
        }
    };
}
exports.Memoize = Memoize;
let counter = 0;
const memoizeMap = [];
function getNewFunction(originalMethod, hashFunction, asyncMemoize = false, timeout = null) {
    const identifier = ++counter;
    // The function returned here gets called instead of originalMethod.
    return function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const propValName = `__memoized_value_${identifier}`;
            const propMapName = `__memoized_map_${identifier}`;
            let returnedValue;
            if (hashFunction || args.length > 0) {
                // Get or create map
                if (!this.hasOwnProperty(propMapName)) {
                    Object.defineProperty(this, propMapName, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: new Map()
                    });
                }
                if (!memoizeMap[propMapName]) {
                    memoizeMap[propMapName] = new Map();
                }
                let hashKey;
                if (hashFunction) {
                    hashKey = hashFunction.apply(this, args);
                }
                else {
                    hashKey = args[0];
                }
                if (memoizeMap[propMapName].has(hashKey)) {
                    returnedValue = memoizeMap[propMapName].get(hashKey);
                }
                else {
                    if (asyncMemoize) {
                        returnedValue = yield originalMethod.apply(this, args);
                    }
                    else {
                        returnedValue = originalMethod.apply(this, args);
                    }
                    memoizeMap[propMapName].set(hashKey, returnedValue);
                    if (timeout > 0) {
                        setTimeout(() => {
                            memoizeMap[propMapName].delete(hashKey);
                        }, timeout);
                    }
                }
            }
            else {
                if (this.hasOwnProperty(propValName)) {
                    returnedValue = this[propValName];
                }
                else {
                    returnedValue = originalMethod.apply(this, args);
                    Object.defineProperty(this, propValName, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: returnedValue
                    });
                }
            }
            return returnedValue;
        });
    };
}
//# sourceMappingURL=memoize-decorator.js.map