import React, { useState } from "react";
import PropTypes from "prop-types";
import editBtn from "../../assets/edit-button.png";
import deleteImg from "../../assets/bin-icon.png";
import useApi from "../../services/useApi";
import { useUser } from "../../contexts/UserContext";
import userRoles from "../../utils/userRoles";

function Categoy({
  category,
  onCategoryClick,
  onAddCategory,
  onUpdateCategoryName,
  onDeleteCategory,
}) {
  const { user } = useUser();
  const api = useApi();
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameCategory, setNameCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
  const [updateNameCategory, setUpdateNameCategory] = useState("");

  const handleAddCategory = () => {
    setAddingCategory(true);
  };

  const handleSubmitCategory = () => {
    onAddCategory(nameCategory);
    setAddingCategory(false);
    setNameCategory("");
  };

  const cancelEditing = () => {
    setSelectedCategoryId(null);
    isEditing(false);
  };

  const handleClickEditCat = (e) => {
    e.preventDefault();

    const updatedCategory = {
      id: selectedCategoryId,
      name: updateNameCategory,
    };

    if (user.roleId === userRoles.ADMIN) {
      api
        .put(`/category/${updatedCategory.id}`, updatedCategory)
        .then(() => {
          onUpdateCategoryName(updatedCategory.id, updatedCategory.name);
          cancelEditing();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleDeleteCat = () => {
    if (user.roleId === userRoles.ADMIN) {
      api
        .delete(`/category/${categoryToDeleteId}`)
        .then(() => {
          onDeleteCategory(categoryToDeleteId);
          setShowConfirmationDelete(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const confirmDelete = (categoryId) => {
    setCategoryToDeleteId(categoryId);
    setShowConfirmationDelete(true);
  };

  const sortedCategories = category.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="headerNavbar">
      <ul className="menu">
        {sortedCategories.map((item) => (
          <li key={item.id} className="menu-headerNavbar-li">
            {selectedCategoryId === item.id ? (
              <form
                onSubmit={handleClickEditCat}
                className="form-edit-category"
              >
                <input
                  className="form-edit-category-input"
                  type="text"
                  value={updateNameCategory}
                  onChange={(e) => setUpdateNameCategory(e.target.value)}
                />

                <div className="form-edit-category-container">
                  <button
                    className="form-edit-category-container-btn"
                    type="submit"
                    onSubmit={handleClickEditCat}
                  >
                    Modifier
                  </button>
                  <button
                    className="form-edit-category-container-btn"
                    type="submit"
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="category-container">
                <button
                  className="category-btn"
                  type="button"
                  onClick={() => {
                    onCategoryClick(item.id);
                  }}
                >
                  {item.name}
                </button>
                {user.roleId === userRoles.ADMIN && (
                  <div className="btn-category-admin">
                    <button
                      className="btn-category-edit"
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(item.id);
                        setUpdateNameCategory(item.name);
                      }}
                    >
                      <img
                        src={editBtn}
                        alt="Logo edition"
                        className="edit-img"
                      />
                    </button>
                    <button
                      className="btn-category-delete"
                      type="button"
                      onClick={() => {
                        confirmDelete(item.id);
                      }}
                    >
                      <img
                        src={deleteImg}
                        alt="Logo supprimer"
                        className="delete-img"
                      />
                    </button>
                    {showConfirmationDelete && (
                      <div className="deleteContainer">
                        <div className="deleteConfirmation">
                          <p className="deleteText">
                            Si vous supprimez cette catégorie, toutes les idées
                            liées à cette catégorie seront également supprimées,
                            qu'elles soient archivées ou non.
                            <br />
                            <br />
                            Voulez-vous vraiment supprimer la catégorie :{" "}
                            {item.name} ?
                          </p>
                          <div className="deleteConfirmationButtons">
                            <button
                              type="submit"
                              className="deleteConfirmationButton"
                              onClick={handleDeleteCat}
                            >
                              Oui
                            </button>
                            <button
                              type="submit"
                              className="deleteConfirmationButton"
                              onClick={() => setShowConfirmationDelete(false)}
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      {user.roleId === userRoles.ADMIN &&
        (addingCategory ? (
          <div className="add-category-container">
            <input
              className="add-category-container-input"
              type="text"
              value={nameCategory}
              onChange={(e) => setNameCategory(e.target.value)}
              placeholder="Nom de la catégorie"
            />
            <div className="add-category-container-container">
              <button
                className="add-category-container-btn"
                type="button"
                onClick={handleSubmitCategory}
              >
                Ajouter
              </button>
              <button
                className="add-category-container-btn"
                type="button"
                onClick={() => {
                  setAddingCategory(false);
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="add-category-container">
            <button
              className="add-category-container-btn"
              type="button"
              onClick={handleAddCategory}
            >
              Ajouter une catégorie
            </button>
          </div>
        ))}
    </div>
  );
}

Categoy.propTypes = {
  category: PropTypes.func.isRequired,
  onCategoryClick: PropTypes.func.isRequired,
  onAddCategory: PropTypes.func.isRequired,
  onUpdateCategoryName: PropTypes.func.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
};

export default Categoy;
