import { Request, Response } from "express";
import { url } from "inspector";
import User, { IUser } from "../models/User"
import mongoose from "mongoose";
import { userInfo } from "os";

/**
 * GET /goals
 * Goals page.
 */
export let index = (req: Request, res: Response) => {
  const achieved = req.user.achieved

  const today = new Date()
  const dayNumber = today.getDay()

  const weekGoals = [] // this weeks completed goals, starting monday
  for (let i = 0; i < dayNumber; i++) {
    weekGoals.push(achieved[achieved.length - i])
  }

  res.render("goals", {
    title: "Goals",
    goals: weekGoals,
  });
};

/**
 * GET /goals/queue
 * Page listing uncompleted goals.
 */
export let queue = (req: Request, res: Response) => {
  res.render("goal_queue", {
    title: "Goal Queue",
    goals: req.user.queue
  });
};

/**
 * GET /goals/queue/add
 * Goals page.
 */
export let add = (req: Request, res: Response) => {
  res.render("goal_add", {
    title: "Add Goal"
  });
};

/**
 * POST /goals/queue/add
 * Add a new goal to the queue.
 */
export let create = (req: Request, res: Response) => {
  const goal = req.body.goal
  const user = req.user
  console.log("goal: " + goal)
  user.queue.push(goal)
  User.update({ id: user.id }, user, {}, (err: any) => {
    if (err) {
      console.log("Failed to save goal into database.")
      res.status(200).send("Failed to update queue")
      return console.error(err)
    } else {
      console.info("Successfully updated user: " + JSON.stringify(user))
      res.status(200).send("Queue successfully updated")
    }
  })
};