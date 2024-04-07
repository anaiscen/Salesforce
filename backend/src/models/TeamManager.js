const AbstractManager = require("./AbstractManager");

class TeamManager extends AbstractManager {
  constructor() {
    super({ table: "team" });
  }

  findAllTeams(companyId) {
    return this.database.query(
      `select * from ${this.table} where companyId = ?`,
      [companyId]
    );
  }

  insert(team) {
    return this.database.query(
      `insert into ${this.table} (name, companyId) values (?, ?)`,
      [team.name, team.companyId]
    );
  }

  update(team) {
    return this.database.query(
      `update ${this.table} set name = ? where id = ?`,
      [team.name, team.id]
    );
  }
}

module.exports = TeamManager;
