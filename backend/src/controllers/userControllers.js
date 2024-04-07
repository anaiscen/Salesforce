const joi = require("joi");
// eslint-disable-next-line import/no-extraneous-dependencies
const randtoken = require("rand-token");
const emailUtil = require("../utils/emailUtil");
const models = require("../models");

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return joi
    .object({
      id: joi.number().integer().presence("optional"),
      firstname: joi.string().max(45).presence(presence),
      lastname: joi.string().max(45).presence(presence),
      email: joi.string().max(45).presence(presence),
      dateOfBirth: joi.date().presence(presence),
      hashedPassword: joi.string().max(255).presence(presence),
      liked: joi.number().integer().allow(null).allow("").presence("optional"),
      profilePicture: joi
        .string()
        .max(255)
        .allow(null)
        .allow("")
        .presence("optional"),
      creationDate: joi.date().presence("optional").allow(null).allow(""),
      roleId: joi.number().integer().presence(presence),
      teamId: joi.number().integer().presence(presence),
      token: joi.string().max(255).allow(null).allow("").presence("optional"),
    })
    .validate(data, { abortEarly: false }).error;
};

// eslint-disable-next-line consistent-return
const browse = (req, res) => {
  const companyId = parseInt(req.params.id, 10);
  if (companyId === req.payload.sub) {
    return res.status(201);
  }
  models.user
    .findAll(companyId)
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = (req, res) => {
  models.user
    .find(req.params.id)
    .then(([rows]) => {
      if (rows[0] == null) {
        res.sendStatus(404);
      } else {
        res.send(rows[0]);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const edit = async (req, res) => {
  const errors = validate(req.body, false);
  if (errors) {
    console.warn(errors);
    res.status(422).send({ errors });
    return;
  }
  const id = parseInt(req.params.id, 10);
  const {
    firstname,
    lastname,
    email,
    dateOfBirth,
    profilePicture,
    roleId,
    teamId,
  } = req.body;
  models.user
    .update(
      id,
      firstname,
      lastname,
      email,
      dateOfBirth,
      profilePicture,
      roleId,
      teamId
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// eslint-disable-next-line consistent-return
const add = (req, res) => {
  const errors = validate(req.body);
  if (errors) return res.sendStatus(422);
  console.warn(errors);
  const {
    firstname,
    lastname,
    email,
    dateOfBirth,
    hashedPassword,
    liked,
    profilePicture,
    roleId,
    teamId,
  } = req.body;
  models.user
    .insert(
      firstname,
      lastname,
      email,
      dateOfBirth,
      hashedPassword,
      liked,
      profilePicture,
      roleId,
      teamId
    )
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      if (err.errno === 1062) {
        res.status(409).send("User already exists");
      } else {
        console.error(err);
        res.sendStatus(500);
      }
    });
};

const destroy = (req, res) => {
  models.user
    .delete(req.params.id)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// un admin role = 1 doit avoir accès à toutes les entreprises

const findByEmailToNext = (req, res, next) => {
  const { email } = req.body;
  models.user
    .findByEmail(email)
    .then(([result]) => {
      if (result[0] != null) {
        // eslint-disable-next-line prefer-destructuring
        req.user = result[0];
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};
const roleUpdate = async (req, res) => {
  const errors = validate(req.body, false);
  if (errors) {
    console.warn(errors);
    res.status(422).send({ errors });
    return;
  }
  const id = parseInt(req.params.id, 10);
  const { roleId } = req.body;
  models.user
    .updateRoleId(id, roleId)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const resetPassword = (req, res) => {
  const { email } = req.body;
  models.user
    .sendEmail(email)
    .then(([result]) => {
      if (result[0] != null) {
        const token = randtoken.generate(20);
        emailUtil.sendEmail(email, result[0].firstname, token);
        models.user.updateToken(token, email);
        res.status(200).send("Mot de passe oublié : lien envoyé");
      } else {
        res.status(404).send("L'email n'existe pas");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Erreur lors de la recherche de l'utilisateur");
    });
};

const newPassword = (req, res) => {
  const { token, hashedPassword } = req.body;
  models.user
    .findUserByToken(token)
    .then(([result]) => {
      if (result[0] != null) {
        models.user.newPasswordByToken(hashedPassword, result[0].id);
        res.status(200).send("Le mot de passe a été réinitialisé");
      } else {
        res.status(403).send("Forbidden");
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send("Erreur lors de la réinitialisation su mot de passe");
    });
};

// UPDATE PROFILE (requete)
const updateProfile = (req, res) => {
  const userId = req.payload.sub;

  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier téléchargé" });
  }

  return models.user
    .find(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const profilePicture = req.file.filename;
      return models.user
        .updatePicture(userId, profilePicture)
        .then(() => {
          return res.status(200).json({ profilePicture });
        })
        .catch(() => {
          return res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch(() => {
      return res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
  findByEmailToNext,
  roleUpdate,
  resetPassword,
  newPassword,
  updateProfile,
};
