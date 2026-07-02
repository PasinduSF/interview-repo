const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DATA_DIR = path.join(__dirname, "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const COURSES_FILE = path.join(DATA_DIR, "courses.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

// Seed the users file on first run with bcrypt-hashed passwords so we never
// store plaintext credentials on disk.
function seedUsers() {
  if (fs.existsSync(USERS_FILE)) return;
  const defaults = [
    { id: 1, username: "admin", password: "admin123", role: "admin" },
  ];
  const users = defaults.map((u) => ({
    id: u.id,
    username: u.username,
    passwordHash: bcrypt.hashSync(u.password, 10),
    role: u.role,
  }));
  writeJson(USERS_FILE, users);
}

seedUsers();

module.exports = {
  getUsers: () => readJson(USERS_FILE),
  getCourses: () => readJson(COURSES_FILE),
  saveCourses: (courses) => writeJson(COURSES_FILE, courses),
};
