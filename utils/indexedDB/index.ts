// db.ts

import { User } from "@/components/types/user";
import { userSchema } from "../zod/authSchema";

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

export enum Stores {
  User = "user",
}

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open("authDB");

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.User)) {
        db.createObjectStore(Stores.User, { keyPath: "id" });
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export const addUser = (data: User): Promise<User | string | null> => {
  return new Promise((resolve, reject) => {
    request = indexedDB.open("authDB", version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(Stores.User, "readwrite");
      const store = tx.objectStore(Stores.User);
      store.add({ id: "user", ...data });
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        reject(error);
      } else {
        reject("Unknown error");
      }
    };
  });
};

export const getUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open("authDB");

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(Stores.User, "readonly");
      const store = tx.objectStore(Stores.User);
      const res = store.get("user");
      res.onsuccess = () => {
        const user = userSchema.safeParse(res.result);
        if (user.success) {
          resolve(user.data);
        } else {
          resolve(null);
        }
      };
      res.onerror = () => {
        resolve(null);
      };
    };
  });
};

export const deleteUser = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // again open the connection
    request = indexedDB.open("authDB", version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(Stores.User, "readwrite");
      const store = tx.objectStore(Stores.User);
      const res = store.delete("user");

      // add listeners that will resolve the Promise
      res.onsuccess = () => {
        resolve(true);
      };
      res.onerror = () => {
        resolve(false);
      };
    };
  });
};
