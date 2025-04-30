import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import './Trailer.css';
import React from 'react'

// This component plays a YouTube trailer based on the `ytTrailerId` from the route
const Trailer = () => {

    let params = useParams();
    let key = params.ytTrailerId;

    return (
        <div className="react-player-container">

            {/* Render ReactPlayer only if a trailer ID is provided */}
            {(key != null) ? <ReactPlayer controls="true" playing={true} url={`https://www.youtube.com/watch?v=${key}`}
                width='100%' height='100%' /> : null}

        </div>
    )
}

export default Trailer
