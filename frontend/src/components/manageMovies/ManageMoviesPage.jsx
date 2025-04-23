import React, { useState, useEffect } from 'react';
import './ManageMoviesPage.css';
import api from '../../api/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const ManageMoviesPage = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        imdbId: '',
        title: '',
        description: '',
        duration: '',
        directors: [''],
        writers: [''],
        stars: [''],
        releaseDate: '',
        trailerLink: '',
        genres: [''],
        poster: '',
        backdrops: ['']
    });
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    const showToast = (message, variant = 'success') => {
        setToast({ show: true, message, variant });
        setTimeout(() => {
            setToast({ show: false, message: '', variant });
        }, 3000);
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        const filtered = movies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, movies]);

    const fetchMovies = async () => {
        try {
            const res = await api.get('/api/v1/movies');
            setMovies(res.data);
            setFilteredMovies(res.data);
        } catch (err) {
            console.error('Error fetching movies:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index, value, field) => {
        const updatedArray = [...formData[field]];
        updatedArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: updatedArray }));
    };

    const addArrayField = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayField = (index, field) => {
        const updatedArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: updatedArray }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await api.put(`/api/v1/movies/${formData.imdbId}`, formData);
                showToast("Movie updated successfully", "info");
            } else {
                await api.post('/api/v1/movies', formData);
                showToast("Movie created successfully", "success");
            }
            setFormData({
                imdbId: '',
                title: '',
                description: '',
                duration: '',
                directors: [''],
                writers: [''],
                stars: [''],
                releaseDate: '',
                trailerLink: '',
                genres: [''],
                poster: '',
                backdrops: ['']
            });
            setIsEditing(false);
            fetchMovies();
        } catch (err) {
            console.error('Error saving movie:', err);
            showToast("Something went wrong", "danger");
        }
    };

    const handleEdit = (movie) => {
        setFormData({
            ...movie,
            directors: movie.directors || [''],
            writers: movie.writers || [''],
            stars: movie.stars || ['']
        });
        setIsEditing(true);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/v1/movies/${id}`);
            fetchMovies();
            showToast("Movie deleted successfully", "danger");
        } catch (err) {
            console.error('Error deleting movie:', err);
            showToast("Failed to delete movie", "danger");
        }
    };

    return (
        <div className="manage-container">
            <h2 className="manage-header">
                Manage Movies
            </h2>

            {/* Toast Container positioned at top-right */}
            <ToastContainer 
                position="top-end"
                className="p-3 toast-container-custom"
                style={{ 
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999
                }}
            >
                <Toast 
                    show={toast.show} 
                    onClose={() => setToast({...toast, show: false})}
                    delay={3000} 
                    autohide
                    bg={toast.variant}
                    className="custom-toast"
                >
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <div className="manage-content">
                <form onSubmit={handleSubmit} className="manage-form">
                    <div className="manage-form-columns">
                        <div className="manage-form-section">
                            <h3 className="manage-section-title">Movie Details</h3>

                            <div className="manage-form-group">
                                <label className="manage-label">IMDB ID</label>
                                <input
                                    className="manage-input"
                                    name="imdbId"
                                    value={formData.imdbId}
                                    onChange={handleInputChange}
                                    disabled={isEditing}
                                    required
                                />
                            </div>

                            <div className="manage-form-group">
                                <label className="manage-label">Title</label>
                                <input
                                    className="manage-input"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="manage-form-group">
                                <label className="manage-label">Description</label>
                                <textarea
                                    className="manage-input"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="manage-form-group">
                                <label className="manage-label">Duration</label>
                                <input
                                    className="manage-input"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2h 15m"
                                    required
                                />
                            </div>

                            <div className="manage-form-group">
                                <label className="manage-label">Release Date</label>
                                <input
                                    className="manage-input"
                                    type="date"
                                    name="releaseDate"
                                    value={formData.releaseDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="manage-form-group">
                                <label className="manage-label">Trailer Link</label>
                                <input
                                    className="manage-input"
                                    name="trailerLink"
                                    value={formData.trailerLink}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="manage-form-group">
                                <label className="manage-label">Poster URL</label>
                                <input
                                    className="manage-input"
                                    name="poster"
                                    value={formData.poster}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="manage-form-section">
                            <h3 className="manage-section-title">Genres</h3>
                            {formData.genres.map((genre, index) => (
                                <div className="manage-array-group" key={index}>
                                    <input
                                        className="manage-array-input"
                                        type="text"
                                        value={genre}
                                        onChange={(e) => handleArrayChange(index, e.target.value, 'genres')}
                                        placeholder="Genre"
                                    />
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeArrayField(index, 'genres')}
                                        className="manage-array-button"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline-info"
                                onClick={() => addArrayField('genres')}
                                className="manage-add-button"
                            >
                                <FontAwesomeIcon icon={faPlus} className="manage-icon" />
                                Add Genre
                            </Button>

                            <h3 className="manage-section-title" style={{ marginTop: '2rem' }}>Directors</h3>
                            {formData.directors.map((director, index) => (
                                <div className="manage-array-group" key={index}>
                                    <input
                                        className="manage-array-input"
                                        type="text"
                                        value={director}
                                        onChange={(e) => handleArrayChange(index, e.target.value, 'directors')}
                                        placeholder="Director name"
                                    />
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeArrayField(index, 'directors')}
                                        className="manage-array-button"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline-info"
                                onClick={() => addArrayField('directors')}
                                className="manage-add-button"
                            >
                                <FontAwesomeIcon icon={faPlus} className="manage-icon" />
                                Add Director
                            </Button>

                            <h3 className="manage-section-title" style={{ marginTop: '2rem' }}>Writers</h3>
                            {formData.writers.map((writer, index) => (
                                <div className="manage-array-group" key={index}>
                                    <input
                                        className="manage-array-input"
                                        type="text"
                                        value={writer}
                                        onChange={(e) => handleArrayChange(index, e.target.value, 'writers')}
                                        placeholder="Writer name"
                                    />
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeArrayField(index, 'writers')}
                                        className="manage-array-button"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline-info"
                                onClick={() => addArrayField('writers')}
                                className="manage-add-button"
                            >
                                <FontAwesomeIcon icon={faPlus} className="manage-icon" />
                                Add Writer
                            </Button>

                            <h3 className="manage-section-title" style={{ marginTop: '2rem' }}>Stars</h3>
                            {formData.stars.map((star, index) => (
                                <div className="manage-array-group" key={index}>
                                    <input
                                        className="manage-array-input"
                                        type="text"
                                        value={star}
                                        onChange={(e) => handleArrayChange(index, e.target.value, 'stars')}
                                        placeholder="Actor name"
                                    />
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeArrayField(index, 'stars')}
                                        className="manage-array-button"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline-info"
                                onClick={() => addArrayField('stars')}
                                className="manage-add-button"
                            >
                                <FontAwesomeIcon icon={faPlus} className="manage-icon" />
                                Add Star
                            </Button>
                        </div>

                        <div className="manage-form-section">
                            <h3 className="manage-section-title">Backdrops</h3>
                            {formData.backdrops.map((url, index) => (
                                <div className="manage-array-group" key={index}>
                                    <input
                                        className="manage-array-input"
                                        type="text"
                                        value={url}
                                        onChange={(e) => handleArrayChange(index, e.target.value, 'backdrops')}
                                        placeholder="Backdrop URL"
                                    />
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeArrayField(index, 'backdrops')}
                                        className="manage-array-button"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline-info"
                                onClick={() => addArrayField('backdrops')}
                                className="manage-add-button"
                            >
                                <FontAwesomeIcon icon={faPlus} className="manage-icon" />
                                Add Backdrop
                            </Button>
                        </div>
                    </div>

                    <div className="manage-form-actions">
                        <Button
                            variant={isEditing ? "warning" : "success"}
                            type="submit"
                            className="manage-submit-button"
                        >
                            {isEditing ? 'Update Movie' : 'Add Movie'}
                        </Button>
                    </div>
                </form>

                <div className="manage-movies-list">
                    <div className="manage-list-header">
                        <h2 className="manage-list-title">Movies List</h2>
                        <div className="manage-search-container">
                            <FontAwesomeIcon icon={faSearch} className="manage-search-icon" />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                className="manage-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="manage-movies-grid">
                        {filteredMovies.length > 0 ? (
                            filteredMovies.map(movie => (
                                <div key={movie.imdbId} className="manage-movie-card">
                                    <img src={movie.poster} alt={movie.title} className="manage-poster" />
                                    <div className="manage-movie-info">
                                        <h4 className="manage-movie-title">{movie.title}</h4>
                                        <p className="manage-movie-meta">{movie.releaseDate?.split('-')[0]} • {movie.duration}</p>
                                        <div className="manage-movie-actions">
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => handleEdit(movie)}
                                                className="manage-action-button"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="manage-icon" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(movie.imdbId)}
                                                className="manage-action-button"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="manage-icon" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="manage-no-results">
                                No movies found matching your search
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMoviesPage;
