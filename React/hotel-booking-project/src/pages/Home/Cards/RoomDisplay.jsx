import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {KeycloakContext} from '../../../App.jsx';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import image1 from '../../../assets/standard.jpg'; //Hardcoded image path
import image2 from '../../../assets/deluxe.jpg'; //Hardcoded image path
import image3 from '../../../assets/suite.jpg'; //Hardcoded image path

const RoomDisplay = () => {
    const navigate = useNavigate();
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);

    const { keycloak } = useContext(KeycloakContext);

    const images = [image1, image2, image3]; //array of images

    //fetches the roomType selected and redirects to booking page with the selected roomType
    const handleRoomSelect = (roomType) => {
        setSelectedRoomType(roomType.id);
        if (keycloak && keycloak.authenticated) {
            // If authenticated, navigate to the booking page
            navigate(`/booking?roomTypeId=${roomType.id}`);
        } else {
            // If not authenticated, open the login prompt dialog
            setOpenDialog(true);
        }
    };

    const fetchRoomTypes = () => {
        //fetch roomTypes from the backend
        axios.get('https://localhost:7207/api/RoomType').then((response) => {
            const fetchedRoomTypes = response.data;
            // For each room type, select a random image from the images array
            fetchedRoomTypes.forEach((roomType) => {
                roomType.image = images[Math.floor(Math.random() * images.length)];
            });
            setRoomTypes(fetchedRoomTypes);
        });
    };

    // Fetch room types on component mount
    useEffect(() => {
        fetchRoomTypes();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {roomTypes.map((room) => (
                <Card key={room.id} sx={{ maxWidth: 345, margin: 2 }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={room.image}
                        alt={room.roomTypeName}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {room.roomTypeName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {room.description ?? 'No description available'}
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

            {/* Authentication Required Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Authentication Required</DialogTitle>
                <DialogContent>
                    <Typography>
                        You must be logged in to proceed to booking.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenDialog(false);
                        }}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setOpenDialog(false);
                            keycloak.login(); // Redirect to Keycloak login
                        }}
                        color="primary"
                    >
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};


export default RoomDisplay;
