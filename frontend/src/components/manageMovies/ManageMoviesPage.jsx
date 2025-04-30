import React, { useState, useEffect } from "react";
import "./ManageMoviesPage.css";
import api from "../../api/axiosConfig";
import MovieForm from "./movieForm/MovieForm";
import MovieList from "./movieList/MovieList";
import ToastNotification from "./toastNotification/ToastNotification";

const ManageMoviesPage = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        imdbId: "",
        title: "",
        description: "",
        duration: "",
        directors: [""],
        writers: [""],
        stars: [""],
        releaseDate: "",
        trailerLink: "",
        genres: [""],
        poster: "",
        backdrops: [""],
    });
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        variant: "success",
    });

    const showToast = (message, variant = "success") => {
        setToast({ show: true, message, variant });
        setTimeout(() => {
            setToast({ show: false, message: "", variant });
        }, 3000);
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, movies]);

    const fetchMovies = async () => {
        try {
            const res = await api.get("/movies");
            setMovies(res.data);
            setFilteredMovies(res.data);
        } catch (err) {
            console.error("Error fetching movies:", err);
            showToast("Error fetching movies", "danger");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index, value, field) => {
        const updatedArray = [...formData[field]];
        updatedArray[index] = value;
        setFormData((prev) => ({ ...prev, [field]: updatedArray }));
    };

    const addArrayField = (field) => {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeArrayField = (index, field) => {
        const updatedArray = formData[field].filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, [field]: updatedArray }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/movies/${formData.imdbId}`, formData);
                showToast("Movie updated successfully");
            } else {
                await api.post("/movies", formData);
                showToast("Movie created successfully");
            }
            resetForm();
            fetchMovies();
        } catch (err) {
            console.error("Error saving movie:", err);
            if (err.response?.status === 409) {
                showToast(err.response.data, "warning");
            } else {
                showToast("Error saving movie", "danger");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            imdbId: "",
            title: "",
            description: "",
            duration: "",
            directors: [""],
            writers: [""],
            stars: [""],
            releaseDate: "",
            trailerLink: "",
            genres: [""],
            poster: "",
            backdrops: [""],
        });
        setIsEditing(false);
    };

    const handleEdit = (movie) => {
        setFormData({
            ...movie,
            directors: movie.directors || [""],
            writers: movie.writers || [""],
            stars: movie.stars || [""],
            backdrops: movie.backdrops || [""],
            genres: movie.genres || [""]
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/movies/${id}`);
            showToast("Movie deleted successfully");
            
            if (isEditing && formData.imdbId === id) {
                resetForm();
            }
            
            fetchMovies();
        } catch (err) {
            console.error("Error deleting movie:", err);
            showToast("Error deleting movie", "danger");
        }
    };

    return (
        <div className="manage-container">
            <h2 className="manage-header">Manage Movies</h2>
            
            <ToastNotification toast={toast} setToast={setToast} />
            
            <div className="manage-content">
                <MovieForm 
                    formData={formData}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                    handleArrayChange={handleArrayChange}
                    addArrayField={addArrayField}
                    removeArrayField={removeArrayField}
                    handleSubmit={handleSubmit}
                />
                
                <MovieList 
                    filteredMovies={filteredMovies}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default ManageMoviesPage;
