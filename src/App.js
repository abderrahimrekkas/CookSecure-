import logo from "./logo.svg"; 
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/index"; 
import Home from "./pages/home/index";
import Favorites from "./pages/favorites/index";
import Details from "./pages/details/index";
import Login from "./components/login/index";
import Register from "./components/register/index";
import AddRecipe from "./pages/add-recipe/index";

function App() {
    return (
        <div>
            <div className="min-h-screen p-6 bg-white text-gray-600 text-lg">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Register />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/recipe-item/:id" element={<Details />} />
                    <Route path="/addrecipe" element={<AddRecipe />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;