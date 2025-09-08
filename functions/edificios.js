const { getDb, oid, json } = require("..\/lib\/api-utils");
const { withCors } = require('./_utils/cors');

exports.handler =  withCors(async (event) => {
  try {
    const db = await getDb();
    const col = db.collection("edificios");
    const qs = event.queryStringParameters || {};
    const id = qs.id || null;

    switch (event.httpMethod) {
      case "GET": {
        if (id) {
          const _id = oid(id); if (!_id) return json(400, { error: "id inválido" });
          const doc = await col.findOne({ _id });
          if (!doc) return json(404, { error: "no encontrado" });
          return json(200, doc);
        }
        const q = {};
        if (qs.ciudad_id) q.ciudad_id = oid(qs.ciudad_id);
        if (qs.arquitecto_id) q.arquitecto_id = oid(qs.arquitecto_id);
        const list = await col.find(q).sort({ altura_m: -1 }).toArray();
        return json(200, list);
      }
      case "POST": {
        const body = JSON.parse(event.body || "{}");
        const required = ["nombre","altura_m","pisos","anio_inauguracion","uso","imagen_url","ciudad_id","arquitecto_id"];
        for (const f of required) if (!(f in body)) return json(400, { error: `Falta campo: ${f}` });
        body.ciudad_id = oid(body.ciudad_id);
        body.arquitecto_id = oid(body.arquitecto_id);
        const r = await col.insertOne(body);
        return json(201, { _id: r.insertedId, ...body });
      }
      case "PUT":
      case "PATCH": {
        if (!id) return json(400, { error: "id requerido" });
        const _id = oid(id); if (!_id) return json(400, { error: "id inválido" });
        const body = JSON.parse(event.body || "{}");
        if (body.ciudad_id) body.ciudad_id = oid(body.ciudad_id);
        if (body.arquitecto_id) body.arquitecto_id = oid(body.arquitecto_id);
        await col.updateOne({ _id }, { $set: body });
        const updated = await col.findOne({ _id });
        return json(200, updated);
      }
      case "DELETE": {
        if (!id) return json(400, { error: "id requerido" });
        const _id = oid(id); if (!_id) return json(400, { error: "id inválido" });
        await col.deleteOne({ _id });
        return json(204, {});
      }
      default:
        return json(405, { error: "Método no soportado" });
    }
  } catch (e) {
    console.error(e);
    return json(500, { error: "Error del servidor" });
  }
});
