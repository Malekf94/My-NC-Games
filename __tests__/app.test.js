const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");

afterAll(() => {
	return db.end();
});

beforeEach(() => {
	return seed(data);
});

describe("Get /api/categories", () => {
	test("returns a status of 200 and an array of objects with the following keys, slug and description", () => {
		return request(app)
			.get("/api/categories")
			.expect(200)
			.then(({ body }) => {
				body["categories"].forEach((catergory) => {
					expect(catergory).toHaveProperty("slug");
					expect(catergory).toHaveProperty("description");
				});
			});
	});
});
