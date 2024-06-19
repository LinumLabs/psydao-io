const isPerfectSquare = (num: number) => {
  const fibPlus = Math.pow(num, 2) * 5 + 4;
  const fibMinus = Math.pow(num, 2) * 5 - 4;

  if (
    Number.isInteger(Math.sqrt(fibPlus)) ||
    Number.isInteger(Math.sqrt(fibMinus))
  ) {
    return true;
  } else return false;
};

export const checkIfFibonacci = (ids: number[]) => {
  ids.sort((a, b) => a - b);
  const isFibonacci: boolean[] = [];

  if (ids.length === 0) {
    throw new Error("No ids were provided");
  } else if (ids.length === 1 || ids.length === 2) {
    console.log("eee");
    ids.forEach((id) => {
      if (id === 0 || id === 1 || isPerfectSquare(id)) {
        isFibonacci.push(true);
      } else isFibonacci.push(false);
      console.log(isFibonacci);
    });
  } else if (ids.length > 2) {
    for (let i = 2; i < ids.length; i++) {
      if (isPerfectSquare(ids[i]) && ids[i] === ids[i - 1] + ids[i - 2]) {
        isFibonacci.push(true);
      } else isFibonacci.push(false);
    }
    // if isFibonacci is false, return empty array - otherwise - return ids and send them through
  }
  if (isFibonacci.includes(false)) {
    return [];
  } else return ids;
};
