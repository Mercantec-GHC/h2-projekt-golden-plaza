import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const RoomDisplay = () => {
    const navigate = useNavigate();
    const [selectedRoomType, setSelectedRoomType] = useState('');

    const roomTypes = [
        {
            id: '1',
            title: 'Standard Room',
            description: 'A cozy standard room for a comfortable stay.',
            image: '../../assets/standard.jpg', // Hardcoded image path
        },
        {
            id: '2',
            title: 'Deluxe Room',
            description: 'A spacious deluxe room with premium amenities.',
            image: '../../assets/deluxe.jpg', // Hardcoded image path
        },
        {
            id: '3',
            title: 'Premium Room',
            description: 'An elegant premium room with luxury features.',
            image: '../../assets/suite.jpg', // Hardcoded image path
        },
    ];

    const handleRoomSelect = (roomType) => {
        setSelectedRoomType(roomType.id);
        navigate(`/booking?roomTypeId=${roomType.id}`);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {roomTypes.map((room) => (
                <Card key={room.id} sx={{ maxWidth: 345, margin: 2 }}>
                    <CardMedia component="img" height="140" image={room.image} alt={room.title} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {room.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {room.description}
                        </Typography>
                    </CardContent>
                    <Button
                        size="small"
                        onClick={() => handleRoomSelect(room)}
                        sx={{
                            color: 'rgb(180, 155, 99)',
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                            '&:hover': {
                                backgroundColor: 'rgb(180, 155, 99)',
                                color: 'rgba(0, 0, 0, 0.85)',
                            },
                        }}
                    >
                        Select {room.title}
                    </Button>
                </Card>
            ))}
        </div>
    );
};

export default RoomDisplay;
