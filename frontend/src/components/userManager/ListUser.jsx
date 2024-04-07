import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../services/useApi";
import updateImg from "../../assets/modify-icon.png";
import deleteImg from "../../assets/bin-icon.png";
import userRoles from "../../utils/userRoles";
import { useUser } from "../../contexts/UserContext";
import Avatar from "../../assets/avatar-default-icon.png";

// eslint-disable-next-line react/prop-types
function ListUser({ companyId }) {
  const [users, setUsers] = useState([]);
  const { user } = useUser();
  const [updatedUser, setUpdatedUser] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const api = useApi();
  const changedRoleId = 4;

  const handleUpdate = (userId) => {
    const roleToUpdate = {
      ...updatedUser,
      roleId: changedRoleId,
    };
    api
      .put(`/user/role/${userId}`, roleToUpdate)
      .then(() => {
        setUsers(users.filter((user1) => user1.id !== userId));
        setUserToDelete(null);
        setShowConfirmation(false);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const selectUserForUpdate = (user1) => {
    setUpdatedUser(user1);
  };

  const confirmDelete = (user1) => {
    setUserToDelete(user1);
    setShowConfirmation(true);
  };

  useEffect(() => {
    api
      .get(`/user/company/${companyId}`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  return (
    <div className="listUserContainer">
      <div className="listUserCard">
        <div className="listUserRow">
          {users.map((user1) => (
            <div key={user1.id} className="listUserCards">
              <div className="listUserCardImageContainer">
                {user1.profilePicture && (
                  <img
                    className="listUserCardImage"
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/profile/${
                      user1.profilePicture
                    }`}
                    alt="ProfilePic"
                  />
                )}
                {!user1.profilePicture && (
                  <img
                    className="listUserCardImage"
                    src={Avatar}
                    alt="ProfilePic"
                  />
                )}
              </div>
              <div className="listUserCardDetails">
                <div className="listUserCardName">
                  {user1.firstname} {user1.lastname}
                </div>
                {user.roleId === userRoles.SALESFORCE ||
                user.roleId === userRoles.ADMIN ? (
                  <div className="listUserCardButtons">
                    <Link
                      to={`/user/${user1.id}`}
                      onClick={() => selectUserForUpdate(user1)}
                      className="listUserIconLink"
                    >
                      <img
                        src={updateImg}
                        alt="Modifier"
                        className="listUserIcon listUserIconUpdate"
                      />
                    </Link>
                    <button
                      className="listUserDeleteButton"
                      type="button"
                      onClick={() => confirmDelete(user1)}
                    >
                      <img
                        src={deleteImg}
                        alt="Supprimer"
                        className="listUserIcon listUserIconDelete"
                      />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showConfirmation && (
        <div className="deleteContainer">
          <div className="deleteConfirmation">
            <p>
              Voulez-vous vraiment supprimer l'utilisateur{" "}
              {userToDelete.firstname} {userToDelete.lastname} ?
            </p>
            <div className="deleteConfirmationButtons">
              <button
                type="submit"
                className="deleteConfirmationButton"
                value={updatedUser.roleId}
                onClick={() => handleUpdate(userToDelete.id)}
              >
                Oui
              </button>
              <button
                type="submit"
                className="deleteConfirmationButton"
                onClick={() => setShowConfirmation(false)}
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

export default ListUser;
