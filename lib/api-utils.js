const { MongoClient, ObjectId } = require("mongodb");

let cached = { client: null, db: null };

async function getDb() {
  if (cached.db) return cached.db;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  cached = { client, db };
  return db;
}

function oid(id) {
  try { return new ObjectId(id); } catch { return null; }
}

function json(status, data) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
}

module.exports = { getDb, oid, json, ObjectId };
