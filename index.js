const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter=require('./routes/authRoute');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
dbConnect();
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const couponRouter = require("./routes/couponRoute");

const categoryRouter = require("./routes/productcategoryRoute");
const blogCatRouter = require('./routes/blogCatRoute');

const brandRouter = require('./routes/brandRoute');



const morgan = require('morgan');
const cookieParser = require ("cookie-parser");

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


  app.use('/api/user', authRouter);
  app.use('/api/product', productRouter);
  app.use('/api/blog', blogRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/blogcategory', blogCatRouter);
   app.use('/api/brand', brandRouter);
   app.use('/api/coupon', couponRouter);

  app.use(notFound);
  app.use(errorHandler);





app.set("view engine", "ejs")

const PUBLISHABLE_KEY = "pk_test_51NTaBfLvXfHMdnxtpWnGr5UbgotJVvRY6ukHrRteImUukZyzeeeMBnWg2MXRshQV1ECgJWXO9TP07NigXiOUC5ma003389MURK"
 
const SECRET_KEY = "sk_test_51NTaBfLvXfHMdnxtyQtt5QqUNcQkzgK4VBqvODW9qHgOUz2avwOcO8xnIqWm0HcR3KumNc3ia0bLGH7JenZ9FH21002xEHFtG2"

app.get('/', (req, res) => {
  res.render('Home', {
    key:PUBLISHABLE_KEY
  })
})



app.listen(PORT, () => {
    console.log(`server is running at PORT ${PORT}`);
});