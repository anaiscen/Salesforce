const AbstractManager = require("./AbstractManager");

class CategoryManager extends AbstractManager {
  constructor() {
    super({ table: "category" });
  }

  findByCompany(id) {
    return this.database.query(
      `SELECT cat.* FROM ${this.table} cat
      INNER JOIN company comp
      ON cat.companyCategoryId = comp.id
      WHERE comp.id = ?
      `,
      [id]
    );
  }

  // ajout d'une nouvelle catégorie d'idée

  async addCategory(name, companyCategoryId) {
    return this.database.query(
      `INSERT INTO ${this.table} (name, companyCategoryId) VALUES (?, ?)`,
      [name, companyCategoryId]
    );
  }

  // mis à jour de catégories d'idée deja creer

  async update(id, category) {
    return this.database.query(
      `UPDATE ${this.table}
      SET name = ? WHERE id = ?`,
      [category, id]
    );
  }

  // Suppression d'une catégorie

  async deleteCategory(categoryId) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [
      categoryId,
    ]);
  }
}

module.exports = CategoryManager;
