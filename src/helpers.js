export const setItem = (key, value, stringify = false) => {
  try {
    localStorage.setItem(`${key}`, stringify ? JSON.stringify(value) : value);
  } catch (e) {
    console.warn(`setItem Error: ${JSON.stringify(e)}`);
  }

  return true;
};

export const getItem = (key, defaultValue, parse = false) => {
  let value;
  try {
    value = localStorage.getItem(key);
    if (value) {
      value = parse ? JSON.parse(value) : value;
    }
  } catch (e) {
    console.warn(`getItem Error: ${JSON.stringify(e)}`);
  }

  return value || defaultValue;
};

export const isEqualStr = (str, toCompare) => {
  return str.toLowerCase() === toCompare.toLowerCase();
};
