export function treeDepth(
  tree: Record<string, string>,
  start: string,
  stop: string,
  recursionDepth: number = 100
): number | null {
  let stepCount: number = 0;
  let currentstep = start;

  while (currentstep !== stop) {
    if (!tree[currentstep] || stepCount >= recursionDepth) {
      return null;
    }
    currentstep = tree[currentstep];
    stepCount += 1;
  }
  return stepCount;
}
