import React, { useEffect, useState } from 'react';
import './Home.css';
import MediaCard from "./Cards/CardRoom1.jsx";

const Home = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetch('https://localhost:7207/api/Rooms')
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching rooms:', error));
    }, []);

    return (
        <div className="background">
            <div className="card-container">
                {rooms.map(room => (
                    <MediaCard
                        key={room.id}
                        roomId={room.id}  // Pass roomId as a prop
                        title={room.roomType}
                        description={`Room Number: ${room.roomNumber}, Capacity: ${room.capacity}, Price: $${room.pricePerNight}/night`}
                        image={`src/assets/room${room.id}.jpg`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
