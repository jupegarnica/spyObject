import { spyObject } from './spyObject.js';

import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { spy } from 'https://deno.land/x/mock@v0.10.0/mod.ts';

Deno.test('it is equal to its target', () => {
  const data = {
    b: {
      c: 2,
    },
  };
  const clone = spyObject(data, {});
  assertEquals(clone, data);
  assertEquals(clone, {
    b: {
      c: 2,
    },
  });
});

Deno.test('set clone and it is equal to its target', () => {
  const data = {
    b: {
      c: 2,
    },
  };
  const clone = spyObject(data, {});
  clone.b.c = 3;

  assertEquals(data.b.c, 3);
  assertEquals(clone.b.c, 3);
});

Deno.test('set target and it is equal to its clone', () => {
  const data = {
    b: {
      c: 2,
    },
  };
  const clone = spyObject(data, {});
  data.b.c = 3;

  assertEquals(data.b.c, 3);
  assertEquals(clone.b.c, 3);
});

Deno.test('delete property in clone', () => {
  const data = {
    a: 1,
    b: {
      c: 2,
    },
  };
  const clone = spyObject(data, {});
  delete clone.a;
  assertEquals(clone, data);
  assertEquals(data.a, undefined);
  assertEquals(clone.a, undefined);
});

Deno.test('delete property in target', () => {
  const data = {
    a: 1,
    b: {
      c: 2,
    },
  };

  const clone = spyObject(data, {});
  delete data.a;
  assertEquals(data.a, undefined);
  assertEquals(clone.a, undefined);
  assertEquals(clone, {
    b: {
      c: 2,
    },
  });
});

Deno.test('works with a method', () => {
  const data = {
    a: 1,
    fn() {
      return this.a;
    },
  };

  const clone = spyObject(data, {});
  assertEquals(clone.fn(), 1);
});

Deno.test('works set config', () => {
  const data = {
    a: 1,
    b: {
      c: 2,
    },
  };
  const spier = spy();
  const clone = spyObject(data, {
    set(path) {
      spier(path);
      return true;
    },
  });

  clone.b.c = 3;
  assertEquals(spier.calls.length, 1);
  assertEquals(spier.calls[0].args, [['b', 'c']]);
});

Deno.test('works get config', () => {
  const data = {
    a: 1,
    b: {
      c: {
        d: 2,
      },
    },
  };
  const spier = spy();
  const clone = spyObject(data, {
    get(path) {
      spier(path);
    },
  });
  clone.b.c.d;
  assertEquals(spier.calls.length, 3);
  assertEquals(spier.calls[0].args, [['b']]);
  assertEquals(spier.calls[1].args, [['b', 'c']]);
  assertEquals(spier.calls[2].args, [['b', 'c', 'd']]);
});

Deno.test('works delete config', () => {
  const data = {
    a: 1,
    b: {
      c: {
        d: 2,
      },
    },
  };
  const spier = spy();
  const clone = spyObject(data, {
    delete(path) {
      spier(path);
    },
  });
  delete clone.b.c.d;
  assertEquals(spier.calls.length, 1);
  assertEquals(spier.calls[0].args, [['b', 'c', 'd']]);
});

Deno.test('example works', () => {
  const data = {
    a: 1,
    b: {
      c: 2,
    },
    fn() {
      return this.b.c;
    },
  };
  const spier = spy();

  const spied = spyObject(data, {
    set(path, target, prop, value) {
      spier(`set ${value} at /${path.join('/')}`);
      spier('old value:', target[prop]);
      spier('new value:', value);
    },

    get(path, target, prop) {
      spier(
        `read ${JSON.stringify(
          target[prop],
        )} at path: /${path.join('/')}`,
      );
    },

    delete(path, target, prop) {
      spier(`delete at path: /${path.join('/')}`);
      spier('old value:', target[prop]);
    },
    call(path, target, prop, args, returned) {
      spier('returned:', returned);
      spier('called width', args);
    },
  });

  spied.a = 2;
  assertEquals(data.a, 2);
  assertEquals(spier.calls.length, 3);
  assertEquals(spier.calls[0].args, [`set 2 at /a`]);
  assertEquals(spier.calls[1].args, [`old value:`, 1]);
  assertEquals(spier.calls[2].args, [`new value:`, 2]);

  spied.b.c;
  assertEquals(spier.calls.length, 5);
  assertEquals(spier.calls[3].args, [
    `read {"c":2} at path: /b`,
  ]);
  assertEquals(spier.calls[4].args, [`read 2 at path: /b/c`]);

  delete spied.a;
  assertEquals(spier.calls.length, 7);
  assertEquals(spier.calls[5].args, [`delete at path: /a`]);
  assertEquals(spier.calls[6].args, [`old value:`, 2]);

  assertEquals(spied.fn(1, 2), 2);
  assertEquals(spier.calls.length, 10);
  assertEquals(spier.calls[7].args, [
    `read undefined at path: /fn`,
  ]);
  assertEquals(spier.calls[8].args, [`returned:`, 2]);
  assertEquals(spier.calls[9].args, [`called width`, [1, 2]]);
});

Deno.test('spy method calls', () => {
  const data = {
    fn: () => 'hello',
  };
  const spier = spy();

  const spied = spyObject(data, {
    call(path, target, prop, args, returned) {
      spier(`call at /${path.join('/')}`);
      spier(`call args: ${args}`);
      spier(`returned: ${returned}`);
    },
  });

  assertEquals(spied.fn(1, 2), 'hello');
  assertEquals(spier.calls.length, 3);
  assertEquals(spier.calls[0].args, [`call at /fn`]);
  assertEquals(spier.calls[1].args, [`call args: 1,2`]);
  assertEquals(spier.calls[2].args, [`returned: hello`]);
});