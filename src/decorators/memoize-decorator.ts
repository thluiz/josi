/// from https://gist.github.com/fracz/972ff3abdaf00b2b6dd94888df0a393b
/// and https://github.com/darrylhodgins/typescript-memoize

export function Memoize(asyncMemoize: boolean = false, timeout?: number, hashFunction?: (...args: any[]) => any) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor.value != null) {
      descriptor.value = getNewFunction(descriptor.value, hashFunction, asyncMemoize, timeout);
    } else if (descriptor.get != null) {
      descriptor.get = getNewFunction(descriptor.get, hashFunction, asyncMemoize, timeout);
    } else {
      throw new Error("Only put a Memoize() decorator on a method or get accessor.");
    }
  };
}

let counter = 0;
const memoizeMap: Array<Map<any, any>> = [];

function getNewFunction(
  originalMethod: () => void,
  hashFunction?: (...args: any[]) => any,
  asyncMemoize = false,
  timeout: number = null
) {
  const identifier = ++counter;

  // The function returned here gets called instead of originalMethod.
  return async function(...args: any[]) {
    const propValName = `__memoized_value_${identifier}`;
    const propMapName = `__memoized_map_${identifier}`;

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
      if (!memoizeMap[propMapName]) {
        memoizeMap[propMapName] = new Map();
      }

      let hashKey: any;

      if (hashFunction) {
        hashKey = hashFunction.apply(this, args);
      } else {
        hashKey = args[0];
      }

      if (memoizeMap[propMapName].has(hashKey)) {
        returnedValue = memoizeMap[propMapName].get(hashKey);
      } else {
        if (asyncMemoize) {
          returnedValue = await originalMethod.apply(this, args);
        } else {
          returnedValue = originalMethod.apply(this, args);
        }

        memoizeMap[propMapName].set(hashKey, returnedValue);
        if (timeout > 0) {
          setTimeout(() => {
            memoizeMap[propMapName].delete(hashKey);
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
