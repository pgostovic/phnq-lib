export const isSubset = (set, subset) => [...subset].filter(elem => !set.has(elem)).length === 0;

export const intersection = (set1, set2) => new Set([...set1].filter(elem => set2.has(elem)));

export const intersects = (set1, set2) => intersection(set1, set2).size > 0;

export const uniq = (items, getKey = item => item) => {
  const map = new Map();
  items.forEach(item => {
    map.set(getKey(item), item);
  });
  return [...map.values()];
};

export const shuffle = array => {
  const shuffled = [...array];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const iRand = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[iRand];
    shuffled[iRand] = temp;
  }
  return shuffled;
};
