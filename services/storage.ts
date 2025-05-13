import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import * as Crypto from "expo-crypto";
import * as ExpoRandom from "expo-random";

// Enum for storage types
export enum LocalStoreType {
  SECURE_STORAGE = "secure",
  ASYNC_STORAGE = "async",
  SQLITE = "sqlite",
}

// Constants
const LOCAL_DB_NAME = "hesham_fm_storage.db"; // Database name
const DEFAULT_SECURED = true; // Default encryption behavior

// ---
// Augment the SQLite types so that TypeScript recognizes the `transaction` method
// ---

interface SQLiteTransaction {
  executeSql(
    sql: string,
    args?: any[],
    successCallback?: (tx: SQLiteTransaction, result: any) => void,
    errorCallback?: (tx: SQLiteTransaction, error: Error) => boolean
  ): void;
}

interface SQLiteDatabaseWithTransaction extends SQLite.SQLiteDatabase {
  transaction(
    callback: (tx: SQLiteTransaction) => void,
    errorCallback?: (error: Error) => void,
    successCallback?: () => void
  ): void;
}

// Open the database synchronously (and cast it to our extended type)
const db = SQLite.openDatabaseSync(
  LOCAL_DB_NAME
) as unknown as SQLiteDatabaseWithTransaction;

// ---
// Database initialization
// We run a dummy query to ensure that the database is ready before any transaction.
// ---

let dbInitialized = false;
let dbInitializationPromise: Promise<void> | null = null;

const initializeDB = async (): Promise<void> => {
  if (dbInitialized) return;
  if (!dbInitializationPromise) {
    dbInitializationPromise = new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT 1",
          [],
          () => {
            dbInitialized = true;
            resolve();
          },
          (_, error): boolean => {
            reject(error);
            return false;
          }
        );
      });
    });
  }
  return dbInitializationPromise;
};

// ---
// Utility Functions (Encryption, Serialization, etc.)
// ---

const ENCRYPTION_KEY =
  "8865724b18bca813f0a5a06751da65754fdb8a02e7a7fede060f06466b2a1527"; // Replace with a securely stored key

