const express = require("express");
const db = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const EDITABLE_FIELDS = [
  "title",
  "instructor",
  "durationHours",
  "level",
  "published",
];

router.get("/", requireAuth, (req, res) => {
  res.json(db.getCourses());
});

router.put("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id must be an integer" });
  }

  const courses = db.getCourses();
  const course = courses.find((c) => c.id === id);
  if (!course) {
    return res.status(404).json({ error: `Course ${id} not found` });
  }

  const body = req.body || {};
  const updates = {};

  for (const field of EDITABLE_FIELDS) {
    if (body[field] === undefined) continue;

    const value = body[field];
    switch (field) {
      case "title":
      case "instructor":
        if (typeof value !== "string" || value.trim() === "") {
          return res
            .status(400)
            .json({ error: `${field} must be a non-empty string` });
        }
        updates[field] = value.trim();
        break;
      case "durationHours":
        if (!Number.isInteger(value) || value < 0) {
          return res
            .status(400)
            .json({ error: "durationHours must be a non-negative integer" });
        }
        updates[field] = value;
        break;
      case "level":
        if (!LEVELS.includes(value)) {
          return res
            .status(400)
            .json({ error: `level must be one of: ${LEVELS.join(", ")}` });
        }
        updates[field] = value;
        break;
      case "published":
        if (typeof value !== "boolean") {
          return res.status(400).json({ error: "published must be a boolean" });
        }
        updates[field] = value;
        break;
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  Object.assign(course, updates);
  db.saveCourses(courses);
  res.json(course);
});

module.exports = router;
