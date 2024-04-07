const AbstractManager = require("./AbstractManager");

class CompanyManager extends AbstractManager {
  constructor() {
    super({ table: "company" });
  }

  insert(company) {
    return this.database.query(
      `insert into ${this.table} (companyName, nSiret, contactPerson, email, phone) values ( ?, ?, ?, ?, ?)`,
      [
        company.companyName,
        company.nSiret,
        company.contactPerson,
        company.email,
        company.phone,
      ]
    );
  }

  update(company) {
    return this.database.query(`update ${this.table} set ? where id = ?`, [
      {
        companyName: company.companyName,
        nSiret: company.nSiret,
        contactPerson: company.contactPerson,
        email: company.email,
        phone: company.phone,
      },
      company.id,
    ]);
  }
}

module.exports = CompanyManager;
