import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiLike, BiDislike } from "react-icons/bi";
import { useUser } from "../../contexts/UserContext";
import Comment from "./comment/Comment";
import IdeaUpdate from "./IdeaUpdate";
import editBtn from "../../assets/edit-button.png";
import speechBubble from "../../assets/speech-bubble.png";
import useApi from "../../services/useApi";
import userRoles from "../../utils/userRoles";

function IdeaContent() {
  const api = useApi();
  const { user } = useUser();
  const { id } = useParams();
  const commentListRef = useRef(null);
  const navigate = useNavigate();

  const [comment, setComment] = useState([]);
  const [detailsIdea, setDetailsIdea] = useState({});
  const [editContent, setEditContent] = useState(false);
  const [refreshAfterArchive, setRefreshAfterArchive] = useState(false);
  const [refreshComment, setRefreshComment] = useState(false);
  const [textComment, setTextComment] = useState("");
  const [totalComments, setTotalComments] = useState(0);
  const [showConfirmationArchive, setShowConfirmationArchive] = useState(false);
  const [likeStatus] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(null);
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
  const [setIsIdeaArchived] = useState(false);

  useEffect(() => {
    api
      .get(`/idea/${id}`)
      .then((resp) => {
        setDetailsIdea(resp.data);
        setIsIdeaArchived(resp.data.archived === 1);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refreshAfterArchive]);

  useEffect(() => {
    api
      .get(`/idea/${id}/comment`)
      .then((resp) => {
        setComment(
          resp.data.sort(
            (a, b) => new Date(a.createDate) - new Date(b.createDate)
          )
        );
        setTotalComments(resp.data.length);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refreshComment]);

  const handleSubmitNewComment = (e) => {
    e.preventDefault();
    if (detailsIdea.archived !== 1) {
      const newComment = {
        text: textComment,
        ideaCommentaryId: detailsIdea.id,
        userId: user.id,
      };
      api
        .post("/comment", newComment)
        .then((resp) => {
          setComment([...comment, resp.data]);
          setTextComment("");
          setRefreshComment(!refreshComment);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleClickEdit = () => {
    if (
      user.id === detailsIdea.userId ||
      user.roleId === userRoles.ADMIN ||
      user.roleId === userRoles.SALESFORCE
    ) {
      setEditContent(!editContent);
    }
  };

  const handleClickArchiveIdea = () => {
    if (user.id === detailsIdea.userId || user.roleId === userRoles.ADMIN) {
      const updateArchiveIdea = {
        ...detailsIdea,
        archived: 1,
        action: "archive",
      };

      api
        .put(`/idea/${id}`, updateArchiveIdea)
        .then((resp) => {
          setDetailsIdea(resp.data);
          setRefreshAfterArchive(true);
          setShowConfirmationArchive(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const confirmArchive = () => {
    setShowConfirmationArchive(true);
  };

  const handleCommentUpdate = () => {
    setRefreshComment(!refreshComment);
  };

  const handleClickDeleteIdea = () => {
    if (
      user.roleId === userRoles.ADMIN ||
      user.roleId === userRoles.SALESFORCE
    ) {
      api
        .delete(`/idea/${id}`)
        .then(() => {
          setShowConfirmationDelete(false);
          navigate("/idea");
        })
        .catch((err) => console.error(err));
    }
  };

  const confirmDelete = () => {
    setShowConfirmationDelete(true);
  };

  useEffect(() => {
    api
      .get(`/idea/${id}/like`)
      .then((resp) => {
        setHasLiked(resp.data.liked === 1);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [likeStatus]);

  const handleLike = () => {
    const newStatus = { userId: user.id, ideaId: id, liked: !hasLiked ? 1 : 0 };
    api
      .post(`/idea/${id}/like`, newStatus)
      .then(() => {
        setHasLiked(!hasLiked);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    api
      .get(`/idea/${id}/like/count`)
      .then((response) => {
        setLikeCount(response.data.count);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [likeStatus, hasLiked]);

  return (
    <section className="idea-section-container">
      <div className="idea-section">
        <h1 className="idea-title">
          {detailsIdea.title}
          {detailsIdea.archived === 1 && (
            <span className="archived-text">
              <h6> Idée archivée</h6>
            </span>
          )}
        </h1>
        <div className="idea-section-btn-div">
          <button type="button" className="idea-section-btn-cat">
            {detailsIdea.categoryName}
          </button>

          {(user.roleId === userRoles.ADMIN ||
            user.roleId === userRoles.SALESFORCE) && (
            <button
              type="button"
              className="idea-section-btn-cat"
              onClick={() => confirmDelete()}
            >
              Supprimer
            </button>
          )}
        </div>
      </div>

      {showConfirmationDelete && (
        <div className="deleteContainer">
          <div className="deleteConfirmation">
            <p>
              Voulez-vous vraiment supprimer cette idée ?
              <br />
              {detailsIdea.title}
            </p>
            <div className="deleteConfirmationButtons">
              <button
                type="submit"
                className="deleteConfirmationButton"
                onClick={handleClickDeleteIdea}
              >
                Oui
              </button>
              <button
                type="submit"
                className="deleteConfirmationButton"
                onClick={() => setShowConfirmationDelete(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="idea-comment-container">
        {editContent ? (
          <IdeaUpdate
            detailsIdea={detailsIdea}
            setDetailsIdea={setDetailsIdea}
            handleClickEdit={handleClickEdit}
          />
        ) : (
          <div className="idea-container">
            <div className="head-title-content">
              <div className="autor-div">
                <h4 className="idea-autor-name">
                  {detailsIdea.firstname} {detailsIdea.lastname}
                </h4>
                <h6 className="idea-date">
                  {new Date(detailsIdea.createDate).toLocaleString("fr-FR", {
                    timeZone: "UTC",
                  })}
                </h6>
              </div>

              {(user.id === detailsIdea.userId ||
                user.roleId === userRoles.ADMIN ||
                user.roleId === userRoles.SALESFORCE) && (
                <button
                  className="edit-btn"
                  type="button"
                  onClick={handleClickEdit}
                >
                  <img src={editBtn} alt="Logo edit" className="edit-img" />
                </button>
              )}
            </div>

            <p className="text-idea">{detailsIdea.text}</p>

            <div className="foot-idea-content">
              <div className="like-comment-div">
                <div className="like-div">
                  <button className="like-btn" type="button">
                    <p className="like-count"> {likeCount}</p>

                    <div>
                      {hasLiked ? (
                        <button
                          type="button"
                          onClick={handleLike}
                          className="like__button"
                        >
                          <BiDislike
                            className="like__icon like__icon--red"
                            alt="like icon"
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleLike}
                          className="like__button"
                        >
                          <BiLike
                            className=" like__icon like__icon--blue"
                            alt="unlike icon"
                          />
                        </button>
                      )}
                    </div>
                  </button>
                </div>

                <div className="add-comment-div">
                  <button className="add-comment-btn" type="button">
                    <p className="comment-count">{totalComments}</p>
                    <img
                      src={speechBubble}
                      alt="Logo commentaire"
                      className="speech-bubble"
                    />
                  </button>
                </div>
              </div>
              <div className="archive-idea">
                {(user.id === detailsIdea.userId ||
                  user.roleId === userRoles.ADMIN) &&
                  detailsIdea.archived !== 1 && (
                    <button
                      type="button"
                      className="archive-idea-btn"
                      onClick={confirmArchive}
                    >
                      Archiver l'idée
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}

        {showConfirmationArchive && (
          <div className="deleteContainer">
            <div className="deleteConfirmation">
              <p>
                Voulez-vous vraiment archiver cette idée ? {detailsIdea.title}
              </p>
              <div className="deleteConfirmationButtons">
                <button
                  type="submit"
                  className="deleteConfirmationButton"
                  onClick={handleClickArchiveIdea}
                >
                  Oui
                </button>
                <button
                  type="submit"
                  className="deleteConfirmationButton"
                  onClick={() => setShowConfirmationArchive(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="comment-section">
          <h3 className="comment-main-title">Commentaires :</h3>

          {detailsIdea.archived !== 1 && (
            <form onSubmit={handleSubmitNewComment} className="form-newComment">
              <input
                type="text"
                value={textComment}
                onChange={(e) => setTextComment(e.target.value)}
                className="text-input"
              />
              <button type="submit" className="post-comment-btn">
                Ajouter un commentaire
              </button>
            </form>
          )}

          <div ref={commentListRef} className="comment-list">
            {comment.map((item) => (
              <Comment
                key={item.id}
                id={item.id}
                text={item.text}
                createDate={item.createDate}
                firstname={item.firstname}
                lastname={item.lastname}
                autorId={item.autorId}
                handleCommentUpdate={handleCommentUpdate}
              />
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}

export default IdeaContent;
