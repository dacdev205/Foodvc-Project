require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const statusesAPI = require("./controllers/statusesControllers");
const rankAPI = require("./controllers/rankControllers");
const app = express();
const port = process.env.PORT;

mongoose.set("strictQuery", true);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(cookieParser());

// Database connection
mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    console.log("Connected to database");
    await statusesAPI.initializeOrderStatuses();
    await rankAPI.initializeUserRanks();
  })
  .catch((err) => console.log(err));

// Routes
app.use("/api/foodvc", require("./routes/menuRoutes"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/wish-list", require("./routes/wishListRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));
app.use("/inventory", require("./routes/inventoryRoutes"));
app.use("/check-out", require("./routes/paymentRoutes"));
app.use("/adminStats", require("./routes/adminStats"));
app.use("/sellerStats", require("./routes/sellerStats"));
app.use("/rank", require("./routes/rankRoutes"));
app.use("/order", require("./routes/ordersRoutes"));
app.use("/address", require("./routes/addressRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/products", require("./routes/productsRoutes"));
app.use("/email", require("./routes/sendEmailRoutes"));
app.use("/vouchers", require("./routes/voucherRoutes"));
app.use("/statuses", require("./routes/statusRoutes"));
app.use("/order-request", require("./routes/orderRequestRoutes"));
app.use("/method-deli", require("./routes/methodDeliRoutes"));
app.use("/category", require("./routes/categoryRoutes"));
app.use("/shop", require("./routes/shopRoutes"));
app.use("/wish-store", require("./routes/wishStoreRoutes"));

app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
