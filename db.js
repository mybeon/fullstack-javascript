const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) {
    client.close();
    return;
  }
  const db = client.db();
  module.exports = db;
  const app = require("./app");
  app.listen(process.env.PORT, () => {
    console.log("server started...");
  });
});
