const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../src/app");
const User = require("../src/models/User");

let mongoServer;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

test.after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test.beforeEach(async () => {
  await User.deleteMany({});
});

test("user can register, log out and log in", async () => {
  const agent = request.agent(app);

  const registrationResponse = await agent
    .post("/api/auth/register")
    .send({
      name: "Test Student",
      email: "student@example.com",
      password: "Password123",
    });

  assert.equal(registrationResponse.status, 201);
  assert.equal(
    registrationResponse.body.message,
    "Registration successful",
  );
  assert.equal(registrationResponse.body.user.email, "student@example.com");

  const storedUser = await User.findOne({
    email: "student@example.com",
  }).select("+password");

  assert.ok(storedUser);
  assert.notEqual(storedUser.password, "Password123");

  const logoutResponse = await agent.post("/api/auth/logout");

  assert.equal(logoutResponse.status, 200);
  assert.equal(logoutResponse.body.message, "Logout successful");

  const loginResponse = await agent
    .post("/api/auth/login")
    .send({
      email: "student@example.com",
      password: "Password123",
    });

  assert.equal(loginResponse.status, 200);
  assert.equal(loginResponse.body.message, "Login successful");
});

test("registration rejects duplicate email addresses", async () => {
  const user = {
    name: "Test Student",
    email: "duplicate@example.com",
    password: "Password123",
  };

  await request(app).post("/api/auth/register").send(user);

  const duplicateResponse = await request(app)
    .post("/api/auth/register")
    .send(user);

  assert.equal(duplicateResponse.status, 409);
});

test("login rejects an incorrect password", async () => {
  await request(app).post("/api/auth/register").send({
    name: "Test Student",
    email: "login@example.com",
    password: "Password123",
  });

  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "login@example.com",
      password: "WrongPassword",
    });

  assert.equal(response.status, 401);
});
