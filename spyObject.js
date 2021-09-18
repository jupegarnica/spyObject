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

  for (const key in handler) {
    _handler[key] = (target, prop, ...args) =>
      handler[key](
        basePath.concat(prop),
        target,
        prop,
        ...args,
      ) ?? true;
  }

  _handler.get = (target, prop) => {
    const nextBasePath = basePath.concat(prop);
    if (handler.get) handler.get(nextBasePath, target, prop);
    return get(target, prop, handler, nextBasePath);
  };

  return new Proxy(obj, _handler);
};
