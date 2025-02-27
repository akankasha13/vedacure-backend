const { Router } = require("express");
const {
  signUpController,
  loginController,
  authenticateToken,
} = require("../controllers/authController");
const {
  userDetailsController,
  userUpdateController,
} = require("../controllers/userController");

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.json({ status: 200, message: "API is working" });
});

apiRouter.post("/signup", signUpController);
apiRouter.post("/login", loginController);

apiRouter.get("/user/details", authenticateToken, userDetailsController);
apiRouter.post("/user/update", authenticateToken, userUpdateController);

apiRouter.post("/token-test", authenticateToken, (req, res) =>
  res.json({ status: 200, message: "JWT is working" })
);

module.exports = apiRouter;
