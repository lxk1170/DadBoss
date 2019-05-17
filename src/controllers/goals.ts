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
  res.render("goals", {
    title: "Goals",
    goals: ["eat pizza", "do the dishes", "fuck horses", "eat shit, carl"],
  });
};

/**
 * GET /goals/queue
 * Page listing uncompleted goals.
 */
export let queue = (req: Request, res: Response) => {
  view_queue(res, "queue successfully loaded")
};

const view_queue = (res: Response, msg: string) => {
  res.render("goal_queue", {
    title: "Goal Queue",
    goals: ["watch a new movie", "read an exciting book", "do acid", "literally eat shit"],
    alert: msg
  });
}

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
  user.goals.push(goal)
  console.log(goal)
  user.save((err: any) => {
    if (err) {
      return console.error(err)
    }
  })

  const msg = ("Goal has been successfully added!")
  view_queue(res, msg) // visit queue page
};