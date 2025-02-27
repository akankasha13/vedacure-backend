const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const userDetailsController = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await db.getUserById(id);
  res.json({ status: 200, data: user });
});

const userUpdateController = [
  [
    body("fullName")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Full name must be between 1 and 50 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("age").trim().isInt().withMessage("Please enter a valid age"),
    body("weight").trim().isInt().withMessage("Please enter a valid weight"),
    body("height").trim().isInt().withMessage("Please enter a valid height"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be between 8 and 25 characters"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ status: 400, errors: errors.array() });

    const { id } = req.user;
    const { fullName, email, age, weight, height, password } = req.body;

    const user = await db.getUserById(id);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ status: 400, message: "Incorrect password" });

    const status = await db.updateUser(
      id,
      fullName,
      email,
      age,
      weight,
      height
    );
    if (status) res.json({ status: 200, message: "User updated successfully" });
    else res.json({ status: 400, message: "User update failed, try again" });
  }),
];

module.exports = { userDetailsController, userUpdateController };
