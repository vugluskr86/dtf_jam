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
