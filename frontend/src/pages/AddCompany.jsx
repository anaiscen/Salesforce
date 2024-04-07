import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../services/useApi";

function AddCompany() {
  const api = useApi();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [nSiret, setNSiret] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmitRegisterCompany = (e) => {
    e.preventDefault();
    const newCompany = {
      companyName,
      nSiret,
      contactPerson,
      email,
      phone,
    };

    api
      .post("/register", newCompany)
      .then(() => {
        navigate(`/addFirstUser`);
      })
      .catch((err) => console.warn(err));
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmitRegisterCompany}
      name="add-company-form"
    >
      <fieldset className="form">
        <legend className="form__legend">Informations entreprise : </legend>
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
          onChange={(e) => setCompanyName(e.target.value)}
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
          onChange={(e) => setNSiret(e.target.value)}
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
          onChange={(e) => setContactPerson(e.target.value)}
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
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="companyLogo" className="form__label">
          Téléphone
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phone"
          placeholder="Téléphone"
          required
          className="form__input"
          onChange={(e) => setPhone(e.target.value)}
        />
        <input type="submit" value="Envoyer" className="form__submit" />
      </fieldset>
    </form>
  );
}

export default AddCompany;
