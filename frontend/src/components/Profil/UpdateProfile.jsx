import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MdAddAPhoto } from "react-icons/md";
import userRoles from "../../utils/userRoles";
import { useUser } from "../../contexts/UserContext";
import useApi from "../../services/useApi";
import updateImg from "../../assets/modify-icon.png";
import AddTeam from "../teamManager/AddTeam";
import BrowseTeams from "../teamManager/BrowseTeams";
import UserIdeaList from "./UserIdeaList";

function UpdateProfile({ refreshfImage, setRefreshfImage }) {
  const api = useApi();
  const [currentUser, setCurrentUser] = useState([]);
  const { user, setUser } = useUser();
  const [file, setFile] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [refreshListTeam, setRefreshListTeam] = useState(false);

  const handleImageUpload = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profileImage", file);

    api
      .post("/user/uploads", formData)
      .then((response) => {
        setUser({ ...user, profilePicture: response.data.profilePicture });
        setRefreshfImage(!refreshfImage);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    api
      .get(`/user/${user.id}`)
      .then((res) => {
        setCurrentUser(res.data);

        api
          .get(`/team/id/${res.data.teamId}`)
          .then((resTeam) => {
            setTeamName(resTeam.data.name);
          })
          .catch((err) => {
            console.warn(err);
          });
      })
      .catch((err) => {
        console.warn(err);
      });
  }, [api]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="information">
      <div className="name-role-updatePicture">
        <section className="name-info">
          <p className="name">
            {currentUser.firstname} {currentUser.lastname}
          </p>
        </section>

        <div className="information-only">
          <p className="profile-value-label-role">
            <span className="profile-label" />{" "}
            <span className="profile-value-role">{user.roleName}</span>
          </p>{" "}
          <div className="profile-info">
            <form
              encType="multipart/form-data"
              onSubmit={handleImageUpload}
              className="button-plus"
            >
              <label htmlFor="profileImage" className="upload-button">
                <MdAddAPhoto />
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="file-input"
                />
              </label>
              <button className="upload-profile-button" type="submit">
                Valider
              </button>
            </form>
          </div>
        </div>
      </div>

      <section className="profile-info-container">
        <div className="title-profile">
          <div className="edit-container">
            <h3 className="title-myProfil">Mon Profil</h3>
            <Link to={`/user/${user.id}`} className="listUserIconLink">
              <img
                src={updateImg}
                alt="Modifier"
                className="listUserIcon listUserIconUpdate"
              />
            </Link>
          </div>
          <div className="profile-information">
            <div className="profile-info">
              <p>
                <span className="profile-label">Email:</span>{" "}
                <span className="profile-value">{user.email}</span>{" "}
              </p>
            </div>
          </div>
          <div className="profile-info">
            <p>
              <span className="profile-label">Date de naissance:</span>{" "}
              <span className="profile-value">
                {formatDate(currentUser.dateOfBirth)}
              </span>
            </p>
          </div>
          <div className="profile-info">
            <p>
              <span className="profile-label">Équipe:</span>{" "}
              <span className="profile-value">{teamName}</span>
            </p>
          </div>
        </div>

        <div className="section-team">
          <h1>Gestion de profil</h1>
          <div className="button-team">
            {user.roleId === userRoles.ADMIN && (
              <div className="button-team">
                <AddTeam
                  updateTeamList={() => setRefreshListTeam(!refreshListTeam)}
                  refreshListTeam={refreshListTeam}
                  setRefreshListTeam={setRefreshListTeam}
                />
              </div>
            )}

            <BrowseTeams refreshListTeam={refreshListTeam} />
          </div>
        </div>
        <div className="title-profil-list-idea-container">
          <h2 className="title-profil-list-idea">Liste de mes idées</h2>
          <UserIdeaList />
        </div>
      </section>
    </div>
  );
}

UpdateProfile.propTypes = {
  refreshfImage: PropTypes.bool.isRequired,
  setRefreshfImage: PropTypes.bool.isRequired,
};

export default UpdateProfile;
