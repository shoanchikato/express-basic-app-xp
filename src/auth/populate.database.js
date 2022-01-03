const { getManager } = require("typeorm");
const PermissionModel = require("../model/permission.model");
const RoleModel = require("../model/role.model");

const roles = require("./roles");
const permissions = require("./permissions");

async function populateDatabase() {
  try {
    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(PermissionModel, permissions);
      await transactionalEntityManager.save(RoleModel, roles);
    });
  } catch (error) {
    console.log(
      `Error saving permissions and role on application bootstrap \n\n ${error.stack}`
    );
  }
}

module.exports = populateDatabase;
