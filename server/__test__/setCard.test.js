const req = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const { User, SetCard } = require("../models/index");

let access_token = "";
let id = "";
let set_card_id = "";
let query = "";

function seederUser(done) {
  const body = {
    first_name: "some",
    last_name: "one",
    email: "a@gmail.com",
    password: "123456",
  };
    return User.create(body);
}

const user2 = {
  id: 89,
  email: "a@gmai2l12.com",
  first_name: "some2",
  last_name: "on2e"
};
let access_wrong = generateToken(user2);

afterAll((done) => {
  User.destroy({ where: {} })
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

beforeAll((done) => {
  seederUser()
    .then(() => {
      return User.findOne();
    })
    .then((data) => {
      let user = {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      };
      access_token = generateToken(user);
      id = +data.id;
      return SetCard.create({
        category: "Animals",
        title: "img",
        user_id: id,
      });
    })
    .then((data) => {
      query = data.title;
      set_card_id = data.id;
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("GET /setcard", function () {
  //valid
  it("Find set card should send response 200 status code", function (done) {
    //execute
    req(app)
      .get(`/setcard`)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body[0]).toEqual("object");
        expect(res.body[0]).toHaveProperty("category");
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("user_id");
        expect(typeof res.body[0].category).toEqual("string");
        expect(typeof res.body[0].title).toEqual("string");
        expect(typeof res.body[0].user_id).toEqual("number");
        done();
      });
  });

  it("Find set card should send response 500 status code", function (done) {
    //execute
    req(app)
      .get(`/setcard`)
      .set("access_token", access_wrong)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(500);
        done();
      });
  });

  it("Find set card should send response 500 status code", function (done) {
    //execute
    req(app)
      .get(`/setcard`)
      .set("access_token", access_wrong)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(500);
        done();
      });
  });

  it("No access_token (401)", function (done) {
    //execute
    req(app)
      .get(`/setcard`)
      .set("access_token", "")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });

  it("Incorrect access_token (401)", function (done) {
    //execute
    req(app)
      .get(`/setcard`)
      .set("access_token", "asdsasad.r32refe.awefs")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });
});

describe("GET /setcard/:query", function () {
  //valid
  it("Find set card should send response 200 status code", function (done) {
    //execute
    req(app)
      .get(`/setcard/${query}`)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body[0]).toEqual("object");
        expect(res.body[0]).toHaveProperty("category");
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("user_id");
        expect(typeof res.body[0].category).toEqual("string");
        expect(typeof res.body[0].title).toEqual("string");
        expect(typeof res.body[0].user_id).toEqual("number");
        done();
      });
  });

  it("No access_token (401)", function (done) {
    //execute
    req(app)
      .get(`/setcard/${query}`)
      .set("access_token", "")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });

  it("Incorrect access_token (401)", function (done) {
    //execute
    req(app)
      .get(`/setcard/${query}`)
      .set("access_token", "asdsasad.r32refe.awefs")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });
});

describe("POST /setcard", function () {
  //valid
  it("Post set card should send response 201 status code", function (done) {
    //setup
    const body = {
      category: "Animals",
      title: "img",
      user_id: id,
    };
    //execute
    req(app)
      .post(`/setcard`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("category");
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("user_id");
        expect(typeof res.body.category).toEqual("string");
        expect(typeof res.body.title).toEqual("string");
        expect(typeof res.body.user_id).toEqual("number");
        done();
      });
  });

  it("Post  if category empty set card should send response 400 status code", function (done) {
    //setup
    const body = {
      category: "",
      title: "img",
      user_id: id,
    };
    //execute
    req(app)
      .post(`/setcard`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Category is required !"])
        );
        done();
      });
  });

  it("Post  if title empty set card should send response 400 status code", function (done) {
    //setup
    const body = {
      category: "Animals",
      title: "",
      user_id: id,
    };
    //execute
    req(app)
      .post(`/setcard`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Title is required !"])
        );
        done();
      });
  });

  it("Post  if user id empty set card should send response 400 status code", function (done) {
    //setup
    const body = {
      category: "Animals",
      title: "img",
      user_id: "",
    };
    console.log(body);
    //execute
    req(app)
      .post(`/setcard`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["User id is required !"])
        );
        done();
      });
  });
});


describe("PUT /setcard", function () {
  //valid
  it("Put set card should send response 200 status code", function (done) {
    //setup
    const body = {
      category: "Animals2",
      title: "img2",
      user_id: id,
    };
    //execute
    req(app)
      .put(`/setcard/${set_card_id}`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body[0]).toEqual("object");
        expect(res.body[0]).toHaveProperty("category");
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("user_id");
        expect(typeof res.body[0].category).toEqual("string");
        expect(typeof res.body[0].title).toEqual("string");
        expect(typeof res.body[0].user_id).toEqual("number");
        done();
      });
  });

  it("Put set card should send response 200 status code 2", function (done) {
    //setup
    const body = {
      category: "Animals2",
      title: "img2",
      user_id: false,
    };
    //execute
    req(app)
      .put(`/setcard/${set_card_id}`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body[0]).toEqual("object");
        expect(res.body[0]).toHaveProperty("category");
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("user_id");
        expect(typeof res.body[0].category).toEqual("string");
        expect(typeof res.body[0].title).toEqual("string");
        expect(typeof res.body[0].user_id).toEqual("number");
        done();
      });
  });

  it("Put  if category empty set card should send response 400 status code", function (done) {
    //setup
    const body = {
      category: "",
      title: "img",
      user_id: id,
    };
    console.log(access_token);
    //execute
    req(app)
      .put(`/setcard/${set_card_id}`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Category is required !"])
        );
        done();
      });
  });

  it("Put  if title empty set card should send response 400 status code", function (done) {
    //setup
    const body = {
      category: "Animals",
      title: "",
      user_id: id,
    };
    //execute
    req(app)
      .put(`/setcard/${set_card_id}`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Title is required !"])
        );
        done();
      });
  });

  it("Put  if user id empty set card should send response 400 status code", function (done) {
    //setup
    const body = {
      category: "Animals",
      title: "img",
      user_id: "",
    };
    console.log(body);
    //execute
    req(app)
      .put(`/setcard/${set_card_id}`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["User id is required !"])
        );
        done();
      });
  });
});

describe("DELETE /setcard/:id", function () {
  //valid
  it("Delete set card should send response 200 status code", function (done) {
    //setup
    //execute
    req(app)
      .delete(`/setcard/${set_card_id}`)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("name");
        expect(typeof res.body.name).toEqual("string");
        done();
      });
  });

  it("No access_token (401)", function (done) {
    //execute
    req(app)
      .delete(`/setcard/${set_card_id}`)
      .set("access_token", "")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });

  it("Incorrect access_token (401)", function (done) {
    //execute
    req(app)
      .delete(`/setcard/${set_card_id}`)
      .set("access_token", "asdsasad.r32refe.awefs")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });
});
