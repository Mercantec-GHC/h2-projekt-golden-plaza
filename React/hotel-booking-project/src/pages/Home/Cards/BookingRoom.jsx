import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useLocation } from 'react-router-dom'; // Import useLocation for query params

export default function MediaCard({ title, description, image, facilities }) {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState('');
    const [email, setEmail] = useState('');
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [totalPrice, setTotalPrice] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [availableRoomId, setAvailableRoomId] = useState(null);
    const [roomPrice, setRoomPrice] = useState(0);
    const [isLocked, setIsLocked] = useState(false); // Locking the dropdown

    const location = useLocation(); // Hook to access URL query params

    // Modal controls
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleRoomTypeChange = (event) => {
        setRoomType(event.target.value);
        setRoomPrice(getRoomPrice(event.target.value)); // Set room price based on selected type
    };

    const getRoomPrice = (type) => {
        switch (type) {
            case '1':
                return 100; // Standard price per night
            case '2':
                return 150; // Deluxe price per night
            case '3':
                return 200; // Premium price per night
            default:
                return 0;
        }
    };

    // Fetch current bookings from the database
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(`https://localhost:7207/api/Booking`);
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
        fetchBookings();
    }, []);

    // Check if room type is selected from the query parameter and set it
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const roomTypeId = queryParams.get('roomTypeId');

        if (roomTypeId) {
            setRoomType(roomTypeId);
            setRoomPrice(getRoomPrice(roomTypeId)); // Set price based on room type
            setIsLocked(true); // Lock the dropdown when a room type is selected
        }
    }, [location.search]);

    // Check availability based on room type and dates
    const checkAvailability = async () => {
        if (!startDate || !endDate || !roomType) {
            setAvailabilityMessage('Please select room type, check-in, and check-out dates.');
            return;
        }

        // Fetch available room IDs based on room type and dates
        try {
            const response = await fetch(`https://localhost:7207/api/Rooms?roomTypeId=${roomType}`);
            const rooms = await response.json();

            // Check for overlapping bookings
            const availableRooms = rooms.filter((room) => {
                return !bookings.some((booking) =>
                    booking.roomId === room.id &&
                    (new Date(booking.checkIn) < endDate && new Date(booking.checkOut) > startDate)
                );
            });

            if (availableRooms.length > 0) {
                setAvailableRoomId(availableRooms[0].id); // Choose the first available room
                const numberOfNights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                setTotalPrice(numberOfNights * roomPrice);
                setAvailabilityMessage('Room is available. Room ID: ' + availableRooms[0].id);
            } else {
                setAvailabilityMessage('No rooms available for the selected dates.');
                setTotalPrice(null);
            }
        } catch (error) {
            setAvailabilityMessage('An error occurred while checking availability.');
        }
    };

    // Booking the room
    const bookRoom = async () => {
        if (availableRoomId === null || totalPrice === null) {
            setAvailabilityMessage('Please check availability first.');
            return;
        }

        // Create booking
        const booking = {
            roomId: availableRoomId,
            checkIn: startDate.toISOString(),
            checkOut: endDate.toISOString(),
            price: totalPrice,
            email: email,
            isReserved: true,
        };

        try {
            const response = await fetch(`https://localhost:7207/api/Booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(booking),
            });

            if (response.ok) {
                setBookings((prevBookings) => [...prevBookings, booking]); // Update local state
                setAvailabilityMessage('Room booked successfully.');
                setStartDate(null);
                setEndDate(null);
                setRoomType('');
                setTotalPrice(null);
                setAvailableRoomId(null);
                setIsLocked(false); // Unlock dropdown for future bookings
            } else {
                const errorData = await response.json();
                setAvailabilityMessage(errorData.message || 'Failed to book the room.');
            }
        } catch (error) {
            setAvailabilityMessage('An error occurred while booking the room.');
        }
    };

    return (
        <Card
            sx={{
                width: 395,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                color: 'rgb(180, 155, 99)',
                borderRadius: '20px',
                border: '2px solid rgb(180, 155, 99)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.08)',
                },
            }}
        >
            <CardMedia sx={{ height: 190 }} image={image} title={title} />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: 'rgb(180, 155, 99)' }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgb(180, 155, 99)' }}>
                    {description}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgb(180, 155, 99)' }}>
                    Facilities: {Array.isArray(facilities) ? facilities.join(', ') : 'N/A'}
                </Typography>
                {bookings.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="h6" sx={{ color: 'rgb(180, 155, 99)' }}>
                            Current Bookings:
                        </Typography>
                        {bookings.map((booking, index) => (
                            <Typography key={index} variant="body2" sx={{ color: 'rgb(180, 155, 99)' }}>
                                Room ID: {booking.roomId}, Check-in: {new Date(booking.checkIn).toLocaleDateString()}, Check-out: {new Date(booking.checkOut).toLocaleDateString()}, Price: ${booking.price}
                            </Typography>
                        ))}
                    </Box>
                )}
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    onClick={handleOpen}
                    sx={{
                        color: 'rgb(180, 155, 99)',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgb(180, 155, 99)',
                            color: 'rgba(0, 0, 0, 0.85)',
                        },
                    }}
                >
                    Book
                </Button>
            </CardActions>

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Select Room Type and Dates
                    </Typography>
                    <Select
                        value={roomType}
                        onChange={handleRoomTypeChange}
                        displayEmpty
                        fullWidth
                        disabled={isLocked} // Disable if locked
                    >
                        <MenuItem value="" disabled>
                            Select Room Type
                        </MenuItem>
                        <MenuItem value="1">Standard</MenuItem>
                        <MenuItem value="2">Deluxe</MenuItem>
                        <MenuItem value="3">Premium</MenuItem>
                    </Select>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Check-in Date"
                        inline
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="Check-out Date"
                        inline
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                    <Button onClick={checkAvailability} variant="contained" color="primary">
                        Check Availability
                    </Button>
                    {availabilityMessage && (
                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                            {availabilityMessage}
                            {totalPrice !== null && ` Total Price: $${totalPrice}`}
                        </Typography>
                    )}
                    <Button onClick={bookRoom} variant="contained" color="secondary" disabled={availableRoomId === null}>
                        Book Room
                    </Button>
                </Box>
            </Modal>
        </Card>
    );
}
