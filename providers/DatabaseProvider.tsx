import * as React from "react";
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from "expo-sqlite";

async function migrateDB(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      deadline TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
      notificationId TEXT NOT NULL
  );
  `);
}

const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SQLiteProvider databaseName="test.db" onInit={migrateDB}>
      {children}
    </SQLiteProvider>
  );
};

const useDatabase = () => {
  return useSQLiteContext();
};

export { DatabaseProvider, useDatabase };
