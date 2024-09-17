import dayjs from "dayjs";
import { SQLiteDatabase } from "expo-sqlite";
import { cancelNotification, sendNotification } from "./notification";

interface Todo {
  id: number;
  title: string;
  deadline: string;
  active: number;
  notificationId: string;
}

export const getTodos = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<Todo>("SELECT * FROM todos;");
};

export type FilterState = "ALL" | "ACTIVE" | "DONE";
export const getTodosByActive = async (
  db: SQLiteDatabase,
  filter: FilterState,
) => {
  if (filter == "ALL")
    return await db.getAllAsync<Todo>("SELECT * FROM todos ORDER BY deadline;");
  if (filter == "ACTIVE")
    return await db.getAllAsync<Todo>(
      "SELECT * FROM todos WHERE active = 1 ORDER BY deadline;",
    );
  if (filter == "DONE")
    return await db.getAllAsync<Todo>(
      "SELECT * FROM todos WHERE active = 0 ORDER BY deadline;",
    );
};

export const getTodo = async (db: SQLiteDatabase, todoID: number) => {
  return await db.getFirstAsync<Todo>(
    "SELECT * FROM todos WHERE id = ?;",
    todoID,
  );
};

type AddTodoReq = Pick<Todo, "title" | "deadline">;
export const addTodo = async (db: SQLiteDatabase, value: AddTodoReq) => {
  const today = dayjs();
  const diff = dayjs(value.deadline).diff(today, "second");
  const notificationId = await sendNotification({
    body: value.title,
    seconds: diff,
  });
  try {
    await db.runAsync(
      "INSERT INTO todos (title, deadline, active, notificationId) VALUES (?, ?, ?, ?)",
      value.title,
      value.deadline,
      1,
      notificationId,
    );
  } catch (error) {
    await cancelNotification(notificationId);
    console.error("Error save todo:", error);
  }
};

type UpdateTodoReq = Pick<Todo, "title" | "deadline">;
export async function updateTodo(
  db: SQLiteDatabase,
  todoID: number,
  value: UpdateTodoReq,
) {
  const data = await db.getFirstAsync<{ id: number; notificationId: string }>(
    "SELECT id, notificationId FROM todos WHERE id = ?",
    todoID,
  );
  if (!data) {
    throw new Error("Record not found");
  }
  if (data.notificationId === "") {
    throw new Error("notificationId is empty");
  }
  await cancelNotification(data.notificationId);

  const today = dayjs();
  const diff = dayjs(value.deadline).diff(today, "second");
  const notificationID = await sendNotification({
    body: value.title,
    seconds: diff,
  });
  try {
    await db.runAsync(
      "UPDATE todos SET title = ?, deadline = ?, notificationId = ? WHERE id = ?",
      value.title,
      value.deadline,
      notificationID,
      todoID,
    );
  } catch (error) {
    await cancelNotification(notificationID);
    console.error("Error update todo:", error);
  }
}

export async function toggleTodoActive(db: SQLiteDatabase, todoID: number) {
  const data = await db.getFirstAsync<Todo>(
    "SELECT * FROM todos WHERE id = ?",
    todoID,
  );
  if (!data) {
    throw new Error("Record not found");
  }
  if (data.notificationId === "") {
    throw new Error("notificationId is empty");
  }
  if (data.active === 1) {
    // set done
    await db.runAsync("UPDATE todos SET active = 0 WHERE id = ?", todoID);
    await cancelNotification(data.notificationId);
  } else {
    // set undone
    const today = dayjs();
    const diff = dayjs(data.deadline).diff(today, "second");
    const notificationID = await sendNotification({
      body: data.title,
      seconds: diff,
    });
    try {
      await db.runAsync(
        "UPDATE todos SET active = 1, notificationId = ? WHERE id = ?",
        notificationID,
        todoID,
      );
    } catch (error) {
      await cancelNotification(notificationID);
      console.error("Error toggle todo active:", error);
    }
  }
}

export async function deleteTodo(db: SQLiteDatabase, todoID: number) {
  const data = await db.getFirstAsync<Todo>(
    "SELECT * FROM todos WHERE id = ?",
    todoID,
  );
  if (!data) {
    throw new Error("Record not found");
  }
  if (data.notificationId === "") {
    throw new Error("notificationId is empty");
  }
  await cancelNotification(data.notificationId);
  await db.runAsync("DELETE FROM todos WHERE id = ?", todoID);
}
