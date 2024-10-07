// src/components/BookingManagement.tsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { KeycloakContext } from "../App";
import { Booking, CreateBookingDTO } from "../interfaces/booking";
import { Room } from "../interfaces/room";
import { RoomType } from "../interfaces/roomtype";

const BookingManagement: React.FC = () => {
  // Set Axios base URL
  axios.defaults.baseURL = "https://localhost:7207";

  // State variables
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { keycloak } = React.useContext(KeycloakContext);

  // DataGrid columns
  const columns: GridColDef[] = [
    { field: "id", headerName: "Booking ID", width: 100 },
    {
      field: "roomNumber",
      headerName: "Room Number",
      width: 130,
      valueGetter: (params, row: Booking) => row.room?.roomNumber || "",
    },
    {
      field: "roomTypeName",
      headerName: "Room Type",
      width: 150,
      valueGetter: (params, row: Booking) =>
        row.room?.roomType?.roomTypeName || "",
    },
    {
      field: "checkIn",
      headerName: "Check-In",
      width: 150,
      valueGetter: (params, row: Booking) => formatDateTime(row.checkIn),
    },
    {
      field: "checkOut",
      headerName: "Check-Out",
      width: 150,
      valueGetter: (params, row: Booking) => formatDateTime(row.checkOut),
    },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "isReserved",
      headerName: "Reserved",
      width: 100,
      valueGetter: (params, row: Booking) => (row.isReserved ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Button
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
          <Button
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all data and link bookings to room and room type
  const fetchData = async () => {
    try {
      // Fetch bookings, rooms, and room types concurrently
      const [bookingsResponse, roomsResponse, roomTypesResponse] =
        await Promise.all([
          axios.get<Booking[]>("/api/Booking"),
          axios.get<Room[]>("/api/Rooms"),
          axios.get<RoomType[]>("/api/RoomType"),
        ]);

      setRooms(roomsResponse.data);
      setRoomTypes(roomTypesResponse.data);

      // Link bookings to room and room type
      const linkedBookings = bookingsResponse.data.map((booking) => {
        const room = roomsResponse.data.find((r) => r.id === booking.roomId);
        const roomType = roomTypesResponse.data.find(
          (rt) => rt.id === room?.roomType.id
        ) || { id: 0, roomTypeName: "Unknown" }; // Provide a default roomType

        return {
          ...booking,
          room: room ? { ...room, roomType } : undefined,
        };
      });

      setBookings(linkedBookings);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle Input Change
  const handleInputChange = (field: keyof Booking, value: any) => {
    setCurrentBooking({
      ...currentBooking,
      [field]: value,
    });
  };

  // Handle Add Booking
  const handleAddClick = () => {
    setCurrentBooking({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Handle Edit Booking
  const handleEditClick = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Handle Close Dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentBooking({});
  };

  // Handle Form Submit
  const handleFormSubmit = async () => {
    // Check if user is authenticated
    if (!keycloak?.authenticated) {
      console.error("Unauthorized access");
      axios.defaults.headers.common["Authorization"] = null;
      return;
    } else {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${keycloak?.token}`;
    }

    try {
      if (isEditing && currentBooking.id) {
        // For updating an existing booking
        const bookingData: Booking = {
          id: currentBooking.id,
          checkIn: currentBooking.checkIn || new Date().toISOString(),
          checkOut: currentBooking.checkOut || new Date().toISOString(),
          price: currentBooking.price || 0,
          isReserved: currentBooking.isReserved || false,
          roomId: currentBooking.roomId || 0,
          userId: currentBooking.userId || null,
        };
        await axios.put(`/api/Booking/${currentBooking.id}`, bookingData);
      } else {
        // For creating a new booking
        const createBookingData: CreateBookingDTO = {
          checkIn: currentBooking.checkIn || new Date().toISOString(),
          checkOut: currentBooking.checkOut || new Date().toISOString(),
          roomTypeId: currentBooking.room?.roomType?.id || 0,
          userId: currentBooking.userId || null,
        };
        await axios.post("/api/Booking", createBookingData);
      }
      // Refresh data after operation
      fetchData();
      handleDialogClose();
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("Unauthorized access");
      } else {
        console.error("Error saving booking:", error);
      }
    }
  };

  // Handle Delete Booking
  const handleDelete = async (id: number) => {
    if (!keycloak?.authenticated) {
      console.error("Unauthorized access");
      axios.defaults.headers.common["Authorization"] = null;
      return;
    } else {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${keycloak?.token}`;
    }
    try {
      await axios.delete(`/api/Booking/${id}`);
      // Refresh data after deletion
      fetchData();
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("Unauthorized access");
      } else {
        console.error("Error deleting booking:", error);
      }
    }
  };

  // Format DateTime
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1); // Months are zero-based
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const padZero = (num: number) => (num < 10 ? `0${num}` : num.toString());

  // Format DateTime for input[type="datetime-local"]
  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1); // Months are zero-based
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Render Dialog
  const renderDialog = () => (
    <Dialog
      open={openDialog}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{isEditing ? "Edit Booking" : "Add Booking"}</DialogTitle>
      <DialogContent>
        {/* Room */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Room</InputLabel>
          <Select
            value={currentBooking.roomId || ""}
            onChange={(e) =>
              handleInputChange("roomId", parseInt(e.target.value as string))
            }
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {`Room ${room.roomNumber} - ${room.roomType?.roomTypeName}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Check-In */}
        <TextField
          margin="dense"
          label="Check-In"
          type="datetime-local"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={
            currentBooking.checkIn
              ? formatDateTimeLocal(currentBooking.checkIn)
              : ""
          }
          onChange={(e) => handleInputChange("checkIn", e.target.value)}
        />
        {/* Check-Out */}
        <TextField
          margin="dense"
          label="Check-Out"
          type="datetime-local"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={
            currentBooking.checkOut
              ? formatDateTimeLocal(currentBooking.checkOut)
              : ""
          }
          onChange={(e) => handleInputChange("checkOut", e.target.value)}
        />
        {/* Price */}
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          value={currentBooking.price || ""}
          onChange={(e) =>
            handleInputChange("price", parseFloat(e.target.value))
          }
        />
        {/* Reserved */}
        <FormControlLabel
          control={
            <Checkbox
              checked={currentBooking.isReserved || false}
              onChange={(e) =>
                handleInputChange("isReserved", e.target.checked)
              }
            />
          }
          label="Reserved"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} color="primary">
          {isEditing ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render Component
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddClick}
        sx={{ mb: 2 }}
      >
        Add Booking
      </Button>
      <Box sx={{ height: 600, width: "100%", backgroundColor: "grey" }}>
        <DataGrid
          rows={bookings}
          columns={columns}
          pageSizeOptions={[10, 20, 50]}
          getRowId={(row) => row.id}
        />
      </Box>
      {renderDialog()}
    </div>
  );
};

export default BookingManagement;
