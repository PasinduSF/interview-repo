// Seed data is inlined here as plain JS (rather than read from JSON files) so the
// serverless bundler on Netlify/Vercel has nothing external to resolve — this
// avoids "Cannot find module" bundling errors. The serverless filesystem is also
// read-only, so we never write to disk: courses live in memory. Updates therefore
// persist for the life of a warm function instance and reset on a cold start,
// which is fine for this QA practice API.

// admin / admin123  (passwordHash is bcrypt of "admin123")
const SEED_USERS = [
  {
    id: 1,
    username: "admin",
    passwordHash: "$2a$10$5uDuNUf.W/CXkXLPw08vuuYiYE4FU3gwiwTeHpDfGeX3Ugb4fnv1m",
    role: "admin",
  },
];

const SEED_COURSES = [
  { id: 1, title: "Introduction to Manual Testing", instructor: "Alice Johnson", durationHours: 12, level: "Beginner", published: true },
  { id: 2, title: "API Testing", instructor: "Bob Smith", durationHours: 8, level: "Intermediate", published: true },
  { id: 3, title: "Test Automation Fundamentals", instructor: "Carla Reyes", durationHours: 20, level: "Intermediate", published: false },
];

// Clone so the in-memory copy can be mutated without altering the seed constant.
let courses = JSON.parse(JSON.stringify(SEED_COURSES));

module.exports = {
  getUsers: () => SEED_USERS,
  getCourses: () => courses,
  saveCourses: (next) => {
    courses = next;
  },
};
