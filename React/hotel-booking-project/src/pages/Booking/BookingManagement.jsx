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

    // Fetch bookings
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
                checkIn: new Date(booking.checkIn).toISOString(), // Convert to UTC ISO string
                checkOut: new Date(booking.checkOut).toISOString(), // Convert to UTC ISO string
                price: booking.price,
                roomId: booking.roomId,
                isReserved: booking.isReserved,
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

            // Update the local bookings state with the updated booking
            setBookings(prevBookings =>
                prevBookings.map(b => (b.id === booking.id ? response.data : b))
            );
            setEditBooking(null); // Clear the edit state after saving
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
              
                await axios.delete(`/Booking/${id}`, config); // Delete the booking
                setBookings(prevBookings => prevBookings.filter(b => b.id !== id)); // Remove booking from the state
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
                                    {editBooking && editBooking.id === booking.id ? (
                                        <div>
                                            {/* Only the date can be edited */ }
                                            <input
                                                type="datetime-local"
                                                value={editBooking?.checkIn ? new Date(editBooking.checkIn).toISOString().slice(0, 16) : ''} //convert to ISO string and format
                                                onChange={(e) => setEditBooking({ ...editBooking, checkIn: e.target.value })}
                                            />
                                            <input
                                                type="datetime-local"
                                                value={editBooking?.checkOut ? new Date(editBooking.checkOut).toISOString().slice(0, 16) : ''} //convert to ISO string and format
                                                onChange={(e) => setEditBooking({ ...editBooking, checkOut: e.target.value })}
                                            />
                                            {/* Saves the changes made in the database */ }
                                            <button onClick={() => updateBooking(editBooking)}>Save</button>
                                            {/* Button to cancel booking */ }
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <strong>Room ID:</strong> {booking.roomId} <br />
                                            <strong>Check-In:</strong> {new Date(booking.checkIn).toLocaleString()} <br />
                                            <strong>Check-Out:</strong> {new Date(booking.checkOut).toLocaleString()} <br />
                                            <strong>Price:</strong> ${booking.price} <br />
                                            <strong>Reserved:</strong> {booking.isReserved ? 'Yes' : 'No'} <br />
                                            <button onClick={() => handleEdit(booking)}>Edit Dates</button>
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
