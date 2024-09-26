import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { KeycloakContext } from '../../App';

// Enum for ticket status
const StatusEnum = {
    0: 'Open',
    1: 'Work In Progress',
    2: 'Closed Completed',
    3: 'Closed Skipped',
};

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({ title: '', description: '', status: 0 });
    const [editTicket, setEditTicket] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Track loading state
    const {keycloak} = useContext(KeycloakContext);

    // Set Axios base URL (optional if API base is the same across the app)
    axios.defaults.baseURL = 'https://localhost:7207/api'; // Adjust to your backend's actual URL

    // Fetch all tickets when the component mounts
    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}`
                }
            }
            const response = await axios.get('/Ticket', config);
            setTickets(response.data);
        } catch (error) {
            setError('Failed to fetch tickets');
        } finally {
            setLoading(false);
        }
    };

    const addTicket = async () => {
        try {
            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}`
                }
            }
            const response = await axios.post('/Ticket',newTicket, config);
            setTickets([...tickets, response.data]);
            setNewTicket({ title: '', description: '', status: 0 });
        } catch (error) {
            setError('Failed to add ticket');
        }
    };

    const updateTicket = async (ticket) => {
        try {
            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}`
                }
            }
            const response = await axios.put('/Ticket', ticket, config);
            setTickets(tickets.map((t) => (t.id === ticket.id ? response.data : t)));
            setEditTicket(null);
        } catch (error) {
            setError('Failed to update ticket');
        }
    };

    const deleteTicket = async (id) => {
        try {
            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}`
                }
            }
            await axios.delete(`/Ticket/${id}`, config);
            setTickets(tickets.filter((t) => t.id !== id));
        } catch (error) {
            setError('Failed to delete ticket');
        }
    };

    const handleEdit = (ticket) => {
        setEditTicket(ticket);
    };

    const handleCancelEdit = () => {
        setEditTicket(null);
    };

    return (
        <div>
            <h1>Tickets</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading tickets...</p>
            ) : (
                <>
                    {tickets.length === 0 ? (
                        <p>No Tickets Found</p>
                    ) : (
                        <ul>
                            {tickets.map((ticket) => (
                                <li key={ticket.id}>
                                    {editTicket?.id === ticket.id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editTicket.title}
                                                onChange={(e) => setEditTicket({ ...editTicket, title: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                value={editTicket.description}
                                                onChange={(e) => setEditTicket({ ...editTicket, description: e.target.value })}
                                            />
                                            <select
                                                value={editTicket.status}
                                                onChange={(e) => setEditTicket({ ...editTicket, status: Number(e.target.value) })}
                                            >
                                                <option value={0}>Open</option>
                                                <option value={1}>Work In Progress</option>
                                                <option value={2}>Closed Completed</option>
                                                <option value={3}>Closed Skipped</option>
                                            </select>
                                            <button onClick={() => updateTicket(editTicket)}>Save</button>
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <h2>{ticket.title}</h2>
                                            <p>{ticket.description}</p>
                                            <p>Status: {StatusEnum[ticket.status]}</p>
                                            <button onClick={() => handleEdit(ticket)}>Edit</button>
                                            <button onClick={() => deleteTicket(ticket.id)}>Delete</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            <h2>Add New Ticket</h2>
            <input
                type="text"
                placeholder="Title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
            />
            <input
                type="text"
                placeholder="Description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            />
            <button onClick={addTicket}>Add Ticket</button>
        </div>
    );
};

export default Tickets;
