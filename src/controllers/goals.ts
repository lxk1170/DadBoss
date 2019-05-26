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
  const user = req.user
  const achieved = user.achieved

  const today = new Date()
  const dayNumber = today.getDay()

  const weekGoals = [] // this weeks completed goals, starting sunday
  for (let i = 0; i < dayNumber; i++) {
    weekGoals.push(achieved[(achieved.length - 1) - i])
  }

  res.render("goals", {
    title: "Goals",
    activeGoal: user.activeGoal,
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
export let create = async (req: Request, res: Response) => {
  const goal = req.body.goal
  const user = req.user
  console.log("goal: " + goal)
  user.queue.push(goal)
  if (updateUser(user)) {
    res.status(200).send("Queue successfully updated")
  } else {
    res.status(200).send("Failed to update queue")
  }
};

/**
 * POST /goals/select
 * Select a goal to be todays objective.
 */
export let select = async (req: Request, res: Response) => {
  const goal = req.body.goal
  console.log("TODO: select goal: " + goal)
  const user = req.user
  user.activeGoal = goal
  if (updateUser(user)) {
    res.status(200).send("New active goal successfully selected")
  } else {
    res.status(200).send("Failed to select goal")
  }
}

/**
 * Update a given user <IUser>.
 * @return true if successful, false otherwise
 */
const updateUser = async (user: any) => {
  await User.update({ username: user.username }, user, {}, (err: any) => {
    if (err) {
      console.error("Failed to save goal into database.")
      return false
    } else {
      console.info("Successfully updated user: " + JSON.stringify(user))
      return true
    }
  })

}