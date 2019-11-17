export function getRandomElementOfEnum<T extends { [key: number]: string | number }>(
  e: T,
): T[keyof T] {
  const keys = Object.keys(e);

  const randomKeyIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomKeyIndex];

  // Numeric enums members also get a reverse mapping from enum values to enum names.
  // So, if a key is a number, actually it a value of a numeric enum.
  // see https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings
  const randomKeyNumber = Number(randomKey);
  return isNaN(randomKeyNumber)
    ? e[randomKey as keyof T]
    : ((randomKeyNumber as unknown) as T[keyof T]);
}

export type NodeChildren<T> = Array<ITreeNode<T>>;

export type CallbackTreeData<T> = (node: ITreeNode<T>, parent: ITreeNode<T>) => T;

export interface ITreeParams<T> {
  depth: number;
  data: CallbackTreeData<T>;
}

export interface ITreeNode<T> {
  data: T;
  children: Array<ITreeNode<T>>;
  depth: number;
}

export function createTree<T>(
  args: ITreeParams<T>,
  parent: ITreeNode<T>,
  currentDepth: number,
): ITreeNode<T> {
  const depth = !parent ? 0 : currentDepth;

  const node: ITreeNode<T> = {
    children: [],
    data: null,
    depth,
  };

  if (depth < args.depth) {
    const spread = randomInt(0, depth === 0 ? 4 : 3);

    for (let i = 0; i < spread; i++) {
      node.children.push(createTree(args, node, depth + 1));
    }
  }

  node.data = args.data(node, parent);

  return node;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

export function gaussian(): number {
  let x1: number;
  let x2: number;
  let r: number;
  do {
    x1 = 2 * Math.random() - 1;
    x2 = 2 * Math.random() - 1;
    r = x1 * x1 + x2 * x2;
  } while (r >= 1 || r === 0);
  return Math.sqrt((-2 * Math.log(r)) / r) * x1;
}

export function normalDist(mean: number, stdDev: number): number {
  return mean + gaussian() * stdDev;
}

export interface IDrunkardWalkConfig {
  dimensions: number;
  maxTunnels: number;
  maxLength: number;
}

export function drunkardWalk(
  config: IDrunkardWalkConfig = {
    dimensions: 5,
    maxLength: 3,
    maxTunnels: 3,
  },
): any[][] {
  function initArray(num: number, dimensions: number): any[][] {
    const array = [];
    for (let i = 0; i < dimensions; i++) {
      array.push([]);
      for (let j = 0; j < dimensions; j++) {
        array[i].push(num);
      }
    }
    return array;
  }
  const map = initArray(1, config.dimensions);
  let maxTunnels = config.maxTunnels;
  let currentRow = Math.floor(Math.random() * config.dimensions);
  let currentColumn = Math.floor(Math.random() * config.dimensions);
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let lastDirection: any[] = [];
  let randomDirection;

  while (maxTunnels && config.dimensions && config.maxLength) {
    do {
      randomDirection = directions[Math.floor(Math.random() * directions.length)];
    } while (
      (randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) ||
      (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1])
    );

    const randomLength = Math.ceil(Math.random() * config.maxLength);
    let tunnelLength = 0;
    while (tunnelLength < randomLength) {
      if (
        (currentRow === 0 && randomDirection[0] === -1) ||
        (currentColumn === 0 && randomDirection[1] === -1) ||
        (currentRow === config.dimensions - 1 && randomDirection[0] === 1) ||
        (currentColumn === config.dimensions - 1 && randomDirection[1] === 1)
      ) {
        break;
      } else {
        map[currentRow][currentColumn] = 0;
        currentRow += randomDirection[0];
        currentColumn += randomDirection[1];
        tunnelLength++;
      }
    }
    if (tunnelLength) {
      lastDirection = randomDirection;
      maxTunnels--;
    }
  }
  return map;
}

export function arrayRand<T>(input: T[]): T {
  return input[Math.floor(Math.random() * input.length)];
}

export function weightedRand(spec: any): number {
  let sum = 0;
  const r = Math.random();
  // tslint:disable-next-line: forin
  for (const i in spec) {
    sum += spec[i];
    if (r <= sum) {
      return parseFloat(i);
    }
  }
}

// Code adapted from http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/emt19937ar.html
// Original copyright:
/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

export function mersenneTwister(seed: number): any {
  const N = 624;
  const M = 397;
  const MATRIX_A = 0x9908b0df;
  const UPPER_MASK = 0x80000000;
  const LOWER_MASK = 0x7fffffff;
  const MAG01 = [0, MATRIX_A];

  const mt: Uint32Array = new Uint32Array(N);
  let mti = 0;

  // tslint:disable-next-line: no-bitwise
  mt[0] = seed >>> 0;
  for (mti = 1; mti < N; mti++) {
    // tslint:disable-next-line: no-bitwise
    mt[mti] = (1812433253 * (mt[mti - 1] ^ (mt[mti - 1] >>> 30)) + mti) >>> 0;
  }

  /* Generates a random number on [0,0xFFFFFFFF]-interval. */
  function int32(): number {
    let y;

    if (mti >= N) {
      let kk = 0;
      for (; kk < N - M; kk++) {
        // tslint:disable-next-line: no-bitwise
        y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
        // tslint:disable-next-line: no-bitwise
        mt[kk] = mt[kk + M] ^ (y >>> 1) ^ MAG01[y & 1];
      }
      for (; kk < N - 1; kk++) {
        // tslint:disable-next-line: no-bitwise
        y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
        // tslint:disable-next-line: no-bitwise
        mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ MAG01[y & 1];
      }
      // tslint:disable-next-line: no-bitwise
      y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK);
      // tslint:disable-next-line: no-bitwise
      mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ MAG01[y & 1];
      mti = 0;
    }

    y = mt[mti++];

    // tslint:disable-next-line: no-bitwise
    y ^= y >>> 11;
    // tslint:disable-next-line: no-bitwise
    y ^= (y << 7) & 0x9d2c5680;
    // tslint:disable-next-line: no-bitwise
    y ^= (y << 15) & 0xefc60000;
    // tslint:disable-next-line: no-bitwise
    y ^= y >>> 18;

    // tslint:disable-next-line: no-bitwise
    return y >>> 0;
  }

  /* Generates a random number on [0,1]-real-interval. */
  function real1(): number {
    return int32() * (1.0 / 4294967295.0); // Divided by 2^32-1
  }

  /* Generates a random number on [0,1)-real-interval. */
  function real2(): number {
    return int32() * (1.0 / 4294967296.0); // Divided by 2^32
  }

  /* Generates a random number on (0,1)-real-interval. */
  function real3(): number {
    return (int32() + 0.5) * (1.0 / 4294967296.0); // Divided by 2^32
  }

  /* Generates a random number on [0,1) with 53-bit resolution. */
  function res53(): number {
    // tslint:disable-next-line: no-bitwise
    const a = int32() >>> 5;
    // tslint:disable-next-line: no-bitwise
    const b = int32() >>> 6;
    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
  }

  return { int32, real1, real2, real3, res53 };
}
