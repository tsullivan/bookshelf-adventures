import dictionary from "./dictionary.json";

export type DictionaryKey = string;

export type DictionaryData = Record<DictionaryKey, string[]>;

export interface Dictionary {
  [key: DictionaryKey]: string[];
}
type ReduceCallback = (
  accum: Dictionary,
  kSet: string,
  kind: string,
  thing: string,
  index: number
) => Dictionary;

function createDictionary(
  cb: ReduceCallback,
  accum: Dictionary
): { data: DictionaryData; dictionary: Dictionary } {
  const data: DictionaryData = { ...dictionary };
  const dataKeys: Array<keyof typeof data> = Object.keys(data);
  for (const kI in dataKeys) {
    const kSet = dataKeys[kI];

    for (let sI = 0; sI < data[kSet].length; sI++) {
      const s = data[kSet][sI];
      const matches = s.match(/\${\S+:[^}]+}/g);
      if (matches) {
        for (const mI in matches) {
          const m = matches[mI];
          const subMatches = m.match(/\${(\S+):([^}]+)}/);
          const kindAndThing = subMatches?.splice(1, 2);
          if (kindAndThing) {
            const [kind, thing] = kindAndThing;
            accum = cb(accum, kSet, kind, thing, sI);
          }
        }
      }
    }
  }
  return { data, dictionary: accum };
}

export const getDictionary = () =>
  createDictionary((accum, _kSet, kind, thing) => {
    if (accum[kind]) {
      accum[kind].push(thing);
    } else {
      accum[kind] = [];
      accum[kind].push(thing);
    }
    return accum;
  }, {});
