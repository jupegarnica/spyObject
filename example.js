import { spyObject } from './spyObject.js';
const data = {
  a: 1,
  b: {
    c: 2,
  },
  fn() {
    return this.b.c;
  },
};

const spied = spyObject(data, {
  set(path, target, prop, value) {
    console.log(`set ${value} at /${path.join('/')}`);
    console.log('old value:', target[prop]);
    console.log('new value:', value);
  },

  get(path, target, prop) {
    console.log(
      `read ${JSON.stringify(
        target[prop],
      )} at path: /${path.join('/')}`,
    );
  },

  delete(path, target, prop) {
    console.log(`delete at path: /${path.join('/')}`);
    console.log('old value:', target[prop]);
  },
  call(path, target, prop, args, returned) {
    console.log('returned:', returned);
    console.log('called width', args);
  },
});

spied.a = 2;

spied.b.c;

delete spied.a;
spied.fn(1, 2);