var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var express = require("express");
var app = express();
///
app.use(logger("dev"));
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
//
app.use(express.static(process.cwd() + "/public"));
//Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
///Mongoose
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news_scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to Mongoose!");
});
//Path
var routes = require("./controller/controller.js");
app.use("/", routes);
///Heroku || Localhost
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Listening on PORT " + port);
});