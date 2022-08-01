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

describe("GET /api/reviews/:review_id", () => {
	test("a review object, which should have the following properties: review_id,title,review_body,designer,review_img_url,votes, category, owner and created_at", () => {
		return request(app)
			.get("/api/reviews/1")
			.expect(200)
			.then(({ body }) => {
				expect(body.review).toHaveProperty("review_id", 1);
				expect(body.review).toHaveProperty("title", "Agricola");
				expect(body.review).toHaveProperty("review_body", "Farmyard fun!");
				expect(body.review).toHaveProperty("designer", "Uwe Rosenberg");
				expect(body.review).toHaveProperty(
					"review_img_url",
					"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
				);
				expect(body.review).toHaveProperty("votes", 1);
				expect(body.review).toHaveProperty("category", "euro game");
				expect(body.review).toHaveProperty("owner", "mallionaire");
				expect(body.review).toHaveProperty(
					"created_at",
					"2021-01-18T10:00:20.514Z"
				);
			});
	});
	test("when given a review_id that's too high, return an appropriate error", () => {
		return request(app)
			.get("/api/reviews/90")
			.expect(404)
			.then(({ _body }) => {
				expect(_body.msg).toBe("No review found");
			});
	});
	test("when given an invalid review_id, return an appropriate error", () => {
		return request(app)
			.get("/api/reviews/banana")
			.expect(400)
			.then(({ _body }) => {
				expect(_body.msg).toBe("Bad Request");
			});
	});
});
