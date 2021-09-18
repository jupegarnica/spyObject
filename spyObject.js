const isObject = (obj) =>
  typeof obj === 'object' && obj !== null;

const get = (target, prop, handler, path) => {
  let value = target[prop];
  if (isObject(value)) {
    value = spyObject(value, handler, path);
  } else if (
    Object.hasOwnProperty.call(target, prop) &&
    typeof value === 'function'
  ) {
    const baseFn = value.bind(target);

    value = function (...args) {
      const returned = baseFn(...args);
      handler.call?.(path, target, prop, args, returned);
      return returned;
    };
  }
  return value;
};

export const spyObject = (obj, handler = {}, basePath = []) => {
  const _handler = {};

  _handler.get = (target, prop) => {
    const nextBasePath = basePath.concat(prop);
    if (handler.get) handler.get(nextBasePath, target, prop);
    return get(target, prop, handler, nextBasePath);
  };

  if (handler.set) {
    _handler.set = (target, prop, value) => {
      const nextBasePath = basePath.concat(prop);
      handler.set(nextBasePath, target, prop, value);
      target[prop] = value;
      return true;
    };
  }

  if (handler.delete) {
    _handler.deleteProperty = (target, prop) => {
      const nextBasePath = basePath.concat(prop);
      handler.delete(nextBasePath, target, prop);
      delete target[prop];
      return true;
    };
  }

  return new Proxy(obj, _handler);
};
