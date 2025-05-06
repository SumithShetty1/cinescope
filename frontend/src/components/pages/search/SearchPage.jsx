import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import './SearchPage.css';

// SearchPage component displays full search results based on URL query parameter
const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const query = new URLSearchParams(location.search).get('q');

    // Effect hook to fetch search results when query changes
    useEffect(() => {
        if (!query) {
            navigate('/');
            return;
        }

        const fetchSearchResults = async () => {
            try {
                const response = await api.get(`/movies/search?query=${query}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, navigate]);

    // Navigates to movie details page
    const goToDetails = (imdbId) => {
        navigate(`/details/${imdbId}`);
    };

    // Loading state UI
    if (isLoading) {
        return <div className="loading">Searching for "{query}"...</div>;
    }

    return (
        <div className="search-page">
            <h2 className="search-title">Search Results for "{query}"</h2>

            {/* Results list or empty state */}
            {searchResults.length > 0 ? (
                <div className="search-results">
                    {searchResults.map(movie => (
                        <div
                            key={movie.imdbId}
                            className="search-result-card"
                            onClick={() => goToDetails(movie.imdbId)}
                        >
                            <img src={movie.poster} alt={movie.title} className="result-poster" />
                            <div className="result-info">
                                <h3 className="result-title">{movie.title}</h3>
                                <p className="result-year">{movie.releaseDate?.split('-')[0]}</p>
                                <p className="result-rating">Rating: {movie?.rating ? `★ ${movie.rating}` : 'N/A'}</p>
                                <p className="result-description">{movie.description?.substring(0, 150)}...</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-results">
                    No movies found for "{query}"
                </div>
            )}
        </div>
    );
};

export default SearchPage;
