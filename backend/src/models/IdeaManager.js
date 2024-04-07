const AbstractManager = require("./AbstractManager");

class IdeaManager extends AbstractManager {
  constructor() {
    super({ table: "idea" });
  }

  findByUser(id) {
    return this.database.query(
      `SELECT i.*, u.id AS userId, u.firstname, u.lastname,cat.name AS categoryName FROM ${this.table} i
      INNER JOIN useridea ui
      ON i.id = ui.ideaId
      INNER JOIN user u
      ON ui.userId = u.id
      INNER JOIN category cat
      ON i.categoryId = cat.id
      WHERE i.id = ?
      AND ui.postCreator = 1
      `,
      [id]
    );
  }

  getIdeaByUser(id) {
    return this.database.query(
      `SELECT i.*, u.id AS userId, u.firstname, u.lastname,cat.name AS categoryName, ps.src, ps.alt FROM ${this.table} i
    INNER JOIN useridea ui
    ON i.id = ui.ideaId
    INNER JOIN user u
    ON ui.userId = u.id
    INNER JOIN category cat
    ON i.categoryId = cat.id
    INNER JOIN picturestorage ps
    ON i.pictureId = ps.id
    WHERE u.id = ?
    AND ui.postCreator = 1
    `,
      [id]
    );
  }

  findAllAndPicture(id) {
    return this.database.query(
      `SELECT i.*, ps.src, ps.alt FROM ${this.table}  i
      INNER JOIN picturestorage ps
      ON i.pictureId = ps.id
      INNER JOIN category cat
      ON i.categoryId = cat.id
      INNER JOIN company comp
      ON cat.companyCategoryId = comp.id
      WHERE comp.id = ?
      `,
      [id]
    );
  }

  insert(title, text, categoryId, pictureId, archived) {
    return this.database.query(
      `insert into ${this.table} (title,
        text,
        categoryId,
        pictureId, archived) VALUES (?, ?, ?, ?, ?)`,
      [title, text, categoryId, pictureId, archived]
    );
  }

  insertUserAutorIdea(ideaId, userId) {
    return this.database.query(
      `INSERT INTO useridea (
          liked, postCreator, ideaId, userId
        ) VALUES (0, 1, ?, ?)`,
      [ideaId, userId]
    );
  }

  update(id, idee) {
    return this.database.query(
      `UPDATE ${this.table}
      SET text = ? WHERE id = ?`,
      [idee, id]
    );
  }

  archive(id, archived) {
    return this.database.query(
      `UPDATE ${this.table}
      SET archived = ? WHERE id = ?`,
      [archived, id]
    );
  }

  delete(id) {
    return this.database.query(
      `DELETE FROM ${this.table} 
      WHERE id = ?`,
      [id]
    );
  }

  likeIdea(liked, ideaId, userId) {
    return this.database.query(
      `INSERT INTO userIdea (liked, postCreator, ideaId, userId ) VALUES (?, ?, ?, ?)`,
      [liked, 0, ideaId, userId]
    );
  }

  existingLike(userId, ideaId) {
    return this.database.query(
      `SELECT * FROM userIdea WHERE userId = ? AND ideaId = ? AND postCreator = 0`,
      [userId, ideaId]
    );
  }

  updateLike(newLikedValue, userId, ideaId) {
    return this.database.query(
      `UPDATE userIdea SET liked = ? WHERE userId = ? AND ideaId = ?`,
      [newLikedValue, userId, ideaId]
    );
  }

  getLikeStatus(userId, ideaId) {
    return this.database.query(
      `SELECT liked FROM userIdea where userId = ? and ideaId = ? `,
      [userId, ideaId]
    );
  }

  getLikeNumber(ideaId) {
    return this.database.query(
      `SELECT COUNT(*) as count FROM userIdea WHERE ideaId = ? AND liked = 1 AND postCreator = 0`,
      [ideaId]
    );
  }
}

module.exports = IdeaManager;
