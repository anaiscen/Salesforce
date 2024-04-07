import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useApi from "../../services/useApi";
import deleteImg from "../../assets/bin-icon.png";

function DeleteTeam({ id, setIsDeleted }) {
  const [isTeamDeleted, setIsTeamDeleted] = useState(false);
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
  const teamId = id;
  const api = useApi();

  const handleDeleteTeam = () => {
    api
      .delete(`team/${teamId}`)
      .then(() => {
        setIsTeamDeleted(true);
        setIsDeleted(true);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (isTeamDeleted) {
      const timer = setTimeout(() => {
        setIsTeamDeleted(false);
      }, 1700);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [isTeamDeleted]);

  const confirmDelete = () => {
    setShowConfirmationDelete(true);
  };

  return (
    <div className="team-delete">
      <button
        className="add-team-admin"
        type="button"
        onClick={() => confirmDelete()}
      >
        <img src={deleteImg} alt="Logo supprimer" className="delete-img-team" />
      </button>
      {isTeamDeleted ? <p>L'équipe a bien été supprimée</p> : ""}

      {showConfirmationDelete && (
        <div className="deleteContainer">
          <div className="deleteConfirmation">
            <p>Voulez-vous vraiment supprimer cette équipe ?</p>
            <div className="deleteConfirmationButtons">
              <button
                type="submit"
                className="deleteConfirmationButton"
                onClick={handleDeleteTeam}
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
    </div>
  );
}
DeleteTeam.propTypes = {
  id: PropTypes.number.isRequired,
  setIsDeleted: PropTypes.func.isRequired,
};
export default DeleteTeam;
