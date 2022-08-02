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
				expect(_body.msg).toBe("Bad Request!");
			});
	});
});

describe("PATCH /api/reviews/:review_id", () => {
	test("updates the vote count by adding if inc_votes is positive and returns the updated review", () => {
		return request(app)
			.patch("/api/reviews/1")
			.send({ inc_votes: 5 })
			.then(({ body }) => {
				const expected = {
					review_id: 1,
					title: "Agricola",
					category: "euro game",
					designer: "Uwe Rosenberg",
					owner: "mallionaire",
					review_body: "Farmyard fun!",
					review_img_url:
						"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
					created_at: "2021-01-18T10:00:20.514Z",
					votes: 6,
				};
				expect(body.review).toEqual(expected);
			});
	});
	test("updates the vote count by subtraction if inc_votes is negatives and returns the updated review", () => {
		return request(app)
			.patch("/api/reviews/1")
			.send({ inc_votes: -1 })
			.then(({ body }) => {
				const expected = {
					review_id: 1,
					title: "Agricola",
					category: "euro game",
					designer: "Uwe Rosenberg",
					owner: "mallionaire",
					review_body: "Farmyard fun!",
					review_img_url:
						"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
					created_at: "2021-01-18T10:00:20.514Z",
					votes: 0,
				};
				expect(body.review).toEqual(expected);
			});
	});
	test("when given a review_id that's too high, return an appropriate error", () => {
		return request(app)
			.patch("/api/reviews/90")
			.send({ inc_votes: 5 })
			.expect(404)
			.then(({ _body }) => {
				expect(_body.msg).toBe("No review found");
			});
	});
	test("when given an invalid review_id, return an appropriate error", () => {
		return request(app)
			.patch("/api/reviews/banana")
			.send({ inc_votes: 5 })
			.expect(400)
			.then(({ _body }) => {
				expect(_body.msg).toBe("Bad Request!");
			});
	});
	test("when given an invalid inc_votes input, return an appropriate error", () => {
		return request(app)
			.patch("/api/reviews/1")
			.send({ inc_votes: "apple" })
			.expect(400)
			.then(({ _body }) => {
				expect(_body.msg).toBe("Bad Request!");
			});
	});
});

describe("GET /api/users", () => {
	test("an array of objects, each object should have the following properties:username,	name, avatar_url ", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				const expected = ["username", "name", "avatar_url"];
				body["users"].forEach((user) => {
					expect(Object.keys(user)).toEqual(expect.arrayContaining(expected));
				});
			});
	});
});
