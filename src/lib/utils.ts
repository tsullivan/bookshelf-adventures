export function sample<T>(arr: Array<T>) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(array: T[]): T[] {
  const finalArray: T[] = [...array];
  let currentIndex = array.length;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [finalArray[currentIndex], finalArray[randomIndex]] = [
      finalArray[randomIndex],
      finalArray[currentIndex],
    ];
  }

  return finalArray;
}

