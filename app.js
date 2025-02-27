const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const apiRouter = require("./routes/apiRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.get("/", (req, res) => {
  res.json({ status: 200, message: "Hello World" });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
