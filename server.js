const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({
    success: "true",
    message: "Server is running fine ",
  });
});
app.use("/products", productRoutes);

app.use("/auth", authRoutes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("mongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("mongoDB connection error:", err);
  });
