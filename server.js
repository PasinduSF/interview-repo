const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./src/swagger");
const authRoutes = require("./src/routes/authRoutes");
const courseRoutes = require("./src/routes/courseRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.use("/api", authRoutes);
app.use("/api/courses", courseRoutes);

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      tryItOutEnabled: true, // "Try it out" open by default on every endpoint
    },
  })
);
app.get("/swagger.json", (req, res) => res.json(swaggerSpec));

// Friendly root redirect to the docs
app.get("/", (req, res) => res.redirect("/api-docs"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central error handler (e.g. malformed JSON bodies)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Trainee QA CRUD API running at http://localhost:${PORT}`);
  console.log(`Swagger docs available at   http://localhost:${PORT}/api-docs`);
});

module.exports = app;
