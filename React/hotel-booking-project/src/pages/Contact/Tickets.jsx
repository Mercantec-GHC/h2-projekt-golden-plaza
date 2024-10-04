// import all the necessary packages/functions from the react, axios, and material-ui libraries, as well as the KeycloakContext from App.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { KeycloakContext } from '../../App';
import { Button, MenuItem, TextField, Select, Container, Grid2 } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';

// Enum for ticket status
const StatusEnum = {
    0: 'Open',
    1: 'Work In Progress',
    2: 'Closed Completed',
    3: 'Closed Skipped',
};

// a custom theme for the Ticket component
const theme = createTheme({
    palette: {
      primary:{
        main: '#B49B63',
      },
      secondary: {
        main: '#ffffff',
      },
    },
  });

  // a custom style for the Ticket component. that removes the bullets from the list
  const noBullets = {
    listStyleType: 'none'
  };

const Tickets = () => {
    const {keycloak} = useContext(KeycloakContext); // Access the keycloak object from the KeycloakContext
    const [tickets, setTickets] = useState([]); // State variable to store tickets
    const [newTicket, setNewTicket] = useState({ title: '', description: '', status: 0, userId: keycloak.subject }); // State variable to store new ticket
    const [editTicket, setEditTicket] = useState(null); // State variable to store ticket being edited
    const [error, setError] = useState(''); // Track error state
    const [loading, setLoading] = useState(true); // Track loading state
    

    // Set Axios base URL (optional if API base is the same across the app)
    axios.defaults.baseURL = 'https://localhost:7207/api'; // Adjust to your backend's actual URL

    // Fetch all tickets for that specific user, when loading the component/page
    useEffect(() => {
        fetchTickets(keycloak.subject);
    }, []);

    // Fetch all tickets for that specific user, using the user's id
    const fetchTickets = async (id) => {
        try {
            // the config object is used to set the headers for the request, with the jwt token as the bearer token.
            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}`
                }
            }
            // the axios.get function is used to make a get request to the backend API, to fetch all tickets for that specific user
            const response = await axios.get(`/Ticket/${id}`, config);
            // the setTickets function is used to set the tickets state variable to the response data
            setTickets(response.data);
        } catch (error) {
            //if it catches an error, it will set the error state to 'Failed to fetch tickets'
            setError('Failed to fetch tickets');
        } finally {
            // finally, it will set the loading state to false, to indicate that the tickets have been fetched
            setLoading(false);
        }
    };

    // api call to let a user add a ticket
    const addTicket = async () => {
        try {
            // the config object is used to set the headers for the request, with the jwt token as the bearer token.
            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}`
                }
            }
            // the axios.post function is used to make a post request to the backend API, to add a new ticket
            const response = await axios.post('/Ticket',newTicket, config);
            // the setTickets function is used to set the tickets state variable to the response data, and the tickets that were already there
            setTickets([...tickets, response.data]);
            // the setNewTicket function is used to reset the newTicket state variable to an empty object
            setNewTicket({ title: '', description: '', status: 0, userSid: keycloak.subject });
        } catch (error) {
            setError('Failed to add ticket');
        }
    };

    // api call to let a user update a ticket
    const updateTicket = async (ticket) => {
        try {
            // the config object is used to set the headers for the request, with the jwt token as the bearer token.
            let config = {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${keycloak.token}`
                }
            }
            // the axios.put function is used to make a put request to the backend API, to update a ticket
            const response = await axios.put('/Ticket', ticket, config);
            // the setTickets function is used to set the tickets state variable to the response data, and map through the tickets, 
            //to check if the ticket id is the same as the ticket that was updated
            setTickets(tickets.map((t) => (t.id === ticket.id ? response.data : t)));
            setEditTicket(null);
        } catch (error) {
            setError('Failed to update ticket');
        }
    };

    // function to handle the edit of a ticket
    const handleEdit = (ticket) => {
        setEditTicket(ticket);
    };

    // function to handle the cancel of the edit of a ticket
    const handleCancelEdit = () => {
        setEditTicket(null);
    };

    return (
        <div className='background'>
        <Grid2 sx={{bgcolor: 'rgba(255,255,255,0.7)', backdropFilter:'blur(8px)', padding: '2% 2% 2% 2%', borderRadius: '3%', maxHeight: '100%', marginTop: '2%'}} size={8} wrap='wrap' container={true} className='tickets'>
        <ThemeProvider theme={theme}> {/* ThemeProvider is used to provide the custom theme to the Ticket component */}
            <Grid2 offset={{md: 1}}> {/* is the grid container for the Add New Ticket form */}
                <h2>Add New Ticket</h2>
                <Grid2 marginBottom={4} marginTop={3}>
                    {/* TextField is used to create an input field for the title of the ticket */}
                    <TextField
                        type="text"
                        placeholder="Title"
                        value={newTicket.title}
                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                        multiline
                    />
                </Grid2>
                <Grid2 marginBottom={4}>
                    {/* TextField is used to create an input field for the description of the ticket */}
                    <TextField
                        type="text"
                        placeholder="Description"
                        value={newTicket.description}
                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                        multiline
                    />
                </Grid2>
                <Button variant='contained' color='primary' sx={{color: '#ffffff'}} onClick={addTicket}>Add Ticket</Button>
            </Grid2>
            
            <Grid2 offset={{md: 5}}> {/* is the grid container for the Tickets list */}
            <h1>Tickets</h1>
            {/* if there is an error, it will display the error message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* if the loading state is true, it will display 'Loading tickets...'.*/}
            {loading ? (
                <p>Loading tickets...</p>
            ) : (
                <>
                {/* if the loading state is false. it will check if the amount of tickets is equal to 0, if true
                it will display 'No Tickets Found', if false, it will display the tickets in a list
                */}
                    {tickets.length === 0 ? (
                        <p>No Tickets Found</p>
                    ) : (
                        
                        <ul>
                            {/* map through the tickets, and display the title, description, status, and buttons to edit the ticket */}
                            {tickets.map((ticket) => (
                                <Grid2>
                                <li key={ticket.id} style={noBullets}>
                                    {/* if the editTicket id is the same as the ticket id, it will display the edit form, if not, it will display the ticket */}
                                    {editTicket?.id === ticket.id ? (
                                        /* the edit form */
                                        <div>
                                            <TextField
                                                type="text"
                                                value={editTicket.title}
                                                onChange={(e) => setEditTicket({ ...editTicket, title: e.target.value })}
                                                multiline
                                            />
                                            <TextField
                                                type="text"
                                                value={editTicket.description}
                                                onChange={(e) => setEditTicket({ ...editTicket, description: e.target.value })}
                                                multiline
                                            />
                                            <Select
                                                value={editTicket.status}
                                                onChange={(e) => setEditTicket({ ...editTicket, status: Number(e.target.value) })}
                                            >
                                                <MenuItem value={0}>Open</MenuItem>
                                                <MenuItem value={1}>Work In Progress</MenuItem>
                                                <MenuItem value={2}>Closed Completed</MenuItem>
                                                <MenuItem value={3}>Closed Skipped</MenuItem>
                                            </Select>
                                            <Button variant='contained' sx={{color: '#ffffff', marginLeft: 2, marginRight: 2}} color='primary' onClick={() => updateTicket(editTicket)}>Save</Button>
                                            <Button variant='contained' sx={{color: '#ffffff'}} color='primary' onClick={handleCancelEdit}>Cancel</Button>
                                        </div>
                                    ) : (
                                        /* the ticket */
                                        <div>
                                            <h2>{ticket.title}</h2>
                                            <p>{ticket.description}</p>
                                            <p>Status: {StatusEnum[ticket.status]}</p>
                                            <Button variant='contained' sx={{color: '#ffffff'}} color='primary' onClick={() => handleEdit(ticket)}>Edit</Button>
                                        </div>
                                    )}
                                </li>
                                </Grid2>
                            ))}
                        </ul>
                        
                    )}
                </>
            )}
            </Grid2>
            </ThemeProvider>
        </Grid2>
        </div>
    );
};

export default Tickets;
