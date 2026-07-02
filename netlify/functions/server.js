// Netlify serverless entrypoint. It wraps the existing Express app with
// serverless-http so the same app that runs locally (`npm start`) runs as a
// Netlify Function. All requests are routed here by the redirect in netlify.toml,
// and serverless-http hands the original request path to Express for routing.
const serverless = require("serverless-http");
const app = require("../../server.js");

exports.handler = serverless(app);
