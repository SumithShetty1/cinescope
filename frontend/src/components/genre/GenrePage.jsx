import React, { useEffect, useState } from 'react';
import './GenrePage.css';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const GenrePage = () => {
    const { genreName } = useParams();
    const [genreMovies, setGenreMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenreMovies = async () => {
            try {
                const response = await api.get("/api/v1/movies");
                const filtered = response.data.filter((movie) =>
                    movie.genres.includes(genreName)
                );
                setGenreMovies(filtered);
                setFilteredMovies(filtered);
            } catch (error) {
                console.error("Error fetching genre movies:", error);
            }
        };

        fetchGenreMovies();
    }, [genreName]);

    useEffect(() => {
        const filtered = genreMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, genreMovies]);

    function reviews(movieId) {
        navigate(`/reviews/${movieId}`);
    }

    return (
        <div className='genre-page-section'>
            <div className="genre-page-header">
                <h2 className="genre-page-title">{genreName} Movies</h2>
                <div className="genre-page-search-container">
                    <FontAwesomeIcon icon={faSearch} className="genre-page-search-icon" />
                    <input
                        type="text"
                        placeholder={`Search ${genreName} movies...`}
                        className="genre-page-search-input"
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
                            className="genre-page-movie-poster"
                            onClick={() => reviews(movie.imdbId)}
                        >
                            <img src={movie.poster} alt={movie.title} />
                            <p className="genre-page-movie-title">{movie.title}</p>
                        </div>
                    ))
                ) : (
                    <div className="genre-page-no-results">
                        No movies found matching your search
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenrePage;
