/**
 * see https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
function to<T, U = Error>(promise: Promise<T>, errorExt?: object): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined];
    });
}

// TODO: to separate file
// tslint:disable-next-line:prefer-array-literal
function getStringEnumValues<E extends Record<keyof E, string>>(e: E): Array<E[keyof E]> {
  // tslint:disable-next-line:prefer-array-literal
  return (Object.keys(e) as Array<keyof E>).map((k) => {
    return e[k];
  });
}

// TODO: to separate file
// tslint:disable-next-line:prefer-array-literal
function getNumberEnumValues<E extends Record<keyof E, number>>(e: E): Array<E[keyof E]> {
  // tslint:disable-next-line:prefer-array-literal
  return (Object.keys(e) as Array<keyof E>).map((k) => {
    return e[k];
  });
}

export { to, getStringEnumValues, getNumberEnumValues };
