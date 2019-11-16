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

export type CallbackTreeData<T> = (depth: number, node: NodeChildren<T>) => T;

export interface ITreeParams<T> {
  depth: number;
  spread: number;
  data: CallbackTreeData<T>;
}

export interface ITreeNode<T> {
  data: T;
  children: Array<ITreeNode<T>>;
}

export function createTree<T>(
  args: ITreeParams<T>,
  currentDepth: number | undefined,
): ITreeNode<T> {
  const depth = currentDepth === undefined ? 0 : currentDepth;

  const node: ITreeNode<T> = {
    children: [],
    data: null,
  };

  if (depth < args.depth) {
    for (let i = 0; i < args.spread; i++) {
      node.children.push(createTree(args, depth + 1));
    }
  }

  node.data = args.data(depth, node.children);

  return node;
}
