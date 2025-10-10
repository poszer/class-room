import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM rooms", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

export default router;
