import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ArrayInputGroup from "../arrayInputGroup/ArrayInputGroup";
import "./MovieForm.css";

// This component handles both adding and editing movie details.
const MovieForm = ({
    formData,
    isEditing,
    isLoading,
    handleInputChange,
    handleArrayChange,
    addArrayField,
    removeArrayField,
    handleSubmit
}) => {
    return (
        <form onSubmit={handleSubmit} className="manage-form">
            <div className="manage-form-columns">

                {/* Movie Details Section */}
                <div className="manage-form-section">
                    <h3 className="manage-section-title">Movie Details</h3>

                    {/* IMDB ID input field */}
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

                    {/* Title input field */}
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

                    {/* Description textarea field */}
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

                    {/* Duration input field */}
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

                    {/* Release Date input field */}
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

                    {/* Trailer Link input field */}
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

                    {/* Poster URL input field */}
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

                {/* Genres Section */}
                <div className="manage-form-section">
                    <h3 className="manage-section-title">Genres</h3>

                    {/* Rendering each genre as an input field using ArrayInputGroup */}
                    {formData.genres.map((genre, index) => (
                        <ArrayInputGroup
                            key={index}
                            value={genre}
                            index={index}
                            field="genres"
                            placeholder="Genre"
                            handleArrayChange={handleArrayChange}
                            removeArrayField={removeArrayField}
                        />
                    ))}

                    {/* Button to add a new genre */}
                    <Button
                        variant="outline-info"
                        onClick={() => addArrayField("genres")}
                        className="manage-add-button"
                    >
                        <FontAwesomeIcon icon={faPlus} className="manage-icon" />
                        Add Genre
                    </Button>

                    {/* Directors Section */}
                    <h3 className="manage-section-title" style={{ marginTop: "2rem" }}>Directors</h3>

                    {/* Rendering each director as an input field */}
                    {formData.directors.map((director, index) => (
                        <ArrayInputGroup
                            key={index}
                            value={director}
                            index={index}
                            field="directors"
                            placeholder="Director name"
                            handleArrayChange={handleArrayChange}
                            removeArrayField={removeArrayField}
                        />
                    ))}

                    {/* Button to add a new director */}
                    <Button
                        variant="outline-info"
                        onClick={() => addArrayField("directors")}
                        className="manage-add-button"
                    >
                        <FontAwesomeIcon icon={faPlus} className="manage-icon" />
                        Add Director
                    </Button>

                    {/* Writers Section */}
                    <h3 className="manage-section-title" style={{ marginTop: "2rem" }}>Writers</h3>

                    {/* Rendering each writer as an input field */}
                    {formData.writers.map((writer, index) => (
                        <ArrayInputGroup
                            key={index}
                            value={writer}
                            index={index}
                            field="writers"
                            placeholder="Writer name"
                            handleArrayChange={handleArrayChange}
                            removeArrayField={removeArrayField}
                        />
                    ))}

                    {/* Button to add a new writer */}
                    <Button
                        variant="outline-info"
                        onClick={() => addArrayField("writers")}
                        className="manage-add-button"
                    >
                        <FontAwesomeIcon icon={faPlus} className="manage-icon" />
                        Add Writer
                    </Button>

                    {/* Stars Section */}
                    <h3 className="manage-section-title" style={{ marginTop: "2rem" }}>Stars</h3>

                    {/* Rendering each star as an input field */}
                    {formData.stars.map((star, index) => (
                        <ArrayInputGroup
                            key={index}
                            value={star}
                            index={index}
                            field="stars"
                            placeholder="Actor name"
                            handleArrayChange={handleArrayChange}
                            removeArrayField={removeArrayField}
                        />
                    ))}

                    {/* Button to add a new star */}
                    <Button
                        variant="outline-info"
                        onClick={() => addArrayField("stars")}
                        className="manage-add-button"
                    >
                        <FontAwesomeIcon icon={faPlus} className="manage-icon" />
                        Add Star
                    </Button>
                </div>

                {/* Backdrops Section */}
                <div className="manage-form-section">
                    <h3 className="manage-section-title">Backdrops</h3>
                    {formData.backdrops.map((url, index) => (
                        <ArrayInputGroup
                            key={index}
                            value={url}
                            index={index}
                            field="backdrops"
                            placeholder="Backdrop URL"
                            handleArrayChange={handleArrayChange}
                            removeArrayField={removeArrayField}
                        />
                    ))}

                    {/* Button to add a new backdrop */}
                    <Button
                        variant="outline-info"
                        onClick={() => addArrayField("backdrops")}
                        className="manage-add-button"
                    >
                        <FontAwesomeIcon icon={faPlus} className="manage-icon" />
                        Add Backdrop
                    </Button>
                </div>
            </div>

            {/* Form Submit Button */}
            <div className="manage-form-actions">
                <Button
                    variant={isEditing ? "warning" : "success"}
                    type="submit"
                    className="manage-submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : isEditing ? "Update Movie" : "Add Movie"}
                </Button>
            </div>
        </form>
    );
};

export default MovieForm;
