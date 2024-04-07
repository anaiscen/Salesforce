import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUser } from "../../contexts/UserContext";
import useApi from "../../services/useApi";
import IdeaPicture from "./IdeaPicture";

function NewIdea({ showNewIdea, setShowNewIdea }) {
  const api = useApi();
  const { user } = useUser();
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [dropDownOpen] = useState(true);
  const [errors, setErrors] = useState({});
  const [ideaPictureVisible, setIdeaPictureVisible] = useState(false);
  const [selectCategoryId, setSelectCategoryId] = useState("");
  const [selectedPictureId, setSelectedPictureId] = useState(1);
  const [textIdea, setTextIdea] = useState("");
  const [titleIdea, setTitleIdea] = useState("");

  useEffect(() => {
    api
      .get(`/categorys/${user.companyId}`)
      .then((resp) => {
        setCategory(resp.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  const handleSelectCategoryId = (categoryId) => {
    setSelectCategoryId(categoryId);
  };

  const handleSubmitNewIdea = async (e) => {
    e.preventDefault();
    const newIdea = {
      title: titleIdea,
      text: textIdea,
      userId: user.id,
      categoryId: selectCategoryId,
      pictureId: selectedPictureId,
      archived: 0,
    };

    const validationErrors = {};

    if (!titleIdea) {
      validationErrors.titleError = true;
    }
    if (!selectCategoryId) {
      validationErrors.categoryError = true;
    }
    if (!textIdea) {
      validationErrors.textError = true;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await api.post("/idea", newIdea);
      const newIdeaId = response.data.id;
      navigate(`/idea/${newIdeaId}`);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleToggleIdeaPicture = () => {
    setIdeaPictureVisible(!ideaPictureVisible);
  };

  const handlePictureSelect = (pictureId) => {
    setSelectedPictureId(pictureId);
    setIdeaPictureVisible(false);
  };

  const handleCancelNewIdea = () => {
    setShowNewIdea(!showNewIdea);
  };

  return (
    <section className="new-idea-section">
      <div className="new-idea-title-main">
        <h1>Nouvelle idée</h1>
      </div>

      <form onSubmit={handleSubmitNewIdea} className="form-newIdea">
        <div className="title-idea-div">
          <div className="idea-section-cat-div">
            <label className="title-edit" htmlFor="title-edit">
              Titre :{" "}
              <input
                className="title-input"
                type="text"
                value={titleIdea}
                onChange={(e) => setTitleIdea(e.target.value)}
              />
            </label>

            {errors.titleError && (
              <div className="error-message-new-idea">
                Veuillez écrire un titre
              </div>
            )}
          </div>

          <div className="idea-section-cat-div">
            {dropDownOpen && (
              <select
                className={`select-new-idea ${
                  errors.categoryError ? "error" : ""
                }`}
                value={selectCategoryId}
                onChange={(e) => handleSelectCategoryId(e.target.value)}
              >
                <option value="" className="option-select-new-idea">
                  Sélectionner une catégorie
                </option>
                {category.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    className="option-select-new-idea"
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            )}
            {errors.categoryError && (
              <div className="error-message-new-idea">
                Veuillez sélectionner une catégorie
              </div>
            )}
          </div>

          <button
            type="button"
            className="idea-section-btn"
            onClick={handleToggleIdeaPicture}
          >
            Ajouter une illustration
          </button>

          {ideaPictureVisible && (
            <div className="modal-overlay">
              <div className="modal-container">
                <IdeaPicture
                  onPictureSelect={handlePictureSelect}
                  selectedPictureId={selectedPictureId}
                />
              </div>
            </div>
          )}
        </div>

        <div className="idea-container">
          <h4>
            {user.firstname} {user.lastname}
          </h4>
          <textarea
            className={`content-idea ${errors.textError ? "error" : ""}`}
            type="text"
            placeholder="Écrivez votre idée ici..."
            value={textIdea}
            onChange={(e) => setTextIdea(e.target.value)}
          />
          <div className="post-idea">
            <button type="submit" className="post-idea-btn">
              Poster l'idée
            </button>
            <button
              type="button"
              className="post-idea-btn"
              onClick={handleCancelNewIdea}
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

NewIdea.propTypes = {
  showNewIdea: PropTypes.func.isRequired,
  setShowNewIdea: PropTypes.func.isRequired,
};

export default NewIdea;
