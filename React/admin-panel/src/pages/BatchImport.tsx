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
  axios.defaults.baseURL = "https://localhost:7207";

  const [entityType, setEntityType] = useState<string>("");
  const [jsonInput, setJsonInput] = useState<string>("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [importErrors, setImportErrors] = useState<
    { index: number; error: string }[]
  >([]);

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

  const { keycloak } = React.useContext(KeycloakContext);

  const entityTypes = ["Rooms", "Bookings", "Room Types", "Tickets"];

  const handleEntityTypeChange = (value: string) => {
    setEntityType(value);
    setJsonInput(exampleJsonData[value] || "");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInput(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          setJsonInput(content);
        }
      };
      reader.readAsText(file);

      // Give feedback for when the file is uploaded
      setFeedback({
        type: "success",
        message: `File ${file.name} uploaded successfully.`,
      });
    }
  };

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

  const validateRoom = (item: any) => {
    return (
      typeof item.capacity === "number" &&
      typeof item.roomTypeId === "number" &&
      typeof item.roomNumber === "number" &&
      typeof item.pricePerNight === "number" &&
      (item.facilities === undefined || Array.isArray(item.facilities))
    );
  };

  const validateBooking = (item: any) => {
    return (
      typeof item.roomId === "number" &&
      typeof item.checkIn === "string" &&
      typeof item.checkOut === "string" &&
      typeof item.price === "number" &&
      typeof item.isReserved === "boolean"
    );
  };

  const validateRoomType = (item: any) => {
    return typeof item === "string";
  };

  const validateTicket = (item: any) => {
    return (
      (item.title === undefined || typeof item.title === "string") &&
      (item.description === undefined ||
        typeof item.description === "string") &&
      typeof item.status === "number"
    );
  };

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

  const handleImport = async () => {
    try {
      if (!entityType) {
        setFeedback({
          type: "error",
          message: "Please select an entity type.",
        });
        return;
      }

      if (!jsonInput.trim()) {
        setFeedback({ type: "error", message: "Please provide JSON data." });
        return;
      }

      setLoading(true);
      setImportErrors([]);

      const data = parseJsonInput();

      if (!validateData(data)) {
        setFeedback({ type: "error", message: "Data validation failed." });
        setLoading(false);
        return;
      }

      const endpoint = getApiEndpoint(entityType);

      if (!keycloak?.authenticated) {
        console.error("Unauthorized access");
        axios.defaults.headers.common["Authorization"] = null;
        setLoading(false);
        return;
      } else {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${keycloak?.token}`;
      }

      let errors = [];
      for (let i = 0; i < data.length; i++) {
        try {
          let item = data[i];
          if (entityType === "Room Types") {
            // For Room Types, the API expects a string in the body
            await axios.post(endpoint, JSON.stringify(item), {
              headers: { "Content-Type": "application/json" },
            });
          } else {
            await axios.post(endpoint, item, {
              headers: { "Content-Type": "application/json" },
            });
          }
        } catch (error: any) {
          errors.push({ index: i + 1, error: error.message });
        }
      }

      if (errors.length === 0) {
        setFeedback({
          type: "success",
          message: "Data imported successfully.",
        });
        setJsonInput("");
        setFileInput(null);
      } else {
        setFeedback({
          type: "error",
          message: `${errors.length} item(s) failed to import.`,
        });
        setImportErrors(errors);
      }
    } catch (error: any) {
      setFeedback({
        type: "error",
        message: error.message || "An error occurred during import.",
      });
    } finally {
      setLoading(false);
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
