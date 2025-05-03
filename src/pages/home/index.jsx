import { useContext } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import de useNavigate
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-item";
import Navbar from "../../components/navbar";

export default function Home() {
  const { recipeList, loading } = useContext(GlobalContext);
  const navigate = useNavigate(); // 👈 initialisation du hook

  const handleAddRecipe = () => {
    navigate("/addrecipe"); // 👈 redirection vers le formulaire
  };

  return (
    <div className="min-h-screen bg-white text-black font-[Poppins]">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="bg-gray-100 p-8 rounded-xl shadow-xl w-full max-w-5xl border border-gray-200">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Your Recipes
          </h2>

          {/* 🟢 Bouton pour ajouter une recette */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleAddRecipe}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow"
            >
              Add a Recipe
            </button>
          </div>

          {loading ? (
            <div className="text-center text-teal-500 text-lg font-medium">
              Loading... Please wait!
            </div>
          ) : recipeList && recipeList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipeList.map((item, index) => (
                <RecipeItem key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 text-lg font-medium">
              Nothing to display. Please search something.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
