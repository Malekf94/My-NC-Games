const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const listOfApis = require("../endpoints.json");

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
			.then(({ body }) => {
				expect(body.msg).toBe("No review found");
			});
	});
	test("when given an invalid review_id, return an appropriate error", () => {
		return request(app)
			.get("/api/reviews/banana")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
	test("returns a review response object that now also includes comment_count", () => {
		return request(app)
			.get("/api/reviews/2")
			.expect(200)
			.then(({ body }) => {
				expect(body.review).toHaveProperty("comment_count", 3);
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
			.then(({ body }) => {
				expect(body.msg).toBe("No review found");
			});
	});
	test("when given an invalid review_id, return an appropriate error", () => {
		return request(app)
			.patch("/api/reviews/banana")
			.send({ inc_votes: 5 })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
	test("when given an invalid inc_votes input, return an appropriate error", () => {
		return request(app)
			.patch("/api/reviews/1")
			.send({ inc_votes: "apple" })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
});

describe("GET /api/users", () => {
	test("an array of objects, each object should have the following properties:username, name, avatar_url", () => {
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

describe("GET /api/reviews", () => {
	test("a reviews array of review objects, each of which should have the following properties:owner (which is the username from the users table), title, review_id, category, review_img_url, created_at, votes, designer and comment_count", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then(({ body }) => {
				const expected = [
					"owner",
					"title",
					"review_id",
					"category",
					"review_img_url",
					"created_at",
					"votes",
					"designer",
					"comment_count",
				];
				body["reviews"].forEach((review) => {
					expect(Object.keys(review)).toEqual(expect.arrayContaining(expected));
				});
			});
	});
	test("the array should be ordered by date created at in descending order", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then(({ body }) => {
				const expected = {
					review_id: 7,
					title: "Mollit elit qui incididunt veniam occaecat cupidatat",
					category: "social deduction",
					designer: "Avery Wunzboogerz",
					owner: "mallionaire",
					review_body:
						"Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
					review_img_url:
						"https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
					created_at: "2021-01-25T11:16:54.963Z",
					votes: 9,
					comment_count: "0",
				};
				expect(body.reviews[0]).toEqual(expected);
			});
	});
	test("should sort the data by any valid column, with date as the default value and Descending as the default order value", () => {
		return request(app)
			.get("/api/reviews?sort_by=designer")
			.expect(200)
			.then(({ body }) => {
				const expected = { designer: "Wolfgang Warsch" };
				expect(body.reviews[0]).toEqual(expect.objectContaining(expected));
			});
	});
	test("should sort by title and ascending order value", () => {
		return request(app)
			.get("/api/reviews?order=asc&sort_by=title")
			.expect(200)
			.then(({ body }) => {
				const expected = {
					title: "Agricola",
				};
				expect(body.reviews[0]).toEqual(expect.objectContaining(expected));
			});
	});
	test("should filter by the catergory specified", () => {
		return request(app)
			.get("/api/reviews?category=dexterity")
			.expect(200)
			.then(({ body }) => {
				const expected = {
					category: "dexterity",
				};
				body["reviews"].forEach((review) => {
					expect(review).toEqual(expect.objectContaining(expected));
				});
			});
	});
	test("when given an invalid category query, return an appropriate response", () => {
		return request(app)
			.get("/api/reviews?category=bananas")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("bananas was not found in column category");
			});
	});
	test("when given an invalid sort_by query, return an appropriate response", () => {
		return request(app)
			.get("/api/reviews?sort_by=apples")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("invalid sort_by query");
			});
	});
	test("when given an invalid sort_by query, return an appropriate response", () => {
		return request(app)
			.get("/api/reviews?order=jumbled")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("invalid order input");
			});
	});
});

describe("GET /api/review/:review_id/comments", () => {
	test("Responds with an array of comments for the given review_id of which each comment should have the following properties: comment_id,votes,created_at,author,body,review_id", () => {
		return request(app)
			.get("/api/reviews/2/comments")
			.expect(200)
			.then(({ body }) => {
				const expected = [
					{
						comment_id: 1,
						body: "I loved this game too!",
						review_id: 2,
						author: "bainesface",
						votes: 16,
						created_at: "2017-11-22T12:43:33.389Z",
					},
					{
						comment_id: 4,
						body: "EPIC board game!",
						review_id: 2,
						author: "bainesface",
						votes: 16,
						created_at: "2017-11-22T12:36:03.389Z",
					},
					{
						comment_id: 5,
						body: "Now this is a story all about how, board games turned my life upside down",
						review_id: 2,
						author: "mallionaire",
						votes: 13,
						created_at: "2021-01-18T10:24:05.410Z",
					},
				];
				expect(body.comments).toEqual(expected);
			});
	});
	test("if a valid review_id has no comments, return an appropriate response", () => {
		return request(app)
			.get("/api/reviews/1/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.msg).toBe("No comment related");
			});
	});
	test("if given a review_id that's too high, return an appropriate response", () => {
		return request(app)
			.get("/api/reviews/1000/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("No review found");
			});
	});
	test("if given an invalid review_id, return an appropriate response", () => {
		return request(app)
			.get("/api/reviews/banana/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
});

describe("POST /api/reviews/:review_id/comments", () => {
	test("request body accepts an object with the keys username and body and responds with the posted comment", () => {
		const postedComment = { username: "mallionaire", body: "random words" };
		return request(app)
			.post("/api/reviews/1/comments")
			.send(postedComment)
			.expect(201)
			.then(({ body }) => {
				const expected = {
					body: "random words",
					author: "mallionaire",
				};
				expect(body.comment).toEqual(expect.objectContaining(expected));
			});
	});
	test("if given a review_id that's too high, return an appropriate response", () => {
		const postedComment = { username: "mallionaire", body: "random words" };
		return request(app)
			.post("/api/reviews/1000/comments")
			.send(postedComment)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("1000 was not found in column review_id");
			});
	});
	test("if given an invalid Id, return an appropriate response", () => {
		const postedComment = { username: "mallionaire", body: "random words" };
		return request(app)
			.post("/api/reviews/banana/comments")
			.send(postedComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
	test("if given a valid Id, but missing keys in the posted comment, return an appropriate response", () => {
		const postedComment = { username: "mallionaire" };
		return request(app)
			.post("/api/reviews/1/comments")
			.send(postedComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("post missing username/body");
			});
	});
	test("if given an invalid username, return an appropriate response", () => {
		const postedComment = { username: "malek", body: "random words" };
		return request(app)
			.post("/api/reviews/1/comments")
			.send(postedComment)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Username Not Found");
			});
	});
});

describe("DELETE /api/comments/:comment_id", () => {
	test("delete the given comment by comment_id", () => {
		return request(app).delete("/api/comments/1").expect(204);
	});
	test("if given an invalid Id, return an appropriate response", () => {
		return request(app)
			.delete("/api/comments/banana")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
	test("if given an Id that's too high, return an appropriate response", () => {
		return request(app)
			.delete("/api/comments/9001")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("9001 was not found in column comment_id");
			});
	});
});

describe("GET /api", () => {
	test("returns a JSON object describing all available endpoints", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body.listOfApis).toEqual(listOfApis);
			});
	});
});
