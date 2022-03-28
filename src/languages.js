import { v4 as uuidv4 } from "uuid";
import { setItem, getItem, isEqualStr } from "./helpers";
import { StorePrefix } from "./constants";

const StoreKey = `${StorePrefix}--languages`;

export const Languages = {
  add: async (data) => {
    const { userId } = data;
    if (!userId) {
      throw Error(`Error: prop userId is missing in ${JSON.stringify(data)}.`);
    }

    let languages = getLanguages();
    const { label } = data;
    if (getLanguages(userId).find((l) => isEqualStr(label, l.label))) {
      console.warn(`Warning: language with label "${label}" already exists.`);
    } else {
      setLanguages(
        orderLanguages([...languages, { ...data, id: uuidv4(), userId }])
      );
    }

    return getLanguages(userId);
  },

  get: async ({ userId, id }) => {
    return getLanguages(userId).find((l) => l.id === id);
  },

  getAll: async (userId) => {
    return getLanguages(userId);
  },

  delete: async ({ userId, id }) => {
    const languages = getLanguages();
    const currentLanguage = languages.find(
      (l) => l.id === id && l.userId === userId
    );

    if (currentLanguage) {
      setLanguages(languages.filter((l) => l.id !== id));
    }

    return getLanguages(userId);
  },
};

const getLanguages = (userId) => {
  const languages = getItem(StoreKey, [], true);
  if (userId) {
    return languages.filter((l) => l.userId === userId);
  }

  return languages;
};

const setLanguages = (languages) => {
  setItem(StoreKey, languages, true);

  return [...languages];
};

const orderLanguages = (languages) => {
  return [...languages].sort((a, b) => {
    if (a.label > b.label) {
      return 1;
    }

    return -1;
  });
};
