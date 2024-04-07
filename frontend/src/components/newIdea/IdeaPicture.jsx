import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useApi from "../../services/useApi";

function IdeaPicture({ onPictureSelect, selectedPictureId }) {
  const api = useApi();
  const [allPicture, setAllPicture] = useState([]);

  useEffect(() => {
    api
      .get(`/picture`)
      .then((resp) => {
        setAllPicture(resp.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  const handleSelectPicture = (pictureId) => {
    onPictureSelect(pictureId);
  };

  if (!selectedPictureId && allPicture.length > 0) {
    onPictureSelect(allPicture[0].id);
  }

  return (
    <section className="picture-idea-section">
      {allPicture.map((item) => (
        <button
          type="button"
          className="picture-idea-btn"
          onClick={() => handleSelectPicture(item.id)}
        >
          <img
            src={item.src}
            alt={item.alt}
            className={`picture-idea ${
              selectedPictureId === item.id ? "selected" : ""
            }`}
          />
        </button>
      ))}
    </section>
  );
}

IdeaPicture.propTypes = {
  onPictureSelect: PropTypes.func.isRequired,
  selectedPictureId: PropTypes.number.isRequired,
};

export default IdeaPicture;
