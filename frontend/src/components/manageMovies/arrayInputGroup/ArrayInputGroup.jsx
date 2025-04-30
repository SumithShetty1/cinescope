import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./ArrayInputGroup.css";

// This component allows users to input an array of values dynamically
const ArrayInputGroup = ({
    value,
    index,
    field,
    placeholder,
    handleArrayChange,
    removeArrayField
}) => {
    return (
        <div className="manage-array-group">

            {/* The input field where users can add/edit array values */}
            <input
                className="manage-array-input"
                type="text"
                value={value}
                onChange={(e) => handleArrayChange(index, e.target.value, field)}
                placeholder={placeholder}
            />

            {/* Button to remove the current item from the array */}
            <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeArrayField(index, field)}
                className="manage-array-button"
            >
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </div>
    );
};

export default ArrayInputGroup;
