import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { KeycloakContext } from '../../App';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [editBooking, setEditBooking] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Track loading state
    const { keycloak } = useContext(KeycloakContext);

    axios.defaults.baseURL = 'https://localhost:7207/api'; // Adjust to match your backend API URL

    // Fetch bookings when the component mounts
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}` // Add the Keycloak token for authorization
                }
            };
            const response = await axios.get('/Booking', config);
            setBookings(response.data);
        } catch (error) {
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    // Update the booking with the edited date
    const updateBooking = async (booking) => {
        try {
            const updatedBooking = {
                id: booking.id,
                date: new Date(booking.date).toISOString() // Convert to UTC ISO string
            };

            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}`
                }
            };

            // Make the PUT request to update the booking
            const response = await axios.put(`/Booking/${booking.id}`, updatedBooking, config);

            // Update the local bookings state with the updated booking
            setBookings(bookings.map(b => (b.id === booking.id ? response.data : b)));
            setEditBooking(null); // Clear the edit state
        } catch (error) {
            setError('Failed to update booking');
            console.error('Update Booking Error:', error.response?.data || error.message);
        }
    };

    // Cancel (delete) a booking
    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                let config = {
                    headers: {
                        accept: "application/json",
                        authorization: `Bearer ${keycloak.token}` // Add the Keycloak token for authorization
                    }
                };
                await axios.delete(`/Booking/${id}`, config); // Delete the booking
                setBookings(bookings.filter(b => b.id !== id)); // Remove booking from the state
            } catch (error) {
                setError('Failed to cancel booking');
            }
        }
    };

    const handleEdit = (booking) => {
        setEditBooking(booking); // Set the booking that the user wants to edit
    };

    const handleCancelEdit = () => {
        setEditBooking(null); // Reset the edit state to cancel the edit form
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
                                                value={new Date(editBooking.date).toISOString().slice(0, 16)} // Convert to ISO string and format
                                                onChange={(e) => setEditBooking({ ...editBooking, date: e.target.value })}
                                            />
                                            <button onClick={() => updateBooking(editBooking)}>Save</button>
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
