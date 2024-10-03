// src/components/BatchImport.tsx

import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Snackbar,
  Alert,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { KeycloakContext } from "../App";

const BatchImport: React.FC = () => {
  // Set the base URL for axios requests
  axios.defaults.baseURL = "https://localhost:7207";

  // State variables for form inputs and feedback
  const [entityType, setEntityType] = useState<string>(""); // Selected entity type
  const [jsonInput, setJsonInput] = useState<string>(""); // JSON data input
  const [fileInput, setFileInput] = useState<File | null>(null); // File input for JSON file
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null); // Feedback message to display
  const [loading, setLoading] = useState<boolean>(false); // Loading state during import
  const [importErrors, setImportErrors] = useState<
    { index: number; error: string }[]
  >([]); // Errors encountered during import

  // Example JSON data for each entity type to assist the user
  const exampleJsonData: { [key: string]: string } = {
    Rooms: JSON.stringify(
      [
        {
          capacity: 2,
          roomTypeId: 1,
          roomNumber: 101,
          pricePerNight: 120.0,
          facilities: ["WiFi", "Air Conditioning"],
        },
      ],
      null,
      2
    ),
    Bookings: JSON.stringify(
      [
        {
          roomId: 1,
          checkIn: "2023-10-01T14:00:00Z",
          checkOut: "2023-10-05T11:00:00Z",
          price: 480.0,
          isReserved: true,
        },
      ],
      null,
      2
    ),
    "Room Types": JSON.stringify(["Deluxe Suite", "Standard Room"], null, 2),
    Tickets: JSON.stringify(
      [
        {
          title: "Broken AC",
          description: "The air conditioning is not working in room 202.",
          status: 0,
        },
      ],
      null,
      2
    ),
  };

  // Access Keycloak authentication context
  const { keycloak } = useContext(KeycloakContext);

  // List of entity types available for import
  const entityTypes = ["Rooms", "Bookings", "Room Types", "Tickets"];

  // Handle changes to the selected entity type
  const handleEntityTypeChange = (value: string) => {
    setEntityType(value); // Update the selected entity type
    setJsonInput(exampleJsonData[value] || ""); // Provide example JSON data for the selected type
  };

  // Handle file input changes when a user selects a file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      setFileInput(file); // Update the file input state
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          setJsonInput(content); // Set the JSON input to the file content
        }
      };
      reader.readAsText(file); // Read the file as text

      // Provide feedback that the file was uploaded successfully
      setFeedback({
        type: "success",
        message: `File ${file.name} uploaded successfully.`,
      });
    }
  };

  // Parse the JSON input provided by the user
  const parseJsonInput = () => {
    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) {
        throw new Error("JSON data must be an array of objects.");
      }
      return data;
    } catch (error: any) {
      throw new Error("Invalid JSON format.");
    }
  };

  // Validate the data according to the selected entity type
  const validateData = (data: any[]) => {
    switch (entityType) {
      case "Rooms":
        return data.every(validateRoom);
      case "Bookings":
        return data.every(validateBooking);
      case "Room Types":
        return data.every(validateRoomType);
      case "Tickets":
        return data.every(validateTicket);
      default:
        return false;
    }
  };

  // Validation function for Room entities
  const validateRoom = (item: any) => {
    return (
      typeof item.capacity === "number" &&
      typeof item.roomTypeId === "number" &&
      typeof item.roomNumber === "number" &&
      typeof item.pricePerNight === "number" &&
      (item.facilities === undefined || Array.isArray(item.facilities))
    );
  };

  // Validation function for Booking entities
  const validateBooking = (item: any) => {
    return (
      typeof item.roomId === "number" &&
      typeof item.checkIn === "string" &&
      typeof item.checkOut === "string" &&
      typeof item.price === "number" &&
      typeof item.isReserved === "boolean"
    );
  };

  // Validation function for Room Type entities
  const validateRoomType = (item: any) => {
    return typeof item === "string";
  };

  // Validation function for Ticket entities
  const validateTicket = (item: any) => {
    return (
      (item.title === undefined || typeof item.title === "string") &&
      (item.description === undefined ||
        typeof item.description === "string") &&
      typeof item.status === "number"
    );
  };

  // Get the appropriate API endpoint based on the entity type
  const getApiEndpoint = (entityType: string) => {
    switch (entityType) {
      case "Rooms":
        return "/api/Rooms";
      case "Bookings":
        return "/api/Booking";
      case "Room Types":
        return "/api/RoomType";
      case "Tickets":
        return "/api/Ticket";
      default:
        throw new Error("Invalid entity type.");
    }
  };

  // Handle the import process when the user clicks the "Import" button
  const handleImport = async () => {
    try {
      // Check if an entity type has been selected
      if (!entityType) {
        setFeedback({
          type: "error",
          message: "Please select an entity type.",
        });
        return;
      }

      // Check if JSON input is provided
      if (!jsonInput.trim()) {
        setFeedback({ type: "error", message: "Please provide JSON data." });
        return;
      }

      setLoading(true); // Set loading state to true
      setImportErrors([]); // Reset any previous import errors

      const data = parseJsonInput(); // Parse the JSON input

      // Validate the data based on the entity type
      if (!validateData(data)) {
        setFeedback({ type: "error", message: "Data validation failed." });
        setLoading(false);
        return;
      }

      const endpoint = getApiEndpoint(entityType); // Get the API endpoint

      // Check if the user is authenticated
      if (!keycloak?.authenticated) {
        console.error("Unauthorized access");
        axios.defaults.headers.common["Authorization"] = null;
        setLoading(false);
        return;
      } else {
        // Set the Authorization header with the Keycloak token
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${keycloak?.token}`;
      }

      let errors = []; // Array to collect any errors during import
      for (let i = 0; i < data.length; i++) {
        try {
          let item = data[i];
          if (entityType === "Room Types") {
            // For Room Types, the API expects a string in the body
            await axios.post(endpoint, JSON.stringify(item), {
              headers: { "Content-Type": "application/json" },
            });
          } else {
            // For other entity types, send the item as JSON
            await axios.post(endpoint, item, {
              headers: { "Content-Type": "application/json" },
            });
          }
        } catch (error: any) {
          errors.push({ index: i + 1, error: error.message }); // Collect errors with item index
        }
      }

      // Provide feedback based on success or errors
      if (errors.length === 0) {
        setFeedback({
          type: "success",
          message: "Data imported successfully.",
        });
        setJsonInput(""); // Clear the JSON input
        setFileInput(null); // Clear the file input
      } else {
        setFeedback({
          type: "error",
          message: `${errors.length} item(s) failed to import.`,
        });
        setImportErrors(errors); // Set import errors to display
      }
    } catch (error: any) {
      setFeedback({
        type: "error",
        message: error.message || "An error occurred during import.",
      });
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "#ffffff", // White background
        minHeight: "100vh",
      }}
    >
      <Toolbar />
      <Typography
        sx={{
          color: "#000000", // Black text
        }}
        variant="h4"
        gutterBottom
      >
        Batch Import
      </Typography>

      {/* Entity Type Selection */}
      <FormControl fullWidth margin="dense">
        <InputLabel>Entity Type</InputLabel>
        <Select
          value={entityType}
          onChange={(e) => handleEntityTypeChange(e.target.value)}
          label="Entity Type"
        >
          {entityTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* JSON Data Input */}
      <TextField
        label="JSON Data"
        multiline
        rows={10}
        fullWidth
        margin="dense"
        variant="outlined"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />

      {/* File Upload Section */}
      <Box sx={{ mt: 2 }}>
        <input
          accept=".json"
          style={{ display: "none" }}
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button variant="outlined" component="span">
            Upload JSON File
          </Button>
        </label>
        {fileInput && <Typography variant="body2">{fileInput.name}</Typography>}
      </Box>

      {/* Import Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleImport}
        sx={{ mt: 2 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        Import
      </Button>

      {/* Display Import Errors if any */}
      {importErrors.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Import Errors:</Typography>
          <ul>
            {importErrors.map((err) => (
              <li key={err.index}>
                Item {err.index}: {err.error}
              </li>
            ))}
          </ul>
        </Box>
      )}

      {/* Feedback Snackbar */}
      <Snackbar
        open={!!feedback}
        autoHideDuration={6000}
        onClose={() => setFeedback(null)}
      >
        {feedback ? (
          <Alert
            onClose={() => setFeedback(null)}
            severity={feedback.type}
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default BatchImport;
