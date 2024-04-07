import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useApi from "../../services/useApi";

function EditTeam({ name, id, setIsEdited, setEdit, handleClickBack }) {
  const api = useApi();
  const [newName, setNewName] = useState(null);
  const [editConfirmation, setEditConfirmation] = useState(false);

  const handleSetNewTeam = (e) => {
    setNewName(e.target.value);
  };

  const changeTeamName = () => {
    if (newName) {
      const newTeam = {
        id,
        name: newName,
      };
      api
        .put(`/team/${id}`, newTeam)
        .then(() => {
          setEditConfirmation(true);
          setIsEdited(true);
          setEdit(false);
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    if (editConfirmation) {
      const timer = setTimeout(() => {
        setEditConfirmation(false);
      }, 1700);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [editConfirmation]);

  return (
    <div className="edit-team-container">
      {editConfirmation ? <p>L'équipe a bien été modifiée </p> : ""}
      <input type="text" placeholder={name} onChange={handleSetNewTeam} />

      <div className="update-team-container">
        <button
          className="admin-team-btn"
          type="button"
          onClick={changeTeamName}
        >
          Modifier
        </button>
        <button
          className="admin-team-btn"
          type="button"
          onClick={handleClickBack}
        >
          Retour
        </button>
      </div>
    </div>
  );
}

EditTeam.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  setIsEdited: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  handleClickBack: PropTypes.func.isRequired,
};

export default EditTeam;
