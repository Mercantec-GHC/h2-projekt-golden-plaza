// src/components/RoomManagement.tsx

import React, { useState, useEffect } from "react";
import { Room, RoomType } from "../interfaces/room";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  Chip,
  Box,
} from "@mui/material";

const RoomManagement: React.FC = () => {
  axios.defaults.baseURL = "https://localhost:7207";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [facilityOptions, setFacilityOptions] = useState<string[]>([]);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchRooms();
    // fetchRoomTypes();
    // fetchFacilities();
  }, []);

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      const response = await axios.get<Room[]>("/api/Rooms");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Fetch Room Types
  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get<RoomType[]>("/api/roomTypes");
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
      // Optionally, define static room types if the API call fails
      setRoomTypes([
        { id: 1, roomTypeName: "Single" },
        { id: 2, roomTypeName: "Double" },
        { id: 3, roomTypeName: "Suite" },
      ]);
    }
  };

  // Fetch Facility Options
  const fetchFacilities = async () => {
    try {
      const response = await axios.get<string[]>("/api/facilities");
      setFacilityOptions(response.data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      // Optionally, define static facilities if the API call fails
      setFacilityOptions([
        "WiFi",
        "TV",
        "Air Conditioning",
        "Mini Bar",
        "Balcony",
      ]);
    }
  };

  // Handle Input Change
  const handleInputChange = (field: keyof Room, value: any) => {
    if (field === "roomType") {
      setCurrentRoom({
        ...currentRoom,
        roomType:
          roomTypes.find((rt) => rt.id === value) || currentRoom.roomType,
      });
    } else if (field === "facilities") {
      setCurrentRoom({
        ...currentRoom,
        facilities: value,
      });
    } else {
      setCurrentRoom({
        ...currentRoom,
        [field]: value,
      });
    }
  };

  // Handle Add Room
  const handleAddClick = () => {
    setCurrentRoom({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Handle Edit Room
  const handleEditClick = (room: Room) => {
    setCurrentRoom(room);
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Handle Close Dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentRoom({});
  };

  // Handle Form Submit
  const handleFormSubmit = async () => {
    try {
      const roomData: Room = {
        id: currentRoom.id || 0, // Exclude 'id' when creating a new room
        capacity: currentRoom.capacity || 0,
        roomType: currentRoom.roomType as RoomType,
        roomNumber: currentRoom.roomNumber || 0,
        pricePerNight: currentRoom.pricePerNight || 0,
        facilities: currentRoom.facilities || [],
      };

      if (isEditing && currentRoom.id) {
        await axios.put(`/api/rooms/${currentRoom.id}`, roomData);
      } else {
        await axios.post("/api/rooms", roomData);
      }
      fetchRooms();
      handleDialogClose();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  // Handle Delete Room
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/rooms/${id}`);
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  // Render Dialog
  const renderDialog = () => (
    <Dialog
      open={openDialog}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{isEditing ? "Edit Room" : "Add Room"}</DialogTitle>
      <DialogContent>
        {/* Room Number */}
        <TextField
          autoFocus
          margin="dense"
          label="Room Number"
          type="number"
          fullWidth
          value={currentRoom.roomNumber || ""}
          onChange={(e) =>
            handleInputChange("roomNumber", parseInt(e.target.value))
          }
        />
        {/* Capacity */}
        <TextField
          margin="dense"
          label="Capacity"
          type="number"
          fullWidth
          value={currentRoom.capacity || ""}
          onChange={(e) =>
            handleInputChange("capacity", parseInt(e.target.value))
          }
        />
        {/* Room Type */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Room Type</InputLabel>
          <Select
            value={currentRoom.roomType?.id || ""}
            onChange={(e) =>
              handleInputChange("roomType", parseInt(e.target.value as string))
            }
          >
            {roomTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.roomTypeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Price Per Night */}
        <TextField
          margin="dense"
          label="Price Per Night"
          type="number"
          fullWidth
          value={currentRoom.pricePerNight || ""}
          onChange={(e) =>
            handleInputChange("pricePerNight", parseFloat(e.target.value))
          }
        />
        {/* Facilities */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Facilities</InputLabel>
          <Select
            multiple
            value={currentRoom.facilities || []}
            onChange={(e) =>
              handleInputChange("facilities", e.target.value as string[])
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} sx={{ m: 0.5 }} />
                ))}
              </Box>
            )}
          >
            {facilityOptions.map((facility) => (
              <MenuItem key={facility} value={facility}>
                {facility}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        Add Room
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Room Number</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Room Type</TableCell>
            <TableCell>Price Per Night</TableCell>
            <TableCell>Facilities</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>{room.roomNumber}</TableCell>
              <TableCell>{room.capacity}</TableCell>
              <TableCell>{room.roomType.roomTypeName}</TableCell>
              <TableCell>{room.pricePerNight}</TableCell>
              <TableCell>{room.facilities?.join(", ") || ""}</TableCell>
              <TableCell>
                <Button color="primary" onClick={() => handleEditClick(room)}>
                  Edit
                </Button>
                <Button color="secondary" onClick={() => handleDelete(room.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {renderDialog()}
    </div>
  );
};

export default RoomManagement;
