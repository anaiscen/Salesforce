import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUser } from "../../contexts/UserContext";
import useApi from "../../services/useApi";

function Login({ handleLogin }) {
  const api = useApi();
  const { setUser } = useUser();
  const navigate = useNavigate();
  const refEmail = useRef();
  const refPass = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const mail = refEmail.current.value;
    const pass = refPass.current.value;
    const user = {
      email: mail,
      password: pass,
    };
    api
      .post("/login", user)
      .then((resp) => {
        const { token } = resp.data;
        api.defaults.headers.authorization = `Bearer ${token}`;
        setUser(resp.data.user);
        handleLogin();
        navigate(`/register/${resp.data.user.companyId}`);
      })
      .catch((err) => {
        console.warn(err);
        let errorMsg = "";
        switch (err?.response?.status) {
          case 401:
            errorMsg = "Vous n'êtes pas autorisé à vous connecter";
            break;
          case 404:
            errorMsg = "Utilisateur inexistant";
            break;
          case 422:
            errorMsg = "Erreur dans les données fournies";
            break;
          default:
            errorMsg = "Erreur serveur";
        }
        // eslint-disable-next-line no-alert
        alert(errorMsg);
      });
  };

  return (
    <div className="loginImg">
      <div className="logoImg">
        <img src="../../../src/assets/salesforce-logo.png" alt="logo" />
      </div>
      <div className="loginFormContainer">
        <p className="loginTitle">Connexion</p>
        <form onSubmit={handleSubmit} className="loginForm">
          <label htmlFor="login" className="loginLabel">
            Email :
            <input type="text" className="inputLoginForm" ref={refEmail} />
          </label>
          <label htmlFor="password" className="loginLabel">
            Mot de passe :
            <input type="password" className="inputLoginForm" ref={refPass} />
          </label>
          <div>
            <Link to="/resetPassword">Mot de passe oublié?</Link>
          </div>
          <button type="submit">Connexion</button>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default Login;
