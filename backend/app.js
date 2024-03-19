//import
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT
mongoose.set('strictQuery', true);
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
//middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("uploads"));
app.use(cookieParser());
//database connection
mongoose.connect(process.env.DB_URL).then(() => console.log("Connected to database"))
.catch((err) => console.log(err));


app.use("/api/foodvc", require("./routes/menuRoutes"))
app.use("/cart", require("./routes/cartRoutes"))
app.use("/wish-list", require("./routes/wishListRoutes"))
app.use("/users", require("./routes/userRoutes"))
app.use("/reviews", require("./routes/reviewRoutes"))
app.use("/inventory", require("./routes/inventoryRoutes"))
app.use("/check-out", require("./routes/paymentRoutes"))
app.use("/adminStats",require("./routes/adminStats"))
app.use("/order", require("./routes/ordersRoutes"))
app.use("/address", require("./routes/addressRoutes"))
app.use('/api/messages', require("./routes/messageRoutes"));
app.post('/jwt', async(req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1hr'
    })
    res.send({token});
  })
 

app.listen(port, () => console.log(`listening at http://localhost:${port}`));