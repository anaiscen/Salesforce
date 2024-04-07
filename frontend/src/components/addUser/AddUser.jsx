import { useEffect, useState } from "react";
import useApi from "../../services/useApi";
import { useUser } from "../../contexts/UserContext";
import userRoles from "../../utils/userRoles";

function AddUser() {
  const { user } = useUser();
  const userRole = user?.roleId;
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [roleId, setRoleId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [success, setSuccess] = useState(false);
  const api = useApi();
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

  useEffect(() => {
    const result = PWD_REGEX.test(pass1);
    setValidPwd(result);
    const match = pass1 === pass2;
    setValidMatch(match);
  }, [pass1, pass2]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      firstname,
      lastname,
      email,
      dateOfBirth,
      password: pass1,
      roleId,
      teamId,
    };
    api
      .post("/user", newUser)
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  useEffect(() => {
    api
      .get(`/team/${user.companyId}`)
      .then((res) => {
        setTeams(res.data);
        setTeamId(res.data[0].id);
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
    userRole === userRoles.ADMIN && (
      <div className="addUserContainer">
        <h1>AJOUTER UN UTILISATEUR</h1>
        {success ? (
          <section className="addUserSection successMessage">
            Utilisateur crée
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="addUserForm">
            <label htmlFor="firstname" className="addUserFormLAbel">
              Prénom :
              <input
                type="text"
                className="addUserFormInput"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </label>
            <label htmlFor="name" className="addUserFormLAbel">
              Nom :
              <input
                type="text"
                className="addUserFormInput"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </label>
            <label htmlFor="email" className="addUserFormLAbel">
              Email :
              <input
                type="text"
                autoComplete="off"
                className="addUserFormInput"
                id="email"
                aria-describedby="uidnote"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label htmlFor="pass1" className="addUserFormLAbel">
              Mot de passe :
              <input
                type="password"
                className="addUserFormInput"
                id="pass1"
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
              />
              <span
                className={
                  validPwd || !pass1 ? "signup-hide" : "signup-invalid"
                }
              >
                Mot de passe invalide
              </span>
            </label>
            <label htmlFor="pass2" className="addUserFormLAbel">
              Confirmer le mot de passe :
              <input
                type="password"
                className="addUserFormInput"
                id="pass2"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
              />
              <span
                className={
                  validMatch || !pass2 ? "signup-hide" : "signup-invalid"
                }
              >
                Les mots de passes ne correspondent pas
              </span>
              <label htmlFor="dateOfBirth" className="addUserFormLAbel">
                Date de naissance:
                <input
                  type="date"
                  className="addUserFormInput"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </label>
            </label>
            <label htmlFor="role" className="addUserFormLAbel">
              Rôle :
              <select
                id="roleId"
                className="addUserFormInput"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <option value="">--Choisir un rôle--</option>
                <option value="2">Administrateur</option>
                <option value="3">Membre</option>
              </select>
            </label>
            <label htmlFor="teamId" className="addUserFormLabel">
              Équipe :
              <select
                id="teamId"
                className="addUserFormInput"
                value={teamId}
                onChange={(e) => {
                  setTeamId(e.target.value);
                }}
              >
                <option value="">--Choisir une équipe--</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="addUserFormButton">
              Ajouter
            </button>
          </form>
        )}
      </div>
    )
  );
}

export default AddUser;
