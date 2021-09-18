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
    deleteProperty(path) {
      spier(path);
      // return true;
    },
  });
  delete clone.b.c.d;
  assertEquals(spier.calls.length, 1);
  assertEquals(spier.calls[0].args, [['b', 'c', 'd']]);
});

Deno.test('spy method', () => {
  const data = {
    a: 1,
    b: {
      c: {
        fn: () => 2,
      },
    },
  };
  const spier = spy();
  const clone = spyObject(data, {
    apply(path) {
      spier(path);
      // return true;
    },
  });
  delete clone.b.c.d;
  assertEquals(spier.calls.length, 1);
  assertEquals(spier.calls[0].args, [['b', 'c', 'fn']]);
});
