import React, { useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../services/useApi";

function ForgottenPassword() {
  const api = useApi();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmail = {
      email,
    };
    api
      .post(`/resetPassword`, newEmail)
      .then(() => {
        setSuccess(true);
        setError(false);
      })
      .catch((err) => {
        console.warn(err);
        setSuccess(false);
        setError(true);
      });
  };

  return (
    <div className="loginImg">
      <div className="logoImg">
        <img src="../../../src/assets/salesforce-logo.png" alt="logo" />
      </div>
      <div className="forgottenPasswordContainer">
        <p className="forgottenPasswordTitle">Réinitialiser le mot de passe</p>
        <p className="fpTexte">
          Vous avez oublié votre mot de passe ?<br /> Veuillez entrer votre
          adresse mail pour initier la réinitialisation.
        </p>
        {success ? (
          <section className="forgottenPasswordSection successMessageForgotenPassword">
            Email envoyé
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="forgottenPasswordForm">
            <label htmlFor="Email Recuperation" className="emailPasswordLabel">
              Email :
              <input
                type="email"
                className="inputForgottenPasswordForm inputNewForgottenPassword"
                value={email}
                onChange={handleEmailChange}
              />
            </label>
            {error && (
              <p className="wrongEmailMessage">Adresse email invalide</p>
            )}
            <button type="submit">Envoyer</button>
          </form>
        )}
        <Link to="/" className="homeLink">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default ForgottenPassword;
