import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useUser } from "../../contexts/UserContext";
import useApi from "../../services/useApi";
import DeleteTeam from "./DeleteTeam";
import EditTeam from "./EditTeam";
import editBtn from "../../assets/edit-button.png";
import userRoles from "../../utils/userRoles";

function BrowseTeams({ refreshListTeam }) {
  const api = useApi();
  const [teamList, setTeamList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [isDeleted, setIsdeleted] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    api
      .get(`/team/${user.companyId}`)
      .then((response) => {
        const sortedTeams = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setTeamList(sortedTeams);
      })
      .catch((err) => console.error(err));
  }, [isDeleted, isEdited, refreshListTeam]);

  const handleClickSetEdit = (team) => {
    setEdit(true);
    setEditTeam(team);
  };

  const handleClickBack = () => {
    setEdit(false);
    setEditTeam(null);
  };

  return (
    <div className="test">
      {edit && editTeam ? (
        <div>
          <EditTeam
            name={editTeam.name}
            id={editTeam.id}
            setIsEdited={setIsEdited}
            setEdit={setEdit}
            handleClickBack={handleClickBack}
          />
        </div>
      ) : (
        teamList.map((team) => (
          <div key={team.id} className="team__container">
            <p className="team-added">{team.name}</p>
            {user.roleId === userRoles.ADMIN && (
              <div className="team-modification">
                <button
                  className="add-team-admin"
                  type="button"
                  onClick={() => handleClickSetEdit(team)}
                >
                  <img
                    src={editBtn}
                    alt="Logo edition"
                    className="edit-img-team"
                  />
                </button>
                <DeleteTeam id={team.id} setIsDeleted={setIsdeleted} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

BrowseTeams.propTypes = {
  refreshListTeam: PropTypes.bool.isRequired,
};

export default BrowseTeams;
