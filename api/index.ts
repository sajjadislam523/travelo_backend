import serverless from "serverless-http";

import app from "../src/index";

const handler = serverless(app);

module.exports = handler;
