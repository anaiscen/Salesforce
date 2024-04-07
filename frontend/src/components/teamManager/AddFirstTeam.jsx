import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useApi from "../../services/useApi";

function AddFirstTeam({ selectedCompanyId, setTeamAdded }) {
  const api = useApi();
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
      companyId: selectedCompanyId,
      name: newTeam,
    };
    api
      .post("/team", team)
      .then(() => {
        setCreationConfirmation(true);
        setTeamAdded(true);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (creationConfirmation) {
      const timer = setTimeout(() => {
        setCreationConfirmation(false);
      }, 1700);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [creationConfirmation]);

  return (
    <div className="addFTContainer">
      {inputVisible ? (
        <button
          type="button"
          onClick={toggleInput}
          className="addFTCloseButton"
        >
          Fermer
        </button>
      ) : (
        <button type="button" onClick={toggleInput} className="addFTFormButton">
          Ajouter une première équipe
        </button>
      )}
      {inputVisible ? (
        <div className="addFTFormInputContainer">
          <label htmlFor="newTeam" className="addFTFormLabel">
            Ajouter une nouvelle équipe :
          </label>
          <input
            type="text"
            name="newTeam"
            id="newTeam"
            placeholder="Nom de la nouvelle équipe"
            onChange={handleSetNewTeam}
            className="addFTFormInput"
          />
          <button
            type="button"
            onClick={registerNewTeam}
            className="addFTFormButton"
          >
            Enregistrer
          </button>
        </div>
      ) : null}
      {creationConfirmation ? (
        <p className="addFTFormConfirmation">Équipe créée</p>
      ) : (
        ""
      )}
    </div>
  );
}

AddFirstTeam.propTypes = {
  selectedCompanyId: PropTypes.func.isRequired,
  setTeamAdded: PropTypes.bool.isRequired,
};

export default AddFirstTeam;
