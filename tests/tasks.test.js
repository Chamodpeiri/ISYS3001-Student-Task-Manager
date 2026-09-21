const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../src/app");
const User = require("../src/models/User");
const Task = require("../src/models/Task");

let mongoServer;

async function registerUser(email) {
  const agent = request.agent(app);

  const response = await agent.post("/api/auth/register").send({
    name: "Task Test User",
    email,
    password: "Password123",
  });

  assert.equal(response.status, 201);

  return agent;
}

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

test.after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test.beforeEach(async () => {
  await Task.deleteMany({});
  await User.deleteMany({});
});

test("task routes reject unauthenticated users", async () => {
  const response = await request(app).get("/api/tasks");

  assert.equal(response.status, 401);
  assert.equal(response.body.message, "Authentication required");
});

test("authenticated user can create and view a task", async () => {
  const agent = await registerUser("create@example.com");

  const createResponse = await agent.post("/api/tasks").send({
    title: "Complete ISYS3001 assignment",
    description: "Finish the task manager application",
  });

  assert.equal(createResponse.status, 201);
  assert.equal(createResponse.body.task.title, "Complete ISYS3001 assignment");
  assert.equal(createResponse.body.task.completed, false);

  const listResponse = await agent.get("/api/tasks");

  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.tasks.length, 1);
});

test("authenticated user can edit and complete a task", async () => {
  const agent = await registerUser("update@example.com");

  const createResponse = await agent.post("/api/tasks").send({
    title: "Original task title",
  });

  const taskId = createResponse.body.task._id;

  const updateResponse = await agent.patch(`/api/tasks/${taskId}`).send({
    title: "Updated task title",
    completed: true,
  });

  assert.equal(updateResponse.status, 200);
  assert.equal(updateResponse.body.task.title, "Updated task title");
  assert.equal(updateResponse.body.task.completed, true);
});

test("authenticated user can filter pending and completed tasks", async () => {
  const agent = await registerUser("filter@example.com");

  await agent.post("/api/tasks").send({
    title: "Pending task",
  });

  const completedTask = await agent.post("/api/tasks").send({
    title: "Completed task",
  });

  await agent
    .patch(`/api/tasks/${completedTask.body.task._id}`)
    .send({ completed: true });

  const pendingResponse = await agent.get("/api/tasks?status=pending");
  const completedResponse = await agent.get("/api/tasks?status=completed");

  assert.equal(pendingResponse.status, 200);
  assert.equal(pendingResponse.body.tasks.length, 1);
  assert.equal(pendingResponse.body.tasks[0].title, "Pending task");

  assert.equal(completedResponse.status, 200);
  assert.equal(completedResponse.body.tasks.length, 1);
  assert.equal(completedResponse.body.tasks[0].title, "Completed task");
});

test("authenticated user can delete a task", async () => {
  const agent = await registerUser("delete@example.com");

  const createResponse = await agent.post("/api/tasks").send({
    title: "Task to delete",
  });

  const deleteResponse = await agent.delete(
    `/api/tasks/${createResponse.body.task._id}`,
  );

  assert.equal(deleteResponse.status, 200);
  assert.equal(deleteResponse.body.message, "Task deleted successfully");

  const listResponse = await agent.get("/api/tasks");
  assert.equal(listResponse.body.tasks.length, 0);
});

test("users cannot update another user's task", async () => {
  const firstUser = await registerUser("first@example.com");
  const secondUser = await registerUser("second@example.com");

  const createResponse = await firstUser.post("/api/tasks").send({
    title: "Private task",
  });

  const updateResponse = await secondUser
    .patch(`/api/tasks/${createResponse.body.task._id}`)
    .send({ completed: true });

  assert.equal(updateResponse.status, 404);
  assert.equal(updateResponse.body.message, "Task not found");
});
