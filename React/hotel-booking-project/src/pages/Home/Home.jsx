import React from 'react';
import './Home.css';
import MediaCard from "./Cards/CardRoom1.jsx";

const Home = () => {
    return (
        <div className="background">

            <div className="card-container">
                <MediaCard
                    title="Standard Room"
                    description="This is a description of the standard room. It includes amenities and other details."
                    image="src/assets/lazlo-panaflex-HSClqx534aI-unsplash.jpg"
                />
                <MediaCard
                    title="Deluxe Room"
                    description="This is a description of the deluxe room. It offers premium amenities and extra space."
                    image="src/assets/another-image.jpg"
                />
                <MediaCard
                    title="Suite Room"
                    description="This is a description of the suite room. It provides luxury accommodations with exclusive services."
                    image="src/assets/yet-another-image.jpg"
                />
            </div>
        </div>
    );
};

export default Home;
