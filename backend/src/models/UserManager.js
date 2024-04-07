const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  constructor() {
    super({ table: "user" });
  }

  insert(
    firstname,
    lastname,
    email,
    dateOfBirth,
    hashedPassword,
    liked,
    profilePicture,
    roleId,
    teamId
  ) {
    return this.database.query(
      `insert into ${this.table} (firstname,
      lastname,
      email,
      dateOfBirth,
      hashedPassword,
      liked,
      profilePicture,
      roleId, teamId) VALUES (?, ?, ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?)`,
      [
        firstname,
        lastname,
        email,
        dateOfBirth,
        hashedPassword,
        liked,
        profilePicture,
        roleId,
        teamId,
      ]
    );
  }

  updatePicture(id, profilePicture) {
    return this.database.query(
      `UPDATE user SET   
      profilePicture = ?
      WHERE id = ?`,
      [profilePicture, id]
    );
  }

  update(
    id,
    firstname,
    lastname,
    email,
    dateOfBirth,
    profilePicture,
    roleId,
    teamId
  ) {
    return this.database.query(
      `UPDATE user SET 
    firstname = ?,
    lastname = ?,
    email = ?,
    dateOfBirth = ?,
    profilePicture = ?,
    roleId = ?,
    teamId = ?
    WHERE id = ?`,
      [
        firstname,
        lastname,
        email,
        dateOfBirth,
        profilePicture,
        roleId,
        teamId,
        id,
      ]
    );
  }

  findByEmail(email) {
    return this.database.query(
      `SELECT user.id, firstname,
      lastname,
      email,
      dateOfBirth,
      hashedPassword,
      liked,
      profilePicture,
      creationDate,
      roleId,
      teamId,
      companyId, 
      role.name As roleName
      FROM user, team, role
      WHERE email = ? and roleId != 4 and user.teamId = team.id AND user.roleId = role.id`,
      [email]
    );
  }

  findAll(companyId) {
    return this.database.query(
      `select user.id, firstname,
  lastname,
  email,
  dateOfBirth,
  liked,
  profilePicture,
  creationDate,
  roleId,
  companyId
  teamId FROM user, team  WHERE roleId != 4 and user.teamId = team.id and companyId = ?`,
      [companyId]
    );
  }

  updateRoleId(id, roleId) {
    return this.database.query(`UPDATE user SET roleId = ? WHERE id = ?`, [
      roleId,
      id,
    ]);
  }

  sendEmail(email) {
    return this.database.query(
      `SELECT user.id, user.firstname FROM ${this.table} WHERE email = ?`,
      [email]
    );
  }

  updateToken(token, email) {
    return this.database.query(`UPDATE user SET token = ? WHERE email = ?`, [
      token,
      email,
    ]);
  }

  findUserByToken(token) {
    return this.database.query(
      `SELECT user.id FROM ${this.table} WHERE token = ?`,
      [token]
    );
  }

  newPasswordByToken(password, id) {
    return this.database.query(
      `UPDATE user SET token = null, hashedPassword = ? WHERE id = ?`,
      [password, id]
    );
  }
}

module.exports = UserManager;
