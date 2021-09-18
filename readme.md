# spy object

A tool to subscribe to deep object changes

## usage

```js
import {spyObject} from 'https://deno.land/x/spy_object@v0.2.0/spyObject.js'

const data = {
  a: 1,
  b: {
    c: 2,
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
});

spied.a = 2;

spied.b.c;

delete spied.a;

```
