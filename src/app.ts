import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import logger from "./util/logger";
import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import uniqid from "uniqid"
import User, { IUser } from "./models/User";

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as goalsController from "./controllers/goals";
import async from "async";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, { useMongoClient: true }).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Middleware
 */
app.use(async (req, res, next) => {
  const carlUsername = "carl_is_12" // TODO: remove
  const count = await User.count({ username: carlUsername })
  let user

  if (count > 0) {
    // find
    const response = await User.findOne({ username: carlUsername })
    user = response
  } else {
    // TODO: fix up
    // create new user
    const newUser: IUser = {
      _id: "",
      username: carlUsername,      // tslint:disable-next-line: no-null-keyword
      picture: null,
      friends: [],
      // tslint:disable-next-line:no-null-keyword
      activeGoal: null,
      queue: [],
      achieved: []
    }
    const userModel = new User(newUser)

    // save
    userModel.save((err: any, result) => {
      if (err) {
        console.log("failed to save new user")
        console.error("error: " + err + "\nresults: " + result)
      } else {
        console.log("result: " + result)
        console.log("new user saved")
        user = result
      }
    })

  }

  req.user = user
  console.log("req.user: " + JSON.stringify(req.user))

  next()
})

/**
 * Primary app routes.
 */
app.get("/", homeController.index);
app.get("/goals", goalsController.index);
app.get("/goals/queue", goalsController.queue);
app.get("/goals/queue/add", goalsController.add);
app.post("/goals/queue/add", goalsController.create)
app.post("/goals/queue/select", goalsController.select)
export default app;
