# spy object

A tool to subscribe to deep object changes.

**Spy on set, get delete or call a method**

## usage

```js
import {spyObject} from 'https://deno.land/x/spy_object@v0.4.0/spyObject.js'
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
    console.log('called with', args);
  },
});

spied.a = 2;

spied.b.c;

delete spied.a;

spied.fn(1, 2);



// LOGS:
///////////////
// set 2 at /a
// old value: 1
// new value: 2
// read {"c":2} at path: /b
// read 2 at path: /b/c
// delete at path: /a
// old value: 2
// read undefined at path: /fn
// returned: 2
// called with [ 1, 2 ]
```


Run example:

```
deno run https://deno.land/x/spy_object@v0.4.0/example.js

```
