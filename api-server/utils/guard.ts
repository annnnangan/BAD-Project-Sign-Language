import express from "express";

export const isLoggedIn = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session?.user) {
    next();
  } else {
    res.status(401).redirect("/login/login.html");
  }
};

export const isLoggedInAPI = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session?.user) {
    next();
  } else {
    res.status(400).json({ error: "You don't have permission" });
  }
};