const encryptData = async (data: string): Promise<string> => {
  const ivBytes = await ExpoRandom.getRandomBytesAsync(16);
  const iv = ivBytes.toString(); // For demo purposes; in production, convert the bytes appropriately
  const encrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${iv}:${data}:${ENCRYPTION_KEY}`
  );
  return `${iv}:${encrypted}`;
};

const decryptData = async (encrypted: string): Promise<string> => {
  const [iv, hashed] = encrypted.split(":");
  // This demo "decryption" simply strips off the iv.
  return hashed ? hashed.replace(`${iv}:`, "") : encrypted;
};

const serializeValue = (value: any): string =>
  typeof value === "object" ? JSON.stringify(value) : String(value);

const deserializeValue = (value: string | null): any => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value; // If parsing fails, return as string
  }
};

// ---
// Storage Functions
// Each function that uses the database awaits the initializeDB() call to guarantee readiness.
// ---

export const createTableIfNotExists = async (
  tableName: string
): Promise<void> => {
  await initializeDB();
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (key TEXT PRIMARY KEY, value TEXT);`,
        [],
        () => resolve(),
        (_, error): boolean => {
          console.log("SQLite Table Creation Error:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const setItemInStorage = async (
  name: string,
  value: any,
  type: LocalStoreType = LocalStoreType.SECURE_STORAGE,
  config?: { tableName?: string; secured?: boolean }
): Promise<void> => {
  try {
    const isSecured = config?.secured ?? DEFAULT_SECURED;
    const serializedValue = serializeValue(value);
    const dataToStore =
      type === LocalStoreType.SECURE_STORAGE || !isSecured
        ? serializedValue
        : await encryptData(serializedValue);

    if (type === LocalStoreType.SECURE_STORAGE) {
      await SecureStore.setItemAsync(name, serializedValue);
    } else if (type === LocalStoreType.ASYNC_STORAGE) {
      await AsyncStorage.setItem(name, dataToStore);
    } else if (type === LocalStoreType.SQLITE) {
      if (!config?.tableName)
        throw new Error("Table name is required for SQLite.");
      await createTableIfNotExists(config.tableName);
      // Ensure the database is initialized before the transaction
      await initializeDB();
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO ${config.tableName} (key, value) VALUES (?, ?);`,
          [name, dataToStore]
        );
      });
    }
  } catch (error) {
    console.log("Error Setting Item In Storage", error);
  }
};

export const getItemFromStorage = async (
  name: string,
  type: LocalStoreType = LocalStoreType.SECURE_STORAGE,
  config?: { tableName?: string; secured?: boolean }
): Promise<any> => {
  try {
    const isSecured = config?.secured ?? DEFAULT_SECURED;

    if (type === LocalStoreType.SECURE_STORAGE) {
      const item = await SecureStore.getItemAsync(name);
      return deserializeValue(item);
    } else if (type === LocalStoreType.ASYNC_STORAGE) {
      const storedData = await AsyncStorage.getItem(name);
      return storedData
        ? deserializeValue(
            isSecured ? await decryptData(storedData) : storedData
          )
        : null;
    } else if (type === LocalStoreType.SQLITE) {
      if (!config?.tableName)
        throw new Error("Table name is required for SQLite.");
      // Ensure the database is initialized before the transaction
      await initializeDB();
      return new Promise<any>((resolve) => {
        db.transaction((tx) => {
          tx.executeSql(
            `SELECT value FROM ${config.tableName} WHERE key = ?;`,
            [name],
            async (_, result) => {
              if (result.rows.length > 0) {
                const storedData = result.rows.item(0).value;
                resolve(
                  deserializeValue(
                    isSecured ? await decryptData(storedData) : storedData
                  )
                );
              } else {
                resolve(null);
              }
            },
            (_, error): boolean => {
              console.log("SQLite Fetch Error:", error);
              resolve(null);
              return false;
            }
          );
        });
      });
    }
  } catch (error) {
    console.log("Error Getting Item From Storage", error);
    return null;
  }
};

export const removeItemFromStorage = async (
  name: string,
  type: LocalStoreType = LocalStoreType.SECURE_STORAGE,
  config?: { tableName?: string }
): Promise<void> => {
  try {
    if (type === LocalStoreType.SECURE_STORAGE) {
      await SecureStore.deleteItemAsync(name);
    } else if (type === LocalStoreType.ASYNC_STORAGE) {
      await AsyncStorage.removeItem(name);
    } else if (type === LocalStoreType.SQLITE) {
      if (!config?.tableName)
        throw new Error("Table name is required for SQLite.");
      await initializeDB();
      db.transaction((tx) => {
        tx.executeSql(`DELETE FROM ${config.tableName} WHERE key = ?;`, [name]);
      });
    }
  } catch (error) {
    console.log("Error Deleting Item From Storage", error);
  }
};

export const clearStorage = async (
  type: LocalStoreType,
  config?: { tableName?: string }
): Promise<void> => {
  if (type === LocalStoreType.ASYNC_STORAGE) {
    await AsyncStorage.clear();
  } else if (type === LocalStoreType.SQLITE) {
    if (!config?.tableName)
      throw new Error("Table name is required for SQLite.");
    await initializeDB();
    db.transaction((tx) => {
      tx.executeSql(`DELETE FROM ${config.tableName};`);
    });
  }
};

export const clearAllStorages = async (): Promise<void> => {
  await SecureStore.deleteItemAsync("all");
  await AsyncStorage.clear();
  await initializeDB();
  db.transaction((tx) => {
    tx.executeSql(`DROP TABLE IF EXISTS local_store;`);
  });
};

export const setMultipleItems = async (
  items: Record<string, any>,
  type: LocalStoreType = LocalStoreType.SECURE_STORAGE,
  config?: { tableName?: string; secured?: boolean }
): Promise<void> => {
  for (const [key, value] of Object.entries(items)) {
    await setItemInStorage(key, value, type, config);
  }
};

export const removeMultipleItems = async (
  keys: string[],
  type: LocalStoreType = LocalStoreType.SECURE_STORAGE,
  config?: { tableName?: string }
): Promise<void> => {
  for (const key of keys) {
    await removeItemFromStorage(key, type, config);
  }
};
