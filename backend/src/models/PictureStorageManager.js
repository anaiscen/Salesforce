const AbstractManager = require("./AbstractManager");

class PictureStorageManager extends AbstractManager {
  constructor() {
    super({ table: "picturestorage" });
  }

  insert(src, alt) {
    return this.database.query(
      `insert into ${this.table} (src, alt
        ) VALUES (?, ?)`,
      [src, alt]
    );
  }

  update(id, src) {
    return this.database.query(
      `UPDATE ${this.table}
      SET src = ? WHERE id = ?`,
      [src, id]
    );
  }

  delete(id) {
    return this.database.query(
      `DELETE FROM ${this.table} 
      WHERE id = ?`,
      [id]
    );
  }
}

module.exports = PictureStorageManager;
