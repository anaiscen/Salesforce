import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../../App.css";
import { useUser } from "../../contexts/UserContext";
import Logout from "../logout/Logout";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef();
  const user = useUser();
  const { companyId } = user.user;

  const showNavbar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeNavbar = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <nav ref={navRef} className={isMenuOpen ? "responsive_nav" : ""}>
        <li>
          <Link to={`/register/${companyId}`} onClick={closeNavbar}>
            Entreprise
          </Link>
        </li>

        <li>
          <Link to="/Idea" onClick={closeNavbar}>
            Idées
          </Link>
        </li>
        <li>
          <Link to="/Profil" onClick={closeNavbar}>
            Mon profil
          </Link>
        </li>
        <button
          type="button"
          className="nav-btn nav-close-btn"
          onClick={closeNavbar}
        >
          <FaTimes />
        </button>
      </nav>
      <button type="button" className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
      <div className="search-container">
        <input type="search" placeholder="Recherche" className="search" />
      </div>
      <Logout />
    </header>
  );
}

export default Navbar;
