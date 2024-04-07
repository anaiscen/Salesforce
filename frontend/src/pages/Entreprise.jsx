import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { IoMdOpen } from "react-icons/io";
import { useUser } from "../contexts/UserContext";
import ListUser from "../components/userManager/ListUser";
import useApi from "../services/useApi";

function Entreprise() {
  const api = useApi();
  const user = useUser();
  const companyId = useParams().id;
  const [company, setCompany] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [nSiret, setNSiret] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFormModified, setIsFormModified] = useState(false);
  const { roleId } = user.user;
  const isAdmin = roleId === 1 || roleId === 2;
  const isAdminSalesforce = roleId === 1;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    api
      .get(`/register/${companyId}`)
      .then((result) => {
        setCompany(result.data);
        setCompanyName(result.data.companyName);
        setNSiret(result.data.nSiret);
        setContactPerson(result.data.contactPerson);
        setEmail(result.data.email);
        setPhone(result.data.phone);
      })
      .catch((err) => console.error(err));
  }, []);

  function toggleEdit() {
    setIsEditing(!isEditing);
  }

  const handleSubmitUpdateCompany = (e) => {
    e.preventDefault();
    const newCompany = {
      companyName,
      nSiret,
      contactPerson,
      email,
      phone,
      creationDate: company.creationDate,
    };
    api
      .put(`/register/${companyId}`, newCompany)
      .then(() => {
        setShowConfirmation(true);
      })
      .catch((err) => console.warn(err));
    setCompany(newCompany);
    setIsEditing(false);
  };

  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 1200);

      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [showConfirmation]);

  return (
    <div className="company">
      {showConfirmation && (
        <div className="confirmation-message">Modifications enregistrées</div>
      )}
      {isEditing ? (
        <div className="updateForm__container form ">
          <form
            method="post"
            name="add-company-form"
            onSubmit={handleSubmitUpdateCompany}
            className="form"
          >
            <label htmlFor="name" className="form__label">
              Nom entreprise
            </label>
            <input
              type="text"
              placeholder=" Nom entreprise"
              name="companyName"
              id="companyName"
              className="form__input"
              required
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setIsFormModified(true);
              }}
            />
            <label htmlFor="siret" className="form__label">
              SIRET
            </label>
            <input
              type="text"
              name="nSiret"
              id="nSiret"
              required
              placeholder=" SIRET"
              className="form__input"
              value={nSiret}
              onChange={(e) => {
                setNSiret(e.target.value);
                setIsFormModified(true);
              }}
            />
            <label htmlFor="contactPerson" className="form__label">
              Personne de contact
            </label>
            <input
              type="text"
              name="contactPerson"
              id="contactPerson"
              required
              className="form__input"
              placeholder="Nom de la personne de contact"
              value={contactPerson}
              onChange={(e) => {
                setContactPerson(e.target.value);
                setIsFormModified(true);
              }}
            />
            <label htmlFor="companyLogo" className="form__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Email"
              className="form__input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsFormModified(true);
              }}
            />
            <label htmlFor="companyLogo" className="form__label">
              Téléphone
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="companyLogo"
              placeholder="Téléphone"
              required
              className="form__input"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsFormModified(true);
              }}
            />
            {isFormModified ? (
              <input type="submit" value="Modifier" className="form__submit" />
            ) : (
              ""
            )}
          </form>
          <button type="button" onClick={toggleEdit} className="form__submit">
            Retour
          </button>
        </div>
      ) : (
        <div className="company__global-container">
          <h1 className="company__pageTitle">{company.companyName}</h1>
          <div className="company__infos__title__container">
            <div className="company__container--without-title">
              <section className="company__infos__buttons">
                <h2>Informations entreprise : </h2>

                <div className="company__infos">
                  <p className="company__item">
                    <span className="company__item--underline">
                      Personne de contact :
                    </span>
                    {company.contactPerson}
                  </p>
                  <p className="company__item">
                    <span className="company__item--underline">
                      {" "}
                      Adresse e-mail :
                    </span>
                    {company.email}
                  </p>
                  <p className="company__item">
                    <span className="company__item--underline">
                      {" "}
                      Téléphone :{" "}
                    </span>
                    {company.phone}
                  </p>
                  <p className="company__item">
                    <span className="company__item--underline">
                      Date de création
                    </span>
                    {formatDate(company.creationDate)}
                  </p>
                  {company.companyLogo ? (
                    <p>Logo: company.companyLogo </p>
                  ) : null}
                  {isAdmin ? (
                    <div className="company__buttons--admin">
                      <button
                        type="button"
                        className="company__update"
                        onClick={toggleEdit}
                      >
                        Modifier
                        <IoMdOpen className="company__update-icon" />
                      </button>
                      <Link to="/user/add">
                        <button
                          type="button"
                          className="company__addUser__button"
                        >
                          Ajouter un utilisateur
                        </button>
                      </Link>
                    </div>
                  ) : null}
                </div>
                <div className="buttons-container">
                  <Link to="/idea" state={{ showArchivedIdeas: true }}>
                    <button type="button" className="buttons-container-item">
                      Idées archivées
                    </button>
                  </Link>
                  {isAdminSalesforce ? (
                    <div className="buttons-admin__container">
                      <Link to="/register">
                        <button
                          type="button"
                          className="buttons-container-item"
                        >
                          Ajouter une entreprise
                        </button>
                      </Link>
                      <Link to="/addFirstUser">
                        <button
                          type="button"
                          className="buttons-container-item"
                        >
                          Ajouter un first user
                        </button>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </section>
              <div className="company__users">
                <h2>Employés inscrits</h2>
                <ListUser companyId={companyId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Entreprise;
