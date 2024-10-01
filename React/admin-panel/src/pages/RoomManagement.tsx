// src/components/RoomManagement.tsx

import React, { useState, useEffect } from "react";
import { Room, RoomType } from "../interfaces/room";
import axios, { AxiosResponse } from "axios";
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
  capitalize,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { KeycloakContext } from "../App";

const RoomManagement: React.FC = () => {
  axios.defaults.baseURL = "https://localhost:7207";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [facilityOptions, setFacilityOptions] = useState<string[]>([]);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { keycloak } = React.useContext(KeycloakContext);

  const columns: GridColDef[] = [
    { field: "roomNumber", headerName: "Room Number", width: 130 },
    { field: "capacity", headerName: "Capacity", width: 100 },
    {
      field: "roomType",
      headerName: "Room Type",
      width: 150,
      valueGetter: (value, row: Room) =>
        capitalize(row.roomType?.roomTypeName) || "ERROR",
    },
    { field: "pricePerNight", headerName: "Price Per Night", width: 150 },
    {
      field: "facilities",
      headerName: "Facilities",
      width: 200,
      valueGetter: (value, row: Room) => row.facilities?.join(", ") || "",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
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

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
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
      const response = await axios.get<RoomType[]>("/api/RoomType");
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
      // Optionally, define static room types if the API call fails
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
    if (keycloak?.authenticated === false) {
      console.error("Unauthorized access");
      axios.defaults.headers.common["Authorization"] = null;
      return;
    } else {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${keycloak?.token}`;
    }
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
    } catch (error: any) {
      // If the error is a 401 Unauthorized handle it here
      if (error.response.status === 401) {
        console.error("Unauthorized access");
      } else {
        console.error("Error saving room:", error);
      }
    }
  };

  // Handle Delete Room
  const handleDelete = async (id: number) => {
    if (keycloak?.authenticated === false) {
      console.error("Unauthorized access");
      axios.defaults.headers.common["Authorization"] = null;
      return;
    } else {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${keycloak?.token}`;
    }
    try {
      await axios.delete(`/api/rooms/${id}`);
      fetchRooms();
    } catch (error: any) {
      if (error.response.status === 401) {
        console.error("Unauthorized access");
      } else {
        console.error("Error deleting room:", error);
      }
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
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rooms}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      {renderDialog()}
    </div>
  );
};

export default RoomManagement;
