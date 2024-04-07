const joi = require("joi");
const models = require("../models");

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return joi
    .object({
      id: joi.number().min(0).presence("optional"),
      title: joi.string().max(120).presence(presence),
      text: joi.string().max(4000).presence(presence),
      createDate: joi.date().presence("optional").allow(null).allow(""),
      categoryId: joi.number().min(0).presence(presence),
      pictureId: joi.number().min(0).presence(presence),
      archived: joi.boolean().truthy(1).falsy(0).presence(presence),
      action: joi.string().max(20).presence("optional"),
      ideaId: joi.number().min(0).presence("optional"),
      userId: joi.number().min(0).presence("optional"),
      firstname: joi.string().max(255).presence("optional"),
      lastname: joi.string().max(255).presence("optional"),
      categoryName: joi.string().max(255).presence("optional"),
    })
    .validate(data, { abortEarly: false }).error;
};

const browse = (req, res) => {
  models.idea
    .findAllAndPicture(req.params.id)
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.send(500);
    });
};

const getIdeaByUser = (req, res) => {
  models.idea
    .getIdeaByUser(req.params.id)
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.send(500);
    });
};

const read = (req, res) => {
  models.idea
    .findByUser(req.params.id)
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

  if (req.body.action === "update") {
    const { text } = req.body;

    models.idea
      .update(id, text)
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
  } else if (req.body.action === "archive") {
    const { archived } = req.body;

    models.idea
      .archive(id, archived)
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
  }
};

const add = (req, res) => {
  const { title, text, categoryId, pictureId, archived, userId } = req.body;
  const data = { title, text, categoryId, pictureId, archived };
  const error = validate(data);
  if (error) {
    res.status(422).send({ error });
    return;
  }

  models.idea
    .insert(title, text, categoryId, pictureId, archived)
    .then(([result]) => {
      const newIdeaId = result.insertId;

      models.idea
        .insertUserAutorIdea(newIdeaId, userId, result.insertId)
        .then(() => {
          res.status(201).send({ id: newIdeaId });
        })
        .catch((err) => {
          console.error(err);
          res.send("Error autor").status(500);
        });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error content").status(500);
    });
};

const destroy = (req, res) => {
  const id = parseInt(req.params.id, 10);

  models.idea
    .delete(id)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.send("Idea Delete").status(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const like = (req, res) => {
  const { userId } = req.body;
  const { ideaId } = req.body;
  const liked = 1;

  models.idea
    .existingLike(userId, ideaId)
    .then(([existingLike]) => {
      if (existingLike.length === 0) {
        models.idea
          .likeIdea(liked, ideaId, userId)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            console.error(err);
            res.sendStatus(500);
          });
      } else {
        const newLikedValue = existingLike[0].liked === 0 ? 1 : 0;
        models.idea
          .updateLike(newLikedValue, userId, ideaId)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            console.error(err);
            res.sendStatus(500);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const likeStatus = (req, res) => {
  const { sub: userId } = req.payload;
  const ideaId = req.params.id;

  models.idea
    .getLikeStatus(userId, ideaId)
    .then(([result]) => {
      res.send(result[0]);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const likeNumber = (req, res) => {
  const ideaId = req.params.id;

  models.idea
    .getLikeNumber(ideaId)
    .then(([result]) => {
      res.send(result[0]);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  browse,
  getIdeaByUser,
  read,
  edit,
  add,
  destroy,
  like,
  likeStatus,
  likeNumber,
};
