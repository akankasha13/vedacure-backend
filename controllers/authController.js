const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUpController = [
  [
    body("username")
      .trim()
      .isLength({ min: 1, max: 25 })
      .withMessage("Username must be between 1 and 25 characters"),
    body("fullName")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Full name must be between 1 and 50 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("gender")
      .trim()
      .isIn(["male", "female", "other"])
      .withMessage("Please enter a valid gender"),
    body("age").trim().isInt().withMessage("Please enter a valid age"),
    body("weight").trim().isInt().withMessage("Please enter a valid weight"),
    body("height").trim().isInt().withMessage("Please enter a valid height"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be between 8 and 25 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Passwords do not match");
      return true;
    }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ status: 400, errors: errors.array() });

    const { username, fullName, email, gender, age, weight, height, password } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (await db.getUserByUsername(username))
      return res.json({
        status: 400,
        message: "User with same username already exists.",
      });
    if (await db.getUserByEmail(email))
      return res.json({
        status: 400,
        message: "User with same email already exists.",
      });

    let status = await db.createUser(
      username,
      fullName,
      email,
      hashedPassword,
      gender,
      age,
      weight,
      height,
      0
    );
    if (status) res.json({ status: 200, message: "User created" });
    else res.json({ status: 400, message: "User not created" });
  }),
];

const loginController = [
  [
    body("username")
      .trim()
      .isLength({ min: 1, max: 25 })
      .withMessage("Username must be between 1 and 25 characters"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be between 8 and 25 characters"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ status: 400, errors: errors.array() });

    const { username, password } = req.body;
    const userData = await db.getUserByUsername(username);
    if (!userData)
      return res.json({
        status: 400,
        message: "User with this username does not exist",
      });
    const match = await bcrypt.compare(password, userData.password);
    if (!match) return res.json({ status: 400, message: "Incorrect password" });

    jwt.sign(
      { id: userData.user_id },
      process.env.SESSION_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({ status: 200, message: "Login successful", token: token });
      }
    );
  }),
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.SESSION_SECRET, (err, authData) => {
    if (err) return res.sendStatus(403);
    req.user = authData;
    next();
  });
};

module.exports = { signUpController, loginController, authenticateToken };

// {
//   "username" : "akankasha",
//   "fullName" : "Akankasha Sharma",
//   "email" : "akankasha@email.com",
//   "gender" : "female",
//   "age" : 18,
//   "weight" : 65,
//   "height" : 168,
//   "password" : "akankasha",
//   "confirmPassword" : "akankasha"
// }

// {
//   "username" : "akankasha",
//   "password" : "akankasha"
// }

// {
//   "fullName" : "Akankasha Sharma",
//   "email" : "akankasha@email.com",
//   "age" : 21,
//   "weight" : 69,
//   "height" : 168,
//   "password" : "akankasha"
// }

// {
//   "status": 200,
//   "message": "Login successful",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzQwNjc0NjUxLCJleHAiOjE3NDA3NjEwNTF9.6kgkGy35bhnsAlrtWjfQSDRxFcvf7CI-prxohek0mio"
// }
// created at 10 pm on 27/02
