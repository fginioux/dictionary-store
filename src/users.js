import { v4 as uuidv4 } from "uuid";
import { setItem, getItem } from "./helpers";
import { StorePrefix } from "./constants";

const StoreKey = `${StorePrefix}--users`;

export const Users = {
  register: async (data) => {
    const toRegister = { ...data, id: uuidv4(), connexions: 0 };
    const { email } = toRegister;
    let users = getAllUsers();

    let user = getByEmail(email);
    if (user) {
      console.warn(`User already registered with email "${email}".`);
      user = { ...user, connexions: ++user.connexions };
      users = users.map((u) => {
        if (u.id === user.id) {
          return { ...user };
        }

        return u;
      });
    } else {
      users = [...users, toRegister];
    }

    setItem(StoreKey, users, true);

    return user || toRegister;
  },

  get: async ({ id, email }) => {
    if (email) {
      return getByEmail(email);
    }

    return getAllUsers().find((u) => u.id === id);
  },
};

const getAllUsers = () => {
  return getItem(StoreKey, [], true);
};

const getByEmail = (email) => {
  const u = getAllUsers().find((u) => {
    return u.email === email;
  });

  return u || null;
};
