const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.DB_NAME);

  const load = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data-seed", f), "utf8"));

  const ciudades = load("ciudades.json");
  const arquitectos = load("arquitectos.json");

  await db.collection("ciudades").deleteMany({});
  await db.collection("arquitectos").deleteMany({});
  await db.collection("edificios").deleteMany({});

  const rc = await db.collection("ciudades").insertMany(ciudades);
  const ra = await db.collection("arquitectos").insertMany(arquitectos);

  const ciudadIds = Object.values(rc.insertedIds);
  const arqIds = Object.values(ra.insertedIds);

  // 12 edificios ejemplo (mezclando refs)
  const edificios = [
    { nombre: "Burj Khalifa", altura_m: 828, pisos: 163, anio_inauguracion: 2010, uso: "mixto", imagen_url: "https://example.com/burj.jpg", ciudad_id: ciudadIds[0], arquitecto_id: arqIds[0] },
    { nombre: "Shanghai Tower", altura_m: 632, pisos: 128, anio_inauguracion: 2015, uso: "oficinas", imagen_url: "https://example.com/shanghai-tower.jpg", ciudad_id: ciudadIds[1], arquitecto_id: arqIds[1] },
    { nombre: "One World Trade Center", altura_m: 541, pisos: 104, anio_inauguracion: 2014, uso: "oficinas", imagen_url: "https://example.com/onewtc.jpg", ciudad_id: ciudadIds[2], arquitecto_id: arqIds[4] },
    { nombre: "Petronas Tower 1", altura_m: 452, pisos: 88, anio_inauguracion: 1998, uso: "oficinas", imagen_url: "https://example.com/petronas1.jpg", ciudad_id: ciudadIds[3], arquitecto_id: arqIds[2] },
    { nombre: "Petronas Tower 2", altura_m: 452, pisos: 88, anio_inauguracion: 1998, uso: "oficinas", imagen_url: "https://example.com/petronas2.jpg", ciudad_id: ciudadIds[3], arquitecto_id: arqIds[2] },
    { nombre: "Lotte World Tower", altura_m: 555, pisos: 123, anio_inauguracion: 2017, uso: "mixto", imagen_url: "https://example.com/lotte.jpg", ciudad_id: ciudadIds[4], arquitecto_id: arqIds[5] },
    { nombre: "Taipei 101", altura_m: 509, pisos: 101, anio_inauguracion: 2004, uso: "oficinas", imagen_url: "https://example.com/taipei101.jpg", ciudad_id: ciudadIds[5], arquitecto_id: arqIds[4] },
    { nombre: "Central Park Tower", altura_m: 472, pisos: 98, anio_inauguracion: 2020, uso: "residencial", imagen_url: "https://example.com/cpt.jpg", ciudad_id: ciudadIds[2], arquitecto_id: arqIds[0] },
    { nombre: "432 Park Avenue", altura_m: 425, pisos: 85, anio_inauguracion: 2015, uso: "residencial", imagen_url: "https://example.com/432park.jpg", ciudad_id: ciudadIds[2], arquitecto_id: arqIds[3] },
    { nombre: "Marina 101", altura_m: 425, pisos: 101, anio_inauguracion: 2017, uso: "residencial", imagen_url: "https://example.com/marina101.jpg", ciudad_id: ciudadIds[0], arquitecto_id: arqIds[1] },
    { nombre: "Princess Tower", altura_m: 413, pisos: 101, anio_inauguracion: 2012, uso: "residencial", imagen_url: "https://example.com/princess.jpg", ciudad_id: ciudadIds[0], arquitecto_id: arqIds[5] },
    { nombre: "Jin Mao Tower", altura_m: 421, pisos: 88, anio_inauguracion: 1999, uso: "mixto", imagen_url: "https://example.com/jinmao.jpg", ciudad_id: ciudadIds[1], arquitecto_id: arqIds[3] }
  ];

  await db.collection("edificios").insertMany(edificios);

  console.log("Seed completo ?", {
    ciudades: ciudadIds.length,
    arquitectos: arqIds.length,
    edificios: edificios.length
  });

  await client.close();
})();
