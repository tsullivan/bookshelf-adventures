import dictionary from "./dictionary.json";

export type Dictionary = typeof dictionary;
export type Vocabulary = Record<string, string[]>;

type DictionaryKey = keyof Dictionary;

type ReduceCallback = (
  accum: Vocabulary,
  kSet: string,
  kind: string,
  thing: string,
  index: number
) => Vocabulary;

function createDictionary(
  cb: ReduceCallback,
  accum: Vocabulary
): { dictionary: Dictionary; vocabulary: Vocabulary } {
  const dataKeys = Object.keys(dictionary);
  for (const kI in dataKeys) {
    const kSet = dataKeys[kI] as DictionaryKey;

    for (let sI = 0; sI < dictionary[kSet].length; sI++) {
      const s = dictionary[kSet][sI];
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
  // FIXME shrink the vocabulary choices by removing duplicates
  return { dictionary, vocabulary: accum };
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
