import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { KeycloakContext } from '../../App';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [editBooking, setEditBooking] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { keycloak } = useContext(KeycloakContext);

    axios.defaults.baseURL = 'https://localhost:7207/api';

    // Fetch bookings when the component mounts
    useEffect(() => {
        fetchBookings();
    }, []);

    //Method to get the bookings, that have been made.
    const fetchBookings = async () => {
        //Confirms if the user is Authorized
        try {
            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}`
                }
            };
            //Gets the data about the bookings
            const response = await axios.get('/Booking', config);
            setBookings(response.data);
        //Error handling
        } catch (error) {
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    // Allows the user to update the date of the booking
    const updateBooking = async (booking) => {
        //Gets the new requested date and time
        try {
            const updatedBooking = {
                id: booking.id,
                date: new Date(booking.date).toISOString()
            };

            //Authentication
            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}`
                }
            };

            // Make the PUT request to update the booking
            const response = await axios.put(`/Booking/${booking.id}`, updatedBooking, config);

            // Updates the booking through ID
            setBookings(bookings.map(b => (b.id === booking.id ? response.data : b)));
            setEditBooking(null);
        //Error handling
        } catch (error) {
            setError('Failed to update booking');
            console.error('Update Booking Error:', error.response?.data || error.message);
        }
    };

    // Cancel (delete) a booking
    const cancelBooking = async (id) => {
        //Pop up message to confirm that the booking should be deleted/canceled
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            //Authentication
            try {
                let config = {
                    headers: {
                        accept: "application/json",
                        authorization: `Bearer ${keycloak.token}`
                    }
                };
                //Deletes the booking
                await axios.delete(`/Booking/${id}`, config);
                setBookings(bookings.filter(b => b.id !== id)); 
            //Error handling
            } catch (error) {
                setError('Failed to cancel booking');
            }
        }
    };

    // When button is pressed then allows the user to edit the booking
    const handleEdit = (booking) => {
        setEditBooking(booking); 
    };

    // When button is pressed it cancels the booking
    const handleCancelEdit = () => {
        setEditBooking(null);
    };

    return (
        <div>
            <h1>Booking Management</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading bookings...</p>
            ) : (
                <>
                    {bookings.length === 0 ? (
                        <p>No bookings available.</p>
                    ) : (
                        <ul>
                            {bookings.map((booking) => (
                                <li key={booking.id}>
                                    {editBooking?.id === booking.id ? (
                                        <div>
                                            {/* Only the Date can be edited */}
                                            <input
                                                type="datetime-local"
                                                value={new Date(editBooking.date).toISOString().slice(0, 16)}
                                                onChange={(e) => setEditBooking({ ...editBooking, date: e.target.value })}
                                            />
                                            {/* Saves the changes made in the database */ }
                                            <button onClick={() => updateBooking(editBooking)}>Save</button>
                                            {/* Button to cancel booking */ }
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <strong>Room ID:</strong> {booking.roomId} <br />
                                            <strong>Booking Date:</strong> {new Date(booking.date).toLocaleString()} <br />
                                            <strong>Price:</strong> ${booking.price} <br />
                                            <strong>Reserved:</strong> {booking.isReserved ? 'Yes' : 'No'} <br />
                                            <button onClick={() => handleEdit(booking)}>Edit Date</button>
                                            <button onClick={() => cancelBooking(booking.id)}>Cancel Booking</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default BookingManagement;
