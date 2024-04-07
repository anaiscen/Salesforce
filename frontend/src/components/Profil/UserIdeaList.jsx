import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useApi from "../../services/useApi";
import { useUser } from "../../contexts/UserContext";

function UserIdeaList() {
  const api = useApi();
  const { user } = useUser();
  const [idea, setIdea] = useState([]);

  useEffect(() => {
    api
      .get(`/useridea/${user.id}`)
      .then((resp) => {
        setIdea(resp.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  return (
    <div>
      {idea.map((item) => (
        <Link className="idea-list-content__link" to={`/idea/${item.id}`}>
          <img
            src={item.src}
            alt={item.alt}
            className="idea-list-content__img-idea"
          />
          <button className="idea-list-content__btn" type="button">
            {item.title}
          </button>
        </Link>
      ))}
    </div>
  );
}

export default UserIdeaList;
