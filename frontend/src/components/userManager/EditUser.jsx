import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../services/useApi";
import { useUser } from "../../contexts/UserContext";
import userRoles from "../../utils/userRoles";

function UserEdit() {
  const [updatedUser, setUpdatedUser] = useState([]);
  const api = useApi();
  const { user } = useUser();
  const { id } = useParams();
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    api
      .put(`/user/${updatedUser.id}`, updatedUser)
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    api
      .get(`/user/${id}`)
      .then((res) => {
        setUpdatedUser(res.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, [api, id]);

  useEffect(() => {
    api
      .get(`/team/${user.companyId}`)
      .then((res) => {
        setTeams(res.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);
  useEffect(() => {
    const defaultTeamId = "defaultTeamId";
    setTeamId(defaultTeamId);
  }, []);

  return (
    <div className="editUserBlock">
      <h1>MODIFIER UTILISATEUR</h1>
      <div className="editUserContainer">
        {success ? (
          <section className="editUserSection successMessage">
            Utilisateur mis à jour
          </section>
        ) : (
          <form className="editUserForm" onSubmit={handleUpdate}>
            <label htmlFor="firstname" className="editUserFormLabel">
              Prénom:
              <input
                type="text"
                className="editUserFormInput"
                name="firstname"
                value={updatedUser.firstname}
                onChange={handleInputChange}
              />
            </label>
            <label htmlFor="lastname" className="editUserFormLabel">
              Nom:
              <input
                type="text"
                className="editUserFormInput"
                name="lastname"
                value={updatedUser.lastname}
                onChange={handleInputChange}
              />
            </label>
            <label htmlFor="email" className="editUserFormLabel">
              Email:
              <input
                type="text"
                className="editUserFormInput"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
              />
            </label>
            <label htmlFor="dateOfBirth" className="editUserFormLabel">
              Date de naissance:
              <input
                type="date"
                className="editUserFormInput"
                name="dateOfBirth"
                value={updatedUser.dateOfBirth}
                onChange={handleInputChange}
              />
            </label>
            <label htmlFor="teamId" className="addUserFormLabel">
              Équipe :
              <select
                id="teamId"
                className="addUserFormInput"
                name="teamId"
                value={updatedUser.teamId || teamId}
                onChange={handleInputChange}
              >
                <option value="">--Choisir une équipe--</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            {user.roleId === userRoles.SALESFORCE ||
            user.roleId === userRoles.ADMIN ? (
              <label htmlFor="roleId" className="editFormLabel">
                Rôle:
                <select
                  type="text"
                  className="editUserFormInput"
                  name="roleId"
                  value={updatedUser.roleId}
                  onChange={handleInputChange}
                >
                  <option value="">--Choisir un rôle--</option>
                  <option value="2">Administrateur</option>
                  <option value="3">Utilisateur</option>
                </select>
              </label>
            ) : null}
            <button
              className="editUserButton"
              type="submit"
              onClick={() => handleUpdate(updatedUser)}
            >
              Modifier
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserEdit;
