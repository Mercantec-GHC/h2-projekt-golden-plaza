import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import image from '../../../assets/standard.jpg';
import axios from 'axios';
import { KeycloakContext } from '../../../App.jsx';

// Import Dialog components for the success popup
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function MediaCard() {
    const [open, setOpen] = useState(false); // Controls the booking modal
    const [startDate, setStartDate] = useState(null); // Check-in date
    const [endDate, setEndDate] = useState(null); // Check-out date
    const [roomType, setRoomType] = useState(''); // Selected room type
    const [totalPrice, setTotalPrice] = useState(null); // Total price of the booking
    const [roomPrice, setRoomPrice] = useState(0); // Price per night for the room
    const [isLocked, setIsLocked] = useState(false); // Lock room type selection
    const { keycloak } = useContext(KeycloakContext); // Keycloak for authentication
    const navigate = useNavigate(); // For navigation
    const [bookingSuccess, setBookingSuccess] = useState(false); // Controls the success dialog

    const title = 'Book a Room';
    const description = 'Select check-in and check-out dates to book a room.';
    const facilities = ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar'];

    const location = useLocation();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Set room type from query parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const roomTypeId = queryParams.get('roomTypeId');

        if (roomTypeId) {
            setRoomType(roomTypeId);
            setIsLocked(true); // Lock the room type selection
        }
    }, [location.search]);

    // Navigate to manage-booking after a timeout when booking is successful
    useEffect(() => {
        let timer;
        if (bookingSuccess) {
            timer = setTimeout(() => {
                setBookingSuccess(false);
                navigate('/manage-booking'); // Navigate to manage-booking page
            }, 5000); // 5-second delay
        }
        return () => clearTimeout(timer);
    }, [bookingSuccess, navigate]);

    // Attempt to book a room using the API
    const attemptBooking = async () => {
        if (!startDate || !endDate) {
            alert('Please select check-in and check-out dates.');
            return;
        }

        // Prepare booking data
        const booking = {
            checkIn: startDate.toISOString(),
            checkOut: endDate.toISOString(),
            roomTypeId: parseInt(roomType),
            userId: keycloak.tokenParsed.sub,
        };

        try {
            // Ensure the user is authenticated
            if (!keycloak.authenticated) {
                keycloak.login();
                return;
            }

            // Set the authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;

            // Attempt to create a booking
            const response = await axios.post('https://localhost:7207/api/Booking', booking);

            if (response.status === 201) {
                // Booking was successful
                setBookingSuccess(true); // Show success dialog
                setStartDate(null);
                setEndDate(null);
                setTotalPrice(null);
                setIsLocked(false);
                handleClose(); // Close the booking modal
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error(error.response.data);
                alert('No available rooms for the selected dates.');
            } else {
                alert('An error occurred while booking the room.');
                console.error(error);
            }
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
                <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ color: 'rgb(180, 155, 99)' }}
                >
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgb(180, 155, 99)' }}>
                    {description}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgb(180, 155, 99)' }}>
                    Facilities: {Array.isArray(facilities) ? facilities.join(', ') : 'N/A'}
                </Typography>
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

            {/* Booking Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
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
                        Select Check-In and Check-Out Dates
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        Check In:
                    </Typography>
                    {/* Date Pickers */}
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Check-in Date"
                        inline
                    />

                    <Typography variant="body2" color="textSecondary">
                        Check Out:
                    </Typography>
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

                    {/* Confirm Booking Button */}
                    <Button onClick={attemptBooking} variant="contained" color="primary">
                        Confirm Booking
                    </Button>
                </Box>
            </Modal>

            {/* Success Dialog */}
            <Dialog
                open={bookingSuccess}
                onClose={() => {
                    setBookingSuccess(false);
                    navigate('/manage-booking');
                }}
            >
                <DialogTitle>Booking Successful</DialogTitle>
                <DialogContent>
                    <Typography>Your room has been booked successfully.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setBookingSuccess(false);
                            navigate('/manage-booking');
                        }}
                        color="primary"
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
