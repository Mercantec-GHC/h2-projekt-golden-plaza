import React from 'react';
import './Home.css';
import MediaCard from "./Cards/CardRoom1.jsx";

const Home = () => {
    return (
        <div className="background">
            <div>
                <h1>

                </h1>
            </div>

            <div className="card-container"> {/* Add a container for the cards */}
                <MediaCard/> {/* First card */}
                <MediaCard/> {/* Second card */}
                <MediaCard/> {/* Third card */}
            </div>


        </div>
    );
};

export default Home
