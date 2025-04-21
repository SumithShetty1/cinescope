import React, { useEffect, useState } from 'react';
import './HighRatedPage.css';
import api from '../../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const HighRatedPage = () => {
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        const fetchTopRatedMovies = async () => {
            try {
                const response = await api.get("/api/v1/movies/top-rated/0"); // 0 means no limit
                const movies = response.data;
                setTopRatedMovies(movies);
                setFilteredMovies(movies);
            } catch (error) {
                console.error("Error fetching top-rated movies:", error);
                setError('Failed to load top-rated movies');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopRatedMovies();
    }, []);

    useEffect(() => {
        const filtered = topRatedMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, topRatedMovies]);

    function goToDetails(movieId) {
        navigate(`/details/${movieId}`);
    }

    if (isLoading) {
        return (
            <div className="high-rated-page-section">
                <div className="loading-spinner">Loading top-rated movies...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="high-rated-page-section">
                <div className="error-message">
                    {error}
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="high-rated-page-section">
            <div className="high-rated-page-header">
                <h2 className="high-rated-page-title">Top Rated Movies</h2>
                <div className="high-rated-page-search-container">
                    <FontAwesomeIcon icon={faSearch} className="high-rated-page-search-icon" />
                    <input
                        type="text"
                        placeholder="Search top rated movies..."
                        className="high-rated-page-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="movie-grid">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <div
                            key={movie.imdbId}
                            className="high-rated-page-movie-poster"
                            onClick={() => goToDetails(movie.imdbId)}
                        >
                            <div className="poster-container">
                                <img src={movie.poster} alt={movie.title} />
                                <div className="movie-rating">
                                    {movie?.rating || 'N/A'}
                                </div>
                            </div>
                            <p className="high-rated-page-movie-title">{movie.title}</p>
                        </div>
                    ))
                ) : (
                    <div className="high-rated-page-no-results">
                        {topRatedMovies.length === 0 ?
                            "No top-rated movies available" :
                            "No movies found matching your search"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HighRatedPage;