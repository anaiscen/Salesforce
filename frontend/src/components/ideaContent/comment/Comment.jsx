import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useApi from "../../../services/useApi";
import { useUser } from "../../../contexts/UserContext";
import deleteImg from "../../../assets/bin-icon.png";
import editBtn from "../../../assets/edit-button.png";
import CommentUpdate from "./CommentUpdate";
import userRoles from "../../../utils/userRoles";

function Comment({
  id,
  text,
  createDate,
  firstname,
  lastname,
  autorId,
  handleCommentUpdate,
}) {
  const api = useApi();
  const { user } = useUser();
  const commentRef = useRef(null);

  const [editContentComment, setEditContentComment] = useState(false);
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);

  const handleClickEdit = () => {
    if (user.id === autorId || user.roleId === 2) {
      setEditContentComment(!editContentComment);
    }
  };

  const handleClickDeleteComment = () => {
    if (user.roleId === userRoles.ADMIN) {
      api
        .delete(`/comment/${id}`)
        .then(() => {
          setShowConfirmationDelete(false);
          handleCommentUpdate();
        })
        .catch((err) => console.warn(err));
    }
  };

  useEffect(() => {
    // Scroll vers le dernier commentaire
    commentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const confirmArchive = () => {
    setShowConfirmationDelete(true);
  };

  return (
    <div ref={commentRef}>
      {editContentComment ? (
        <CommentUpdate
          id={id}
          text={text}
          handleClickEdit={handleClickEdit}
          handleCommentUpdate={handleCommentUpdate}
        />
      ) : (
        <div className="comment-container">
          <div className="head-title-content">
            <div className="autor-div">
              <h4 className="idea-autor-name">
                {firstname} {lastname}
              </h4>
              <h6 className="idea-date">
                {new Date(createDate).toLocaleString("fr-FR", {
                  timeZone: "UTC",
                })}
              </h6>
            </div>

            <div className="admin-btn">
              {(user.id === autorId || user.roleId === 2) && (
                <button
                  className="edit-btn-comment"
                  type="button"
                  onClick={handleClickEdit}
                >
                  <img src={editBtn} alt="Logo edit" className="edit-img" />
                </button>
              )}
              {user.roleId === userRoles.ADMIN && (
                <button
                  type="button"
                  className="edit-btn-comment"
                  onClick={confirmArchive}
                >
                  <img src={deleteImg} alt="Logo supprimer" />
                </button>
              )}
            </div>
          </div>

          {showConfirmationDelete && (
            <div className="deleteContainer">
              <div className="deleteConfirmation">
                <p className="p-delete-comment">
                  Voulez-vous vraiment supprimer ce commentaire ?
                </p>
                <div className="deleteConfirmationButtons">
                  <button
                    type="submit"
                    className="deleteConfirmationButton"
                    onClick={handleClickDeleteComment}
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

          <p className="text-comment">{text}</p>
        </div>
      )}
    </div>
  );
}

Comment.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  createDate: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  autorId: PropTypes.number.isRequired,
  handleCommentUpdate: PropTypes.func.isRequired,
};

export default Comment;
