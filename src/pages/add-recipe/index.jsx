import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

export default function AddRecipe() {
    const navigate = useNavigate();
    const { addRecipe } = useContext(GlobalContext);

    const [form, setForm] = useState({
        title: '',
        ingredients: '',
        instructions: ''
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // New state for image preview

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);

        if (selectedImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the data URL
            };
            reader.readAsDataURL(selectedImage); // Read the image as a data URL
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create a unique ID for the recipe
            const recipeId = uuidv4();

            // Create a new recipe object
            const newRecipe = {
                id: recipeId, // Use the generated ID
                title: form.title,
                ingredients: form.ingredients,
                instructions: form.instructions,
                image: imagePreview, // Use the data URL
            };

            // Get existing recipes from local storage
            const storedRecipes = localStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

            // Add the new recipe to the array
            recipes.push(newRecipe);

            // Save the updated recipes array back to local storage
            localStorage.setItem('recipes', JSON.stringify(recipes));

            // Add the recipe to the global context
            addRecipe(newRecipe);

            navigate("/home");

        } catch (error) {
            console.error("Error adding recipe:", error);
            alert("Failed to add recipe. Please check the console for details.");
        }
    };

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center p-6 font-[Poppins]">
            <div className="bg-gray-100 p-10 rounded-xl shadow-xl w-full max-w-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-center mb-6">Add a New Recipe</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                        type="text"
                        name="title"
                        placeholder="Recipe title"
                        value={form.title}
                        onChange={handleChange}
                        className="mb-4 w-full p-3 rounded-lg border border-gray-300"
                        required
                    />
                    <textarea
                        name="ingredients"
                        placeholder="Ingredients"
                        value={form.ingredients}
                        onChange={handleChange}
                        className="mb-4 w-full p-3 rounded-lg border border-gray-300"
                        rows="3"
                        required
                    />
                    <textarea
                        name="instructions"
                        placeholder="Instructions"
                        value={form.instructions}
                        onChange={handleChange}
                        className="mb-4 w-full p-3 rounded-lg border border-gray-300"
                        rows="4"
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mb-6 w-full p-3 rounded-lg border border-gray-300"
                    />

                    {/* Display the image preview */}
                    {imagePreview && (
                        <img src={imagePreview} alt="Image Preview" className="mb-4 w-32 h-32 object-cover rounded-full" />
                    )}

                    <button
                        type="submit"
                        className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition"
                    >
                        Save Recipe
                    </button>
                </form>
            </div>
        </div>
    );
}