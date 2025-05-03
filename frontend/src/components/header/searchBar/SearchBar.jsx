import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import api from "../../../api/axiosConfig";
import './SearchBar.css';

// SearchBar component that provides movie search functionality with autocomplete suggestions
const SearchBar = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Effect hook that triggers search when query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(() => {
            fetchSearchResults(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetches search results from the API based on the query 
    const fetchSearchResults = async (query) => {
        try {
            const response = await api.get(`/movies/search?query=${query}&limit=4`);
            setSearchResults(response.data);
            setShowResults(true);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        }
    };

    // Handles changes to the search input field
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handles form submission (when Enter is pressed)
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowResults(false);
        }
    };

    // Handles clicking on a search result
    const handleResultClick = (imdbId) => {
        navigate(`/details/${imdbId}`);
        setSearchQuery('');
        setShowResults(false);
    };

    // Handles blur event on the search input
    const handleSearchBlur = () => {
        setTimeout(() => {
            setShowResults(false);
        }, 300);
    };

    return (
        <Form className="d-flex position-relative me-3" onSubmit={handleSearchSubmit}>
            <div className="search-container">
                <Form.Control
                    type="search"
                    placeholder="Search movies..."
                    className="me-2 search-input"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery && setShowResults(true)}
                    onBlur={handleSearchBlur}
                />
                <Button variant="outline-info" type="submit" className="search-button">
                    <FontAwesomeIcon icon={faSearch} />
                </Button>
                {showResults && searchResults.length > 0 && (
                    <div className="search-results-dropdown">
                        {searchResults.map(movie => (
                            <div 
                                key={movie.imdbId} 
                                className="search-result-item"
                                onClick={() => handleResultClick(movie.imdbId)}
                            >
                                <img src={movie.poster} alt={movie.title} className="search-result-poster" />
                                <div className="search-result-info">
                                    <div className="search-result-title">{movie.title}</div>
                                    <div className="search-result-year">{movie.releaseDate?.split('-')[0]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Form>
    );
};

export default SearchBar;
