import React, { useEffect, useState } from 'react';
import './GenreMovies.css';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useNavigate } from "react-router-dom";

const GenreMovies = () => {
    const { genreName } = useParams();
    const [genreMovies, setGenreMovies] = useState([]);

    useEffect(() => {
        const fetchGenreMovies = async () => {
            try {
                const response = await api.get("/api/v1/movies");
                const filtered = response.data.filter((movie) =>
                    movie.genres.includes(genreName)
                );
                setGenreMovies(filtered);
            } catch (error) {
                console.error("Error fetching genre movies:", error);
            }
        };

        fetchGenreMovies();
    }, [genreName]);

    const navigate = useNavigate();

    function reviews(movieId) {
        navigate(`/Reviews/${movieId}`);
    }

    return (
        <div>
            <h2 style={{ color: 'white', margin: '2rem' }}>
                {genreName} Movies
            </h2>
            <div className="movie-grid">
                {genreMovies.map((movie) => (
                    <div
                        key={movie.imdbId} className="genre-movie-poster"
                        onClick={() => reviews(movie.imdbId)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={movie.poster} alt={movie.title} />
                        <p style={{ color: 'white' }}>{movie.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenreMovies;
