import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context';

export default function AddRecipe() {
    const navigate = useNavigate();
    const { addToFavorites } = useContext(GlobalContext);

    const [form, setForm] = useState({
        title: '',
        ingredients: '',
        instructions: ''
    });

    const [image, setImage] = useState(null);  //Ajout pour le fichier image

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); //  Capture le fichier sélectionné
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("ingredients", form.ingredients);
            formData.append("instructions", form.instructions);
            if (image) {
                formData.append("image", image); //  Ajoute l'image au FormData
            }

            const res = await fetch("http://localhost:4000/recipes", {
                method: "POST",
                body: formData //  pas besoin de JSON.stringify ici
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to add recipe: ${res.status} - ${errorText}`);
            }

            const newRecipe = await res.json();
            addToFavorites(newRecipe);

            navigate("/favorites"); //  corrige la route si elle est mal orthographiée
        } catch (error) {
            console.error(error.message);
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