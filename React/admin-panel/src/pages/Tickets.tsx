import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { KeycloakContext } from "../App";
import {
  Button,
  MenuItem,
  TextField,
  Select,
  Container,
  Grid2,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material";

// Enum for ticket status
enum StatusEnum {
  Open = 0,
  WorkInProgress = 1,
  ClosedCompleted = 2,
  ClosedSkipped = 3,
}
const theme = createTheme({
  palette: {
    primary: {
      main: "#B49B63",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});

const noBullets = {
  listStyleType: "none",
};

const Tickets = () => {
  interface Ticket {
    id: number;
    title: string;
    description: string;
    status: number;
  }

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    status: 0,
  });
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state
  const { keycloak } = useContext(KeycloakContext);

  // Set Axios base URL (optional if API base is the same across the app)
  axios.defaults.baseURL = "https://localhost:7207/api"; // Adjust to your backend's actual URL

  // Fetch all tickets when the component mounts
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      let config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${keycloak?.token || ""}`,
        },
      };
      const response = await axios.get("/Ticket", config);
      setTickets(response.data);
    } catch (error) {
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const addTicket = async () => {
    try {
      let config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${keycloak?.token || ""}`,
        },
      };
      const response = await axios.post("/Ticket", newTicket, config);
      setTickets([...tickets, response.data]);
      setNewTicket({ title: "", description: "", status: 0 });
    } catch (error) {
      setError("Failed to add ticket");
    }
  };

  const updateTicket = async (ticket: Ticket) => {
    try {
      let config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${keycloak?.token || ""}`,
        },
      };
      const response = await axios.put("/Ticket", ticket, config);
      setTickets(tickets.map((t) => (t.id === ticket.id ? response.data : t)));
      setEditTicket(null);
    } catch (error) {
      setError("Failed to update ticket");
    }
  };

  const deleteTicket = async (id: number) => {
    try {
      let config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${keycloak?.token || ""}`,
        },
      };
      await axios.delete(`/Ticket/${id}`, config);
      setTickets(tickets.filter((t) => t.id !== id));
    } catch (error) {
      setError("Failed to delete ticket");
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditTicket(ticket);
  };

  const handleCancelEdit = () => {
    setEditTicket(null);
  };

  return (
    <div className="background">
      <Grid2
        sx={{
          bgcolor: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          padding: "2% 2% 2% 2%",
          borderRadius: "3%",
          maxHeight: "100%",
          marginTop: "2%",
          maxWidth: "100%",
          width: "70%",
        }}
        wrap="wrap"
        container={true}
        className="tickets"
      >
        <ThemeProvider theme={theme}>
          <Grid2 offset={{ md: 1 }}>
            <h2>Add New Ticket</h2>
            <Grid2 marginBottom={4} marginTop={3}>
              <TextField
                type="text"
                placeholder="Title"
                value={newTicket.title}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, title: e.target.value })
                }
                multiline
              />
            </Grid2>
            <Grid2 marginBottom={4}>
              <TextField
                type="text"
                placeholder="Description"
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
                multiline
              />
            </Grid2>
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "#ffffff" }}
              onClick={addTicket}
            >
              Add Ticket
            </Button>
          </Grid2>

          <Grid2 offset={{ md: 5 }}>
            <h1>Tickets</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading ? (
              <p>Loading tickets...</p>
            ) : (
              <>
                {tickets.length === 0 ? (
                  <p>No Tickets Found</p>
                ) : (
                  <ul>
                    {tickets.map((ticket) => (
                      <Grid2>
                        <li key={ticket.id} style={noBullets}>
                          {editTicket?.id === ticket.id ? (
                            <div>
                              <TextField
                                type="text"
                                value={editTicket.title}
                                onChange={(e) =>
                                  setEditTicket({
                                    ...editTicket,
                                    title: e.target.value,
                                  })
                                }
                                multiline
                              />
                              <TextField
                                type="text"
                                value={editTicket.description}
                                onChange={(e) =>
                                  setEditTicket({
                                    ...editTicket,
                                    description: e.target.value,
                                  })
                                }
                                multiline
                              />
                              <Select
                                value={editTicket.status}
                                onChange={(e) =>
                                  setEditTicket({
                                    ...editTicket,
                                    status: Number(e.target.value),
                                  })
                                }
                              >
                                <MenuItem value={0}>Open</MenuItem>
                                <MenuItem value={1}>Work In Progress</MenuItem>
                                <MenuItem value={2}>Closed Completed</MenuItem>
                                <MenuItem value={3}>Closed Skipped</MenuItem>
                              </Select>
                              <Button
                                variant="contained"
                                sx={{
                                  color: "#ffffff",
                                  marginLeft: 2,
                                  marginRight: 2,
                                }}
                                color="primary"
                                onClick={() => updateTicket(editTicket)}
                              >
                                Save
                              </Button>
                              <Button
                                variant="contained"
                                sx={{ color: "#ffffff" }}
                                color="primary"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <h2>{ticket.title}</h2>
                              <p>{ticket.description}</p>
                              <p>Status: {StatusEnum[ticket.status]}</p>
                              <Button
                                variant="contained"
                                sx={{ color: "#ffffff" }}
                                color="primary"
                                onClick={() => handleEdit(ticket)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                sx={{ color: "#ffffff" }}
                                color="primary"
                                onClick={() => deleteTicket(ticket.id)}
                              >
                                Delete
                              </Button>
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
