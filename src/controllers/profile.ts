/**
 * GET /goals/queue/add
 * Goals page.
 */
export let create = (req: Request, res: Response) => {
    res.render("profile_create", {
        title: "Create Profile"
    });
};
