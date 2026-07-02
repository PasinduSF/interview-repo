// Seed data is loaded via require() (not fs.readFileSync) so Vercel bundles the
// JSON into the serverless function. Vercel's filesystem is read-only at runtime,
// so we never write to disk: courses are held in memory. Updates therefore persist
// for the life of a warm function instance and reset on a cold start — which is
// fine for this QA practice API. Locally with `node server.js` it behaves the same
// (in-memory), just without touching the JSON files.
const seedUsers = require("../data/users.json");
const seedCourses = require("../data/courses.json");

// Clone so the in-memory copy can be mutated without altering the required module.
let courses = JSON.parse(JSON.stringify(seedCourses));

module.exports = {
  getUsers: () => seedUsers,
  getCourses: () => courses,
  saveCourses: (next) => {
    courses = next;
  },
};
