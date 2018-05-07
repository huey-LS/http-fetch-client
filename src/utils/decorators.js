export function alias (aliasNames, ...args) {
  if ('string' === typeof aliasNames) {
    aliasNames = [aliasNames, ...args];
  }
  if(!Array.isArray(aliasNames) || aliasNames.length === 0) {
    throw new Error('aliasName not set')
  }

  return function (target, key, descriptor) {
    aliasNames.forEach((aliasName) => {
      target[aliasName] = descriptor.value;
    })
    return descriptor;
  }
}

// export function bindAutoConsole (name) {
//   return function (...args) {
//     autoConsole(...args, `[${name}]`)
//   };
// }

// export function autoConsole (target, key, descriptor, prefix = '') {
//   let oldFn = descriptor.value;
//   descriptor.value = function (...args) {
//     console.log(`${prefix}run ${oldFn.name} start`);
//     console.log('args:', args);
//     let result = oldFn.call(this, ...args);
//     console.log('result:', result);
//     console.log(`${prefix}run ${oldFn.name} end`);
//     return result;
//   }
//   return descriptor;
// }
