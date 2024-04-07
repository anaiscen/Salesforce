import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import UpdateProfile from "../components/Profil/UpdateProfile";
import Avatar from "../assets/avatar-default-icon.png";

function Profile() {
  const { user } = useUser();
  const [refreshfImage, setRefreshfImage] = useState(false);

  useEffect(() => {}, [refreshfImage]);

  return (
    <div>
      <div className="profileInformation">
        <div className="profile-image-container">
          {user.profilePicture ? (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/uploads/profile/${
                user.profilePicture
              }`}
              alt="Profil"
              className="profile-image"
            />
          ) : (
            <img src={Avatar} alt="Profil" className="profile-image" />
          )}
        </div>

        <UpdateProfile
          refreshImage={refreshfImage}
          setRefreshImage={setRefreshfImage}
        />
      </div>
    </div>
  );
}

export default Profile;
