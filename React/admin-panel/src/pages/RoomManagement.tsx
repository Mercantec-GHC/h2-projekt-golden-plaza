// src/components/RoomManagement.tsx

// Here is all the imports that are needed for this component
import React, { useState, useEffect } from "react";
import { CreateRoomDTO, Room } from "../interfaces/room";
import { RoomType } from "../interfaces/roomtype";
import axios, { AxiosResponse } from "axios";
import {
  Autocomplete,
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
  // Set Axios base URL (optional if API base is the same across the app)
  axios.defaults.baseURL = "https://localhost:7207";

  // rooms, set to an empty array of Room objects
  const [rooms, setRooms] = useState<Room[]>([]);

  // roomTypes, set to an empty array of RoomType objects
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  // facilityOptions, set to an empty array of strings
  const [facilityOptions, setFacilityOptions] = useState<string[]>([]);

  // openDialog, set to false
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // currentRoom, set to an empty object
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>({});

  // isEditing, set to false
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Setting the keycloak context. can be used to access the functions and variables in the KeycloakContext
  const { keycloak } = React.useContext(KeycloakContext);

  // columns, an array of objects that store the field, headerName, width, and renderCell
  const columns: GridColDef[] = [
    // Room Number column
    { field: "roomNumber", headerName: "Room Number", width: 130 },
    // Capacity column
    { field: "capacity", headerName: "Capacity", width: 100 },
    // roomType column
    {
      field: "roomType",
      headerName: "Room Type",
      width: 150,
      valueGetter: (value, row: Room) =>
        capitalize(row?.roomType?.roomTypeName ?? "") || "ERROR",
    },
    // Price Per Night column
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
  }, []);

  useEffect(() => {
    // Extract unique facilities from existing rooms
    const facilitiesSet = new Set<string>();
    rooms.forEach((room) => {
      room.facilities?.forEach((facility) => facilitiesSet.add(facility));
    });
    setFacilityOptions(Array.from(facilitiesSet));
  }, [rooms]);

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
    // Check if user is authenticated, if not, return
    if (keycloak?.authenticated === false) {
      console.error("Unauthorized access");
      axios.defaults.headers.common["Authorization"] = null;
      return;
    } else {
      // Set the Authorization header with the token
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${keycloak?.token}`;
    }
    try {
      const roomData: Room | CreateRoomDTO = {
        id: currentRoom.id || 0, // Exclude 'id' when creating a new room
        capacity: currentRoom.capacity || 0,
        roomTypeId: (currentRoom.roomType as RoomType).id || 0,
        roomNumber: currentRoom.roomNumber || 0,
        pricePerNight: currentRoom.pricePerNight || 0,
        facilities: currentRoom.facilities || [],
      };

      if (isEditing && currentRoom.id) {
        await axios.put(`/api/rooms/${currentRoom.id}`, roomData);
      } else {
        // Change roomData to CreateRoomDTO
        const createRoomData = {
          capacity: currentRoom.capacity || 0,
          roomTypeId: (currentRoom.roomType as RoomType).id || 0,
          roomNumber: currentRoom.roomNumber || 0,
          pricePerNight: currentRoom.pricePerNight || 0,
          facilities: currentRoom.facilities || [],
        };
        await axios.post("/api/rooms", createRoomData);
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
          <Autocomplete
            multiple
            freeSolo
            options={facilityOptions}
            value={currentRoom.facilities || []}
            onChange={(event, newValue) => {
              handleInputChange("facilities", newValue);
            }}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Facilities"
                placeholder="Add facility"
              />
            )}
          />
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
      <Box sx={{ height: 400, width: "100%", backgroundColor: "grey" }}>
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
