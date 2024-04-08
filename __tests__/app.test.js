const {seed} = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../server");
const db = require("../db/connection");
const request = require("supertest");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api", () => {
    test("should return the endpoints JSON object", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(endpoints);
        });
    });
  });

  describe("GET /api/users", () => {
    test("should return an array of all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          expect(res.body.users).toHaveLength(4);
          res.body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                password: expect.any(String),
                saved_words: expect.any(Array),
              })
            );
          });
        });
    });
    describe("error handling for GET /api/users", () => {
      test("should return 404 for an invalid path", () => {
        return request(app)
          .get("/api/userss")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("404 Error. This page doesn't exist");
          });
      });
        })
  })
  describe("GET /api/users/:username", () => {
    test("should return a user object by username", () => {
      return request(app)
        .get("/api/users/testuser1")
        .expect(200)
        .then((res) => {
          expect(res.body.user).toEqual(
            expect.objectContaining({
              username: "testuser1",
              name: "Test 1",
              password: "password1",
              saved_words: ["1", "2"],
            })
          );
        });
    });
    describe("error handling for GET /api/users/:username", () => {
      test("should return 404 for a non-existent username", () => {
        return request(app)
          .get("/api/users/carmel")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("404 Error. This page doesn't exist");
          });
      });
    });
  })
