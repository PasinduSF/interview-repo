// The OpenAPI spec is defined as a plain object here (instead of via JSDoc
// comments in the route files) so it can't be broken by comment-stripping
// formatters/linters. No security scheme is declared, so Swagger UI shows NO
// global "Authorize" button; protected endpoints take the token via an
// Authorization header field right inside "Try it out".

const authHeaderParam = {
  in: "header",
  name: "Authorization",
  required: true,
  schema: { type: "string" },
  description: "Bearer <token> from POST /api/login",
  example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
};

const errorResponse = (description) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
});

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Trainee QA CRUD API",
    version: "1.0.0",
    description:
      "A small practice API for QA trainees.\n\n" +
      "**Flow to test:** Login → get a token → list courses → update a course.\n\n" +
      "**Seed user:** `admin` / `admin123`.\n\n" +
      "**How to send the token:** call `POST /api/login`, copy the `token` from the " +
      "response, then on the protected endpoints paste `Bearer <token>` into the " +
      "**Authorization** field before clicking Execute.",
  },
  // Relative URL so "Try it out" targets whatever host serves the docs
  // (localhost when run locally, the Vercel domain when deployed).
  servers: [{ url: "/", description: "Current host" }],
  tags: [
    { name: "Auth", description: "Login" },
    { name: "Courses", description: "Course list & update" },
  ],
  paths: {
    "/api/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in and receive a JWT token",
        description:
          "Authenticates a user against the JSON user store and returns a JWT. " +
          "Use `admin` / `admin123`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          400: errorResponse("Missing username or password"),
          401: errorResponse("Invalid credentials"),
        },
      },
    },
    "/api/courses": {
      get: {
        tags: ["Courses"],
        summary: "Get the list of courses",
        description:
          "Returns all courses. Paste `Bearer <token>` (from POST /api/login) " +
          "into the Authorization field below.",
        parameters: [authHeaderParam],
        responses: {
          200: {
            description: "Array of courses",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Course" },
                },
              },
            },
          },
          401: errorResponse("Missing or invalid token"),
        },
      },
    },
    "/api/courses/{id}": {
      put: {
        tags: ["Courses"],
        summary: "Update a course",
        description:
          "Updates one or more editable fields of a course. Paste `Bearer <token>` " +
          "into the Authorization field. Accepted fields: title, instructor, " +
          "durationHours, level, published.",
        parameters: [
          authHeaderParam,
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
            description: "Numeric ID of the course to update",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CourseUpdate" },
            },
          },
        },
        responses: {
          200: {
            description: "The updated course",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Course" },
              },
            },
          },
          400: errorResponse("Validation error (bad id or field value)"),
          401: errorResponse("Missing or invalid token"),
          404: errorResponse("Course not found"),
        },
      },
    },
  },
  components: {
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", example: "admin" },
          password: { type: "string", example: "admin123" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." },
          user: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              username: { type: "string", example: "admin" },
              role: { type: "string", example: "admin" },
            },
          },
        },
      },
      Course: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Introduction to Manual Testing" },
          instructor: { type: "string", example: "Alice Johnson" },
          durationHours: { type: "integer", example: 12 },
          level: {
            type: "string",
            enum: ["Beginner", "Intermediate", "Advanced"],
            example: "Beginner",
          },
          published: { type: "boolean", example: true },
        },
      },
      CourseUpdate: {
        type: "object",
        description: "Send any subset of the editable fields.",
        properties: {
          title: { type: "string", example: "Introduction to Manual Testing (v2)" },
          instructor: { type: "string", example: "Alice Johnson" },
          durationHours: { type: "integer", example: 15 },
          level: {
            type: "string",
            enum: ["Beginner", "Intermediate", "Advanced"],
            example: "Intermediate",
          },
          published: { type: "boolean", example: true },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Something went wrong" },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
