const { MongoClient } = require("mongodb");
require("dotenv").config();
(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const hello = await c.db().admin().command({ hello: 1 });
  console.log("✅ Conectado a:", hello.setName || hello.msg || "cluster");
  await c.close();
})();
