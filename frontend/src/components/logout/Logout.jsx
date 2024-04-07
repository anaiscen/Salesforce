import { useUser } from "../../contexts/UserContext";
import useApi from "../../services/useApi";

function Logout() {
  const { setUser } = useUser();
  const api = useApi();

  const handleLogout = () => {
    api.defaults.headers.authorization = `Bearer ${""}`;
    setUser(null);
    window.location.reload(false);
  };

  return (
    <div className="logoutButton">
      <button type="submit" onClick={handleLogout}>
        Déconnexion
      </button>
    </div>
  );
}

export default Logout;
