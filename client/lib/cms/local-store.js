import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { defaultContent } from "@/lib/cms/default-content";

const dataDirectory = path.join(process.cwd(), "data");
const contentFilePath = path.join(dataDirectory, "cms-content.json");
const tasksFilePath = path.join(dataDirectory, "portal-tasks.json");

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeWithDefaults(baseValue, overrideValue) {
  if (Array.isArray(baseValue)) {
    return Array.isArray(overrideValue) ? overrideValue : baseValue;
  }

  if (!isPlainObject(baseValue)) {
    return overrideValue === undefined ? baseValue : overrideValue;
  }

  const output = { ...baseValue };

  for (const key of Object.keys(overrideValue || {})) {
    output[key] = mergeWithDefaults(baseValue[key], overrideValue[key]);
  }

  return output;
}

async function ensureDataDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

async function readJsonFile(filePath, fallbackValue) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

async function writeJsonFile(filePath, value) {
  await ensureDataDirectory();
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

export async function readCmsContent() {
  const storedContent = await readJsonFile(contentFilePath, defaultContent);
  return mergeWithDefaults(defaultContent, storedContent);
}

export async function writeCmsContent(content) {
  const nextContent = mergeWithDefaults(defaultContent, content || {});
  await writeJsonFile(contentFilePath, nextContent);
  return nextContent;
}

export async function readPortalTasks() {
  const tasks = await readJsonFile(tasksFilePath, []);
  return Array.isArray(tasks) ? tasks : [];
}

export async function createPortalTask(task) {
  const tasks = await readPortalTasks();
  const nextTask = {
    id: randomUUID(),
    title: task.title,
    section: task.section || "Homepage",
    priority: task.priority || "medium",
    assignedTo: task.assignedTo || "",
    summary: task.summary || "",
    status: task.status || "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const nextTasks = [nextTask, ...tasks];
  await writeJsonFile(tasksFilePath, nextTasks);
  return nextTask;
}

export async function updatePortalTask(id, updates) {
  const tasks = await readPortalTasks();
  const nextTasks = tasks.map((task) =>
    String(task.id) === String(id)
      ? {
          ...task,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : task
  );
  const nextTask = nextTasks.find((task) => String(task.id) === String(id));

  if (!nextTask) {
    throw new Error("Task not found");
  }

  await writeJsonFile(tasksFilePath, nextTasks);
  return nextTask;
}

export async function deletePortalTask(id) {
  const tasks = await readPortalTasks();
  const nextTasks = tasks.filter((task) => String(task.id) !== String(id));

  if (nextTasks.length === tasks.length) {
    throw new Error("Task not found");
  }

  await writeJsonFile(tasksFilePath, nextTasks);
  return { ok: true };
}
