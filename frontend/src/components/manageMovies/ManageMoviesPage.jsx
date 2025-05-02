import React, { useState, useEffect } from "react";
import "./ManageMoviesPage.css";
import api from "../../api/axiosConfig";
import MovieForm from "./movieForm/MovieForm";
import MovieList from "./movieList/MovieList";
import ToastNotification from "./toastNotification/ToastNotification";

// Main component for managing movies (CRUD operations)
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
    const [isLoading, setIsLoading] = useState(false);
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

    // Fetches movies from API when component mounts
    useEffect(() => {
        fetchMovies();
    }, []);

    // Filters movies based on search term whenever searchTerm or movies change
    useEffect(() => {
        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, movies]);

    // Fetches all movies from the API
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

    // Handles changes to regular input fields in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handles changes to array-type fields (directors, writers, etc.)
    const handleArrayChange = (index, value, field) => {
        const updatedArray = [...formData[field]];
        updatedArray[index] = value;
        setFormData((prev) => ({ ...prev, [field]: updatedArray }));
    };

    // Adds a new empty field to an array-type field
    const addArrayField = (field) => {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    // Removes a field from an array-type field
    const removeArrayField = (index, field) => {
        const updatedArray = formData[field].filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, [field]: updatedArray }));
    };

    // Handles form submission for both creating and updating movies
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditing) {
                await api.put(`/movies/${formData.imdbId}`, formData);
                showToast("Movie updated successfully");
            } else {
                await api.post("/movies", formData);
                showToast("Movie created successfully");
            }
            resetForm();
            await fetchMovies();
        } catch (err) {
            console.error("Error saving movie:", err);
            if (err.response?.status === 409) {
                showToast(err.response.data, "warning");
            } else {
                showToast("Error saving movie", "danger");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Resets the form to its initial empty state
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

    // Prepares the form for editing an existing movie
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

    // Deletes a movie from the database
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

            {/* Toast notification component */}
            <ToastNotification toast={toast} setToast={setToast} />

            <div className="manage-content">
                {/* Movie form component for adding/editing movies */}
                <MovieForm
                    formData={formData}
                    isEditing={isEditing}
                    isLoading={isLoading}
                    handleInputChange={handleInputChange}
                    handleArrayChange={handleArrayChange}
                    addArrayField={addArrayField}
                    removeArrayField={removeArrayField}
                    handleSubmit={handleSubmit}
                />

                {/* Movie list component displaying all movies */}
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
