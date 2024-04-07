import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useUser } from "../../contexts/UserContext";
import useApi from "../../services/useApi";

function AddTeam({ refreshListTeam, setRefreshListTeam }) {
  const api = useApi();
  const { user } = useUser();
  const [newTeam, setNewTeam] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [creationConfirmation, setCreationConfirmation] = useState(false);

  const toggleInput = () => {
    setInputVisible(!inputVisible);
  };

  const handleSetNewTeam = (e) => {
    setNewTeam(e.target.value);
  };

  const registerNewTeam = () => {
    const team = {
      companyId: user.companyId,
      name: newTeam,
    };
    api
      .post("/team", team)
      .then(() => {
        setCreationConfirmation(true);
        setNewTeam(""); // Réinitialiser la valeur du champ d'entrée
        setRefreshListTeam(!refreshListTeam);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (creationConfirmation) {
      const timer = setTimeout(() => {
        setCreationConfirmation(false);
        toggleInput();
      }, 1700);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [creationConfirmation]);

  return (
    <div className="team-container">
      {inputVisible ? (
        <button className="admin-team-btn" type="button" onClick={toggleInput}>
          Fermer
        </button>
      ) : (
        <button className="add-team" type="button" onClick={toggleInput}>
          Ajouter une équipe
        </button>
      )}

      {inputVisible ? (
        <div className="team">
          <label htmlFor="newTeam">Ajouter une nouvelle équipe</label>
          <input
            type="text"
            name="newTeam"
            id="newTeam"
            placeholder="Nom de la nouvelle équipe"
            onChange={handleSetNewTeam}
          />
          <button
            className="admin-team-btn"
            type="button"
            onClick={registerNewTeam}
          >
            Enregistrer
          </button>
        </div>
      ) : null}

      {creationConfirmation ? <p>Equipe créée</p> : ""}
    </div>
  );
}

AddTeam.propTypes = {
  refreshListTeam: PropTypes.bool.isRequired,
  setRefreshListTeam: PropTypes.func.isRequired,
};

export default AddTeam;
