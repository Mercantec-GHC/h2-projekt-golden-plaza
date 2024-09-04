import * as React from 'react';
import { useState } from 'react';
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

export default function MediaCard({ roomId, title, description, image }) {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [email, setEmail] = useState('');
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [totalPrice, setTotalPrice] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const checkAvailability = async () => {
        if (!startDate || !endDate) {
            setAvailabilityMessage('Please select both check-in and check-out dates.');
            return;
        }

        try {
            const response = await fetch(
                `https://localhost:7207/api/Booking/CheckAvailability?roomId=${roomId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
            );

            const data = await response.json();

            if (response.ok) {
                setAvailabilityMessage('Room is available.');
                setTotalPrice(data.totalPrice);
            } else {
                setAvailabilityMessage(data.message || 'Room is not available for the selected dates.');
                setTotalPrice(null);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setAvailabilityMessage('An error occurred while checking availability.');
        }
    };

    const bookRoom = async () => {
        if (!email) {
            setAvailabilityMessage('Please enter an email address.');
            return;
        }

        try {
            // Fetch customer details using the provided email
            const customerResponse = await fetch(`https://localhost:7207/api/Customer`);
            const customers = await customerResponse.json();

            const customer = customers.find(c => c.email === email);

            if (!customer) {
                setAvailabilityMessage('Customer not found. Please check the email or sign up.');
                return;
            }

            const customerId = customer.userId;

            // Book the room
            const response = await fetch(
                `https://localhost:7207/api/Booking/BookRoom?roomId=${roomId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&customerId=${customerId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setAvailabilityMessage('Room booked successfully.');

                // Send a confirmation email
                const emailResponse = await fetch('https://localhost:7207/Mail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        emailToId: customer.email,
                        emailToName: customer.email,
                        emailSubject: `Booking Confirmation: Room ${roomId}`,
                        emailBody: `Dear customer,\n\nThank you for booking with us! Here are your booking details:\n\nRoom ID: ${roomId}\nCheck-in Date: ${new Date(startDate).toLocaleDateString()}\nCheck-out Date: ${new Date(endDate).toLocaleDateString()}\nTotal Price: $${totalPrice}\n\nWe look forward to your stay!\n\nBest regards,\nThe Golden Plaza Hotel`
                    })
                });

                if (emailResponse.ok) {
                    console.log('Confirmation email sent successfully.');
                } else {
                    console.error('Failed to send confirmation email.');
                }
            } else {
                setAvailabilityMessage(data.message || 'Failed to book the room.');
            }
            // eslint-disable-next-line no-unused-vars
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
            <CardMedia
                sx={{ height: 190 }}
                image={image}
                title={title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: 'rgb(180, 155, 99)' }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgb(180, 155, 99)' }}>
                    {description}
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
                <Button size="small" sx={{  color: 'rgb(180, 155, 99)',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgb(180, 155, 99)',
                        color: 'rgba(0, 0, 0, 0.85)',
                    }, }}>Details</Button>
            </CardActions>

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
                        Select Check-in and Check-out Dates
                    </Typography>
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
                    <Button onClick={bookRoom} variant="contained" color="secondary">
                        Book Room
                    </Button>
                </Box>
            </Modal>
        </Card>
    );
}
