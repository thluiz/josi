/// from https://gist.github.com/fracz/972ff3abdaf00b2b6dd94888df0a393b
/// and https://github.com/darrylhodgins/typescript-memoize

export function cache(asyncExec: boolean = false, timeout?: number, hashFunction?: (...args: any[]) => any) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor.value != null) {
      descriptor.value = getNewFunction(descriptor.value, hashFunction, asyncExec, timeout);
    } else if (descriptor.get != null) {
      descriptor.get = getNewFunction(descriptor.get, hashFunction, asyncExec, timeout);
    } else {
      throw new Error("Only put a Memoize() decorator on a method or get accessor.");
    }
  };
}

let counter = 0;
const cacheMap: Array<Map<any, any>> = [];

function getNewFunction(
  originalMethod: () => void,
  hashFunction?: (...args: any[]) => any,
  asyncCache = false,
  timeout: number = null
) {
  const identifier = ++counter;

  // The function returned here gets called instead of originalMethod.
  return async function(...args: any[]) {
    const propValName = `__cached_value_${identifier}`;
    const propMapName = `__cached_map_${identifier}`;

    let returnedValue: any;

    if (hashFunction || args.length > 0) {
      // Get or create map
      if (!this.hasOwnProperty(propMapName)) {
        Object.defineProperty(this, propMapName, {
          configurable: false,
          enumerable: false,
          writable: false,
          value: new Map<any, any>()
        });
      }
      if (!cacheMap[propMapName]) {
        cacheMap[propMapName] = new Map();
      }

      let hashKey: any;

      if (hashFunction) {
        hashKey = hashFunction.apply(this, args);
      } else {
        hashKey = args[0];
      }

      if (cacheMap[propMapName].has(hashKey)) {
        returnedValue = cacheMap[propMapName].get(hashKey);
      } else {
        if (asyncCache) {
          returnedValue = await originalMethod.apply(this, args);
        } else {
          returnedValue = originalMethod.apply(this, args);
        }

        cacheMap[propMapName].set(hashKey, returnedValue);
        if (timeout > 0) {
          setTimeout(() => {
            cacheMap[propMapName].delete(hashKey);
          }, timeout);
        }
      }
    } else {
      if (this.hasOwnProperty(propValName)) {
        returnedValue = this[propValName];
      } else {
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
  };
}
