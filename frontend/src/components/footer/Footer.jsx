import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

function Footer() {
  const user = useUser();
  const { companyId } = user.user;

  return (
    <div className="footer">
      <div className="footer__policies">
        <Link to="/politiqueCookies"> Politique en matière de cookies</Link>
        <Link to="/politiqueDeConfidentialité">
          Politique de confidentialité
        </Link>
        <Link to="/mentionsLegales">Mentions légales</Link>
        <Link to="/conditionsGénéralesUtilisation">
          Conditions générales d'utilisation
        </Link>
      </div>
      <div className="footer__nav">
        <h2 className="footer__nav__title">Navigation</h2>
        <Link to={`/register/${companyId}`}>Entreprise</Link>
        <Link to="/Idea">Idées</Link>
        <Link to="/Profil">Mon profil</Link>
      </div>
    </div>
  );
}

export default Footer;
