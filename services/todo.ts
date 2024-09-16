import dayjs from "dayjs";
import { SQLiteDatabase } from "expo-sqlite";
import * as Notifications from "expo-notifications";

interface Todo {
  id: number;
  title: string;
  deadline: string;
  active: number;
  notificationId: string;
}

type GetTodosRes = Omit<Todo, "notificationId">;
export const getTodos = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<GetTodosRes>("SELECT * FROM todos;");
};

type GetTodosByActiveRes = Omit<Todo, "notificationId">;
export type FilterState = "ALL" | "ACTIVE" | "DONE";
export const getTodosByActive = async (
  db: SQLiteDatabase,
  filter: FilterState,
) => {
  if (filter == "ALL")
    return await db.getAllAsync<GetTodosByActiveRes>(
      "SELECT * FROM todos ORDER BY deadline;",
    );
  if (filter == "ACTIVE")
    return await db.getAllAsync<GetTodosByActiveRes>(
      "SELECT * FROM todos WHERE active = 1 ORDER BY deadline;",
    );
  if (filter == "DONE")
    return await db.getAllAsync<GetTodosByActiveRes>(
      "SELECT * FROM todos WHERE active = 0 ORDER BY deadline;",
    );
};

type GetTodoRes = Omit<Todo, "notificationId">;
export const getTodo = async (db: SQLiteDatabase, todoID: number) => {
  return await db.getFirstAsync<GetTodoRes>(
    "SELECT * FROM todos WHERE id = ?;",
    todoID,
  );
};

type AddTodoReq = Pick<Todo, "title" | "deadline">;
export const addTodo = async (db: SQLiteDatabase, value: AddTodoReq) => {
  const today = dayjs();
  const diff = dayjs(value.deadline).diff(today, "second");
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `You've task todo`,
      body: value.title,
    },
    trigger: { seconds: diff },
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
    await Notifications.cancelScheduledNotificationAsync(notificationId);
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
  await Notifications.cancelScheduledNotificationAsync(data.notificationId);

  const today = dayjs();
  const diff = dayjs(value.deadline).diff(today, "second");
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `You've task todo`,
      body: value.title,
    },
    trigger: { seconds: diff },
  });
  await db.runAsync(
    "UPDATE todos SET title = ?, deadline = ?, notificationId = ? WHERE id = ?",
    value.title,
    value.deadline,
    notificationId,
    todoID,
  );
}

export async function toggleTodoActive(db: SQLiteDatabase, todoID: number) {
  const data = await db.getFirstAsync<Todo>(
    "SELECT id, title, notificationId, deadline, active FROM todos WHERE id = ?",
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
    await Notifications.cancelScheduledNotificationAsync(data.notificationId);
  } else {
    // set undone
    const today = dayjs();
    const diff = dayjs(data.deadline).diff(today, "second");
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `You've task todo`,
        body: data.title,
      },
      trigger: { seconds: diff },
    });
    await db.runAsync(
      "UPDATE todos SET active = 1, notificationId = ? WHERE id = ?",
      notificationId,
      todoID,
    );
  }
}

export async function deleteTodo(db: SQLiteDatabase, todoID: number) {
  const data = await db.getFirstAsync<Pick<Todo, "id" | "notificationId">>(
    "SELECT id, notificationId FROM todos WHERE id = ?",
    todoID,
  );
  if (!data) {
    throw new Error("Record not found");
  }
  if (data.notificationId === "") {
    throw new Error("notificationId is empty");
  }
  await Notifications.cancelScheduledNotificationAsync(data.notificationId);
  await db.runAsync("DELETE FROM todos WHERE id = ?", todoID);
}
