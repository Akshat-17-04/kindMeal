const details = require("../models/DetailLog");

async function createAuditLog({ actorId, action, entity, entityId, data }) {
  await AuditLog.create({
    actorId,
    action,
    entity,
    entityId,
    data,
  });
}
module.exports = createAuditLog;
