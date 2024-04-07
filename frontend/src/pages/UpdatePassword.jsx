import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../services/useApi";

function UpdatePassword() {
  const api = useApi();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

  useEffect(() => {
    if (!token) {
      setWrongPassword(true);
    }
  }, [token]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setWrongPassword(true);
      return;
    }

    const isValidPwd = PWD_REGEX.test(password);
    if (!isValidPwd) {
      setWrongPassword(true);
      return;
    }

    const newPassword = {
      password,
      token,
    };

    api
      .post(`/setNewPassword`, newPassword)
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/`);
        }, 3000);
      })
      .catch((err) => {
        console.warn(err);
      });

    setWrongPassword(false);
  };

  return (
    <div className="loginImg">
      <div className="logoImg">
        <img src="../../../src/assets/salesforce-logo.png" alt="logo" />
      </div>
      <div className="updatePasswordContainer">
        <p className="updatePasswordTitle">Réinitialiser le mot de passe</p>
        {success ? (
          <section className="updatePasswordSection successMessageUpdatePassword">
            Mot de passe reinitialisé. Vous allez être redirigé(e) vers la page
            d'accueil.
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="updatePasswordForm">
            <input type="hidden" name="token" value={token} />
            <label htmlFor="password" className="newPasswordLabel">
              Nouveau mot de passe :
              <input
                type="password"
                className="inputNewPassword inputNewPasswordField"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label htmlFor="confirmPassword" className="newPasswordLabel">
              Confirmer le nouveau mot de passe :
              <input
                type="password"
                className="inputNewPassword inputNewPasswordField"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </label>
            {wrongPassword && (
              <p className="passwordMessage">
                Les mots de passe ne correspondent pas ou ne respectent pas les
                critères requis. <br /> Le mot de passe doit contenir au moins
                une lettre minuscule, une lettre majuscule, <br /> un chiffre,
                un caractère spécial et avoir une longueur de 8 à 24 caractères.
                <br />
              </p>
            )}
            <button type="submit">Réinitialiser le mot de passe</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdatePassword;
