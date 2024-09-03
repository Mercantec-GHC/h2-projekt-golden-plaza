import React from 'react';
import './Home.css';
import MediaCard from "./Cards/CardRoom1.jsx";

const Home = () => {
    return (
        <div className="background">

            <div className="card-container">
                <MediaCard
                    title="Standard Room"
                    description="Enkeltseng eller dobbeltseng, badeværelse med bruser, TV, skrivebord, Wi-Fi."
                    image="src/assets/standard.jpg"
                />
                <MediaCard
                    title="Penthouse"
                    description="King-size seng, stort badeværelse med badekar og separat bruser, opholdsstue, TV, skrivebord, minibar, Wi-Fi, privat terrasse med udsigt.."
                    image="src/assets/Deluxe.jpg"
                />
                <MediaCard
                    title="Premium Room"
                    description="Dobbeltseng, badeværelse med badekar og bruser, TV, skrivebord, minibar, Wi-Fi, balkon."
                    image="src/assets/suite.jpg"
                />
            </div>
        </div>
    );
};

export default Home;
