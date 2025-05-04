import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Details() {
  const { id } = useParams();
  const {
    recipeDetailsData,
    setRecipeDetailsData,
    favoritesList,
    handleAddToFavorite,
  } = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getRecipeDetails() {
      try {
        // Get recipes from local storage
        const storedRecipes = localStorage.getItem('recipes');
        const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

        // Find the recipe with the matching ID in local storage
        let recipe = recipes.find(recipe => recipe.id === id);

        if (recipe) {
          // If recipe is found in local storage, use it
          setRecipeDetailsData({ recipe, source: 'local' }); // Add a source to identify where the data came from
        } else {
          // If recipe is not found in local storage, fetch from API
          const response = await fetch(
            `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
          );
          const data = await response.json();

          if (data?.data?.recipe) {
            setRecipeDetailsData({ recipe: data.data.recipe, source: 'api' }); // Add a source to identify where the data came from
          } else {
            setError("Aucune donnée trouvée.");
          }
        }
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    }

    getRecipeDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="row-start-2 lg:row-start-auto">
        <div className="h-96 overflow-hidden rounded-xl group">
          <img
            src={
              recipeDetailsData?.source === 'api'
                ? recipeDetailsData?.recipe?.image_url
                : recipeDetailsData?.recipe?.image
            }
            alt={recipeDetailsData?.recipe?.title}
            className="w-full h-full object-cover block group-hover:scale-105 duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm text-cyan-700 font-medium">
          {recipeDetailsData?.recipe?.publisher}
        </span>
        <h3 className="font-bold text-2xl truncate text-black">
          {recipeDetailsData?.recipe?.title}
        </h3>

        <div>
          <button
            onClick={() => handleAddToFavorite(recipeDetailsData?.recipe)}
            className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
          >
            {favoritesList &&
              favoritesList.findIndex(
                (item) => item.id === recipeDetailsData?.recipe?.id
              ) !== -1
              ? "Remove from favorites"
              : "Add to favorites"}
          </button>
        </div>

        <div>
          <span className="text-2xl font-semibold text-black">
            Ingredients:
          </span>
          <ul className="flex flex-col gap-3 mt-2">
            {/* Check if ingredients is an array before mapping */}
            {Array.isArray(recipeDetailsData?.recipe?.ingredients) ? (
              recipeDetailsData?.recipe?.ingredients?.map((ingredient, index) => (
                <li key={index} className="text-black text-lg">
                  <span className="font-semibold">
                    {ingredient.quantity || ""} {ingredient.unit || ""}
                  </span>{" "}
                  - {ingredient.description}
                </li>
              ))
            ) : (
              <li className="text-black text-lg">
                {recipeDetailsData?.recipe?.ingredients}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}