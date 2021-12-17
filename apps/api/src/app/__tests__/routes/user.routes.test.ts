import supertest from "supertest";
import app from "../server.test";

const request = supertest(app);

describe("Auth Register", () => {
  it("should return 400 error missing.body", async () => {
    const res = await request.post("/auth/signup").send();
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("missing.body");
  });
  it("should return 400 error missing.field.username", async () => {
    const res = await request.post("/auth/signup").send({
      firstname: "TestFN",
      lastname: "TestLN",
      email: "test@example.com",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("missing.field.username");
  });
  it("should return 400 error missing.field.firstname", async () => {
    const res = await request.post("/auth/signup").send({
      username: "TestUN",
      lastname: "TestLN",
      email: "test@example.com",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("missing.field.firstname");
  });
  it("should return 400 error missing.field.lastname", async () => {
    const res = await request.post("/auth/signup").send({
      username: "TestUN",
      firstname: "TestFN",
      email: "test@example.com",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("missing.field.lastname");
  });
  it("should return 400 error missing.field.email", async () => {
    const res = await request.post("/auth/signup").send({
      username: "TestUN",
      firstname: "TestFN",
      lastname: "TestLN",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("missing.field.email");
  });
  it("should return 400 error missing.field.password", async () => {
    const res = await request.post("/auth/signup").send({
      username: "TestUN",
      firstname: "TestFN",
      lastname: "TestLN",
      email: "test@example.com",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("missing.field.password");
  });
  it("should return 400 error notallowedcharacter.field.username", async () => {
    const res = await request.post("/auth/signup").send({
      username: "T@estUN",
      firstname: "TestFN",
      lastname: "TestLN",
      email: "test@example.com",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("notallowedcharacter.field.username");
  });
  it("should return 400 error notallowedcharacter.field.firstname", async () => {
    const res = await request.post("/auth/signup").send({
      username: "TestUN",
      firstname: "Tes9tFN",
      lastname: "TestLN",
      email: "test@example.com",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("notallowedcharacter.field.firstname");
  });
  it("should return 400 error notallowedcharacter.field.lastname", async () => {
    const res = await request.post("/auth/signup").send({
      username: "TestUN",
      firstname: "TestFN",
      lastname: "Test9LN",
      email: "test@example.com",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("notallowedcharacter.field.lastname");
  });
  it("should return 400 error notallowedcharacter.field.email", async () => {
    const res = await request.post("/auth/signup").send({
      username: "TestUN",
      firstname: "TestFN",
      lastname: "TestLN",
      email: "test@examplecom",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("notallowedcharacter.field.email");
  });
  it("should return 400 error notenoughcharacter.field.password", async () => {
    const res = await request.post("/auth/signup").send({
      username: "TestUN",
      firstname: "TestFN",
      lastname: "TestLN",
      email: "test@example.com",
      password: "test",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("notenoughcharacter.field.password");
  });
  it("should return 201 success success.user.created", async () => {
    const res = await request.post("/auth/signup").send({
      username: "TestUN",
      firstname: "TestFN",
      lastname: "TestLN",
      email: "test@example.com",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("success.user.created");
  });
  it("should return 409 error duplicate.field.username", async () => {
    const res = await request.post("/auth/signup").send({
      username: "testUN",
      firstname: "TestFN",
      lastname: "TestLN",
      email: "test@example.com",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(409);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("duplicate.field.username");
  });
});
describe("Auth Login", () => {
  it("should return 400 error missing.body", async () => {
    const res = await request.post("/auth/signin").send();
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("missing.body");
  });
  it("should return 400 error missing.field.username", async () => {
    const res = await request.post("/auth/signin").send({
      password: "testtest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("missing.field.username");
  });
  it("should return 400 error missing.field.password", async () => {
    const res = await request.post("/auth/signin").send({
      username: "TestUN",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("missing.field.password");
  });
  it("should return 400 error notallowedcharacter.field.username", async () => {
    const res = await request.post("/auth/signin").send({
      username: "T@estUN",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("notallowedcharacter.field.username");
  });
  it("should return 404 error notfound.field.username", async () => {
    const res = await request.post("/auth/signin").send({
      username: "TestUN12345678",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(404);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("notfound.field.username");
  });
  it("should return 400 error wrong.field.password", async () => {
    const res = await request.post("/auth/signin").send({
      username: "TestUN",
      password: "testtest12345678",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("wrong.field.password");
  });
  it("should return 200 success success.user.login", async () => {
    const res = await request.post("/auth/signin").send({
      username: "TestUN",
      password: "testtest",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("success.user.login");
    expect(res.body.user.username).toEqual("testun");
    expect(res.body.user.firstname).toEqual("testfn");
    expect(res.body.user.lastname).toEqual("testln");
    expect(res.body.user.email).toEqual("test@example.com");
    expect(res.body.user.roles).toContain("athlete")
  });
});

describe("get User", () => {
  it("should return 404 error.notfound.user", async () => {
    const res = await request.get("/user/testtest")
    expect(res.statusCode).toEqual(404)
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("error.notfound.user");
  })
  it("should return 200 success success.user.found", async () => {
    const res = await request.get("/user/testun")
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual("application/json");
    expect(res.body.message.key).toEqual("success.user.found");
    expect(res.body.data.username).toEqual("testun")
    expect(res.body.data.firstname).toEqual("testfn")
    expect(res.body.data.lastname).toEqual("testln")
    expect(res.body.data.roles).toContain("athlete")
  })
})
describe("delete User", () => {
  it("should return 401 error unauthorized", async () => {
    const res = await request.delete("/user").send();
    expect(res.statusCode).toEqual(401);
    expect(res.type).toEqual("application/json");
  });
  it("should return 200 success success.user.delete", async () => {
    await request
      .post("/auth/signup")
      .send({
        username: "TestUNdel",
        firstname: "TestFN",
        lastname: "TestLN",
        email: "test@example.com",
        password: "testtest",
      })
      .then(async () => {
        await request
          .post("/auth/signin")
          .send({
            username: "TestUNdel",
            password: "testtest",
          })
          .then(async (response: any) => {
            const res = await request
              .delete("/user")
              .set("x-access-token", response.body.user.token)
              .send();
            expect(res.statusCode).toEqual(200);
            expect(res.type).toEqual("application/json");
            expect(res.body.message.key).toEqual("success.user.delete");
          });
      });
  });
});
