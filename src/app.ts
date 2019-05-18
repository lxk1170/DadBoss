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
  const carlId = "carl4" // TODO: remove
  const count = await User.count({ _id: carlId })
  console.log("count: " + count)

  if (count > 0) {
    // find
    return User.findOne({ _id: carlId }, (err, user: IUser) => {
      if (err) {
        console.error("User exists, but unable to find")
      } else {
        console.info("user found and added")
        req.user = user
      }
    })
  } else {
    // create TODO: remove
    const user: IUser = {
      _id: carlId,
      name: "CarlBites",
      picture: "http://tiny.cc/3rzt6y",
      friends: [420, 210],
      hasGoal: false,
      queue: ["fuck ur mommy", "shit your bed", "skydive", "eat her ass"],
      achieved: ["run around naked", "preschool", "dog sitting"] // the last goal on active is the current goal
    }
    const userModel = new User(user)

    // save
    userModel.save((err: any, results) => {
      console.log(results)
      if (err) {
        console.log("failed to save new user")
        console.error("error: " + err)
      } else {
        console.log("new user saved")
        req.user = user
      }
    })

    req.user = user
  }

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
export default app;
