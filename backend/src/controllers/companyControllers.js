const joi = require("joi");
const models = require("../models");

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return joi
    .object({
      companyName: joi.string().max(150).presence(presence),
      nSiret: joi.string().max(45).presence(presence),
      contactPerson: joi.string().max(45).presence(presence),
      email: joi.string().max(45).presence(presence),
      phone: joi.string().max(45).presence(presence),
      creationDate: joi.string().presence("optional").allow(null).allow(""),
    })
    .validate(data, { abortEarly: false }).error;
};

const browse = (req, res) => {
  models.company
    .findAll()
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = (req, res) => {
  models.company
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

const edit = (req, res) => {
  const company = req.body;

  const errors = validate(req.body, false);
  if (errors) {
    res.sendStatus(422);
  }
  company.id = parseInt(req.params.id, 10);

  models.company
    .update(company)
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
  if (errors) {
    return res.sendStatus(422);
  }
  const company = req.body;
  models.company
    .insert(company)
    .then(([result]) => {
      res.status(201).json({ id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const destroy = (req, res) => {
  const id = parseInt(req.params.id, 10);
  models.company
    .delete(id)
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

module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
};
