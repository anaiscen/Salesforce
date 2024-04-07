const joi = require("joi");

const models = require("../models");

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";

  return joi
    .object({
      id: joi.number().min(0).presence("optional"),

      name: joi.string().max(50).presence(presence),

      companyCategoryId: joi.number().min(0).presence(presence),
    })
    .validate(data, { abortEarly: false }).error;
};

const browse = (req, res) => {
  models.category

    .findByCompany(req.params.id)

    .then(([rows]) => {
      res.send(rows);
    })

    .catch((err) => {
      console.error(err);

      res.send(500);
    });
};

const read = (req, res) => {
  models.category

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
  const error = validate(req.body, false);

  if (error) {
    res.status(422).send({ error });

    return;
  }

  const id = parseInt(req.params.id, 10);

  const { name } = req.body;

  models.category

    .update(id, name)

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

const add = (req, res) => {
  const { name, companyCategoryId } = req.body;

  const data = { name, companyCategoryId };

  const error = validate(data);

  if (error) {
    res.status(422).send({ error });

    return;
  }

  models.category

    .addCategory(name, companyCategoryId)

    .then(([result]) => {
      res.location(`/items/${result.insertId}`).sendStatus(201);
    })

    .catch((err) => {
      console.error(err);

      res.sendStatus(500);
    });
};

const destroy = (req, res) => {
  const id = parseInt(req.params.id, 10);

  models.category

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
