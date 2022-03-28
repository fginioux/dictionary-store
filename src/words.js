import { v4 as uuidv4 } from "uuid";
import { setItem, getItem, isEqualStr } from "./helpers";
import { StorePrefix } from "./constants";

const StoreKey = `${StorePrefix}--words`;

export const Words = {
  get: async ({ userId, id, languageId }) => {
    return getWord({ userId, id, languageId });
  },

  getAll: async ({ userId, languageId }) => {
    return getAllWords({ userId, languageId });
  },

  add: async (data) => {
    const { userId, languageId, label } = data;
    if (!userId || !languageId) {
      throw Error(
        `Error: prop userId or languageId is missing in ${JSON.stringify(
          data
        )}.`
      );
    }

    const word = getWord({ userId, languageId, label });
    if (word) {
      console.warn(`Warning: word with label "${label}" already exists.`);
    } else {
      const success = 0;
      setWords([
        ...getAllWords(),
        {
          ...data,
          lockedUntil: getLockDelay(success),
          success,
          flag: false,
          id: uuidv4(),
        },
      ]);
    }

    return getAllWords({ userId, languageId });
  },

  update: async (data) => {
    return updateWord(data);
  },

  delete: async ({ userId, id, languageId }) => {
    const words = getAllWords();
    if (
      getAllWords({ userId, languageId }).find((w) => {
        return w.userId === userId && w.id === id;
      })
    ) {
      setWords(words.filter((w) => w.id !== id));
    }

    return getAllWords({ userId, languageId });
  },

  flag: async ({ userId, id, languageId, flag }) => {
    return updateWord({ userId, id, languageId, flag });
  },

  search: async ({ term, inTranslation }, { userId, languageId }) => {
    const words = getAllWords({ userId, languageId }, true);

    return words.filter(({ label, translation }) => {
      const txt = inTranslation ? translation : label;

      return txt.toLowerCase().startsWith(term.toLowerCase());
    });
  },

  getRandom: async ({ limit }, { userId, languageId }) => {
    const now = new Date().getTime();
    let words = getAllWords({ userId, languageId }).filter(
      (w) => w.flag !== true && now >= w.lockedUntil
    );

    // Shuffle results
    words.sort(() => Math.random() - 0.5);

    return words.slice(0, limit || 10);
  },

  failed: async ({ userId, id, languageId }) => {
    let word = getWord({ userId, id, languageId });
    const success = 0;
    word = { ...word, lockedUntil: getLockDelay(success), success };

    return updateWord(word);
  },

  succeed: async ({ userId, id, languageId }) => {
    let word = getWord({ userId, id, languageId });
    const success = (word.success || 0) + 1;
    word = { ...word, lockedUntil: getLockDelay(success), success };

    return updateWord(word);
  },
};

const getAllWords = ({ userId, languageId }, sort = false) => {
  let words = getItem(StoreKey, [], true);
  if (userId && languageId) {
    words = words.filter((w) => {
      return w.userId === userId && w.languageId === languageId;
    });
  }

  if (sort) {
    words.sort((a, b) => {
      return a.label > b.label;
    });
  }

  return words;
};

const getWord = ({ id, userId, languageId, label }) => {
  return getAllWords({ userId, languageId }).find((w) => {
    if (label) {
      return isEqualStr(w.label, label);
    }

    return w.id === id;
  });
};

const updateWord = (data) => {
  const { userId, id, languageId } = data;
  if (!userId) {
    throw Error(`prop userId is missing in ${JSON.stringify(data)}.`);
  }

  const word = getWord({ userId, id, languageId });
  if (word) {
    setWords(
      getAllWords().map((w) => {
        if (w.id === id) {
          return { ...w, ...data };
        }

        return w;
      })
    );
  }

  return getWord({ userId, id });
};

const setWords = (words) => {
  try {
    setItem(StoreKey, words, true);
  } catch (e) {
    return false;
  }

  return true;
};

const getLockDelay = (success) => {
  let delay = 0;
  if (success === 1) {
    delay = 1 * 60; // 8 * 60 * 60
  } else if (success === 2) {
    delay = 3 * 60; // 24 * 60 * 60
  } else if (success === 3) {
    delay = 10 * 60; // 7 * 24 * 60 * 60
  } else if (success === 4) {
    delay = 20 * 60; // 30 * 24 * 60 * 60
  } else {
    delay = 1 * 60 * 60; // 60 * 24 * 60 * 60
  }

  return new Date().getTime() + delay * 1000;
};
