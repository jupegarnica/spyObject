const isObject = (obj) =>
  typeof obj === 'object' && obj !== null;

const get = (target, key, conf, path) => {
  let value = target[key];
  if (isObject(value)) {
    value = spyObject(value, conf, path);
  }
  return value;
};

export const spyObject = (obj, handler = {}, basePath = []) => {
  const _handler = {};

  // for (const key in handler) {
  //   _handler[key] = (target, prop, ...args) =>
  //     handler[key](
  //       basePath.concat(prop),
  //       target,
  //       prop,
  //       ...args,
  //     ) ?? true;
  // }

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
