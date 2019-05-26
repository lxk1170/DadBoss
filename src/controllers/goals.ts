import { Request, Response } from "express";

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
  res.render("goal_queue", {
    title: "Goals Todo",
    goals: ["watch a new movie", "read an exciting book", "do acid", "literally eat shit"]
  });
};

/**
 * GET /goals/add
 * Goals page.
 */
export let add = (req: Request, res: Response) => {
  res.render("goal_add", {
    title: "Add Goal"
  });
};


