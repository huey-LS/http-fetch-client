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