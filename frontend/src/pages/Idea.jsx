import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import useApi from "../services/useApi";
import IdeaList from "../components/ideaContent/IdeaList";
import Categoy from "../components/category/Category";
import userRoles from "../utils/userRoles";

function Idea() {
  const api = useApi();
  const { user } = useUser();
  const [idea, setIdea] = useState([]);
  const [valide, setValide] = useState(false);
  const [category, setCategory] = useState([]);
  const [selectCategoryId, setSelectCategoryId] = useState(null);

  const handleAddCategory = (nameCategory) => {
    const newCategory = {
      name: nameCategory,
      companyCategoryId: user.companyId,
    };

    api
      .post("/category", newCategory)
      .then(() => {
        setCategory([...category, newCategory]);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

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

  useEffect(() => {
    const getIdeas = async () => {
      try {
        const resp = await api.get(`/ideas/${user.companyId}`);

        let filterIdeas = resp.data;

        if (selectCategoryId) {
          filterIdeas = filterIdeas.filter(
            (item) => item.categoryId === selectCategoryId
          );
        }

        setIdea(filterIdeas);
        setValide(true);
      } catch (err) {
        console.error(err);
      }
    };

    getIdeas();
  }, [selectCategoryId]);

  useEffect(() => {
    const getCategoryIdeas = async () => {
      try {
        const resp = await api.get(`/idea`);

        setIdea(resp.data);
        setValide(true);
      } catch (err) {
        console.error(err);
      }
    };

    getCategoryIdeas();
  }, [category]);

  const handleCategoryClick = (categoryId) => {
    setSelectCategoryId(categoryId);
  };

  const updateCategoryName = (categoryId, newName) => {
    if (user.roleId === userRoles.ADMIN) {
      const updatedCategories = category.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            name: newName,
          };
        }
        return cat;
      });

      setCategory(updatedCategories);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (user.roleId === userRoles.ADMIN) {
      const updatedCategories = category.filter((cat) => cat.id !== categoryId);
      setCategory(updatedCategories);
    }
    const updatedIdeas = idea.filter((item) => item.categoryId !== categoryId);
    setIdea(updatedIdeas);
  };

  return (
    <div className="idea-global-content">
      <Categoy
        category={category}
        onCategoryClick={handleCategoryClick}
        onAddCategory={handleAddCategory}
        onUpdateCategoryName={updateCategoryName}
        onDeleteCategory={handleDeleteCategory}
      />
      <IdeaList ideas={idea} setIdeas={setIdea} valide={valide} />
    </div>
  );
}

export default Idea;
