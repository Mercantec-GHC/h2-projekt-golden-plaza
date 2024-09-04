import React, { useEffect, useState } from 'react';
import './Home.css';
import MediaCard from "./Cards/CardRoom1.jsx";
import image1 from '../../assets/suite.jpg';
import image2 from '../../assets/Deluxe.jpg';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const imageMap = {
        1: image1,
        2: image2
    };

    useEffect(() => {
        fetch('https://localhost:7207/api/Rooms')
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching rooms:', error));
    }, []);

    const getImageForRoom = (roomId) => {
        return imageMap[roomId] || image1;
    };

    return (
        <div className="background">
            <div className="card-container">
                {rooms.map(room => (
                    <MediaCard
                        key={room.id}
                        roomId={room.id}  // Pass roomId as a prop
                        title={room.roomType}
                        description={`Room Number: ${room.roomNumber}, Capacity: ${room.capacity}, Price: $${room.pricePerNight}/night`}
                        image={getImageForRoom(room.id)}
                        facilities={room.facilities}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
