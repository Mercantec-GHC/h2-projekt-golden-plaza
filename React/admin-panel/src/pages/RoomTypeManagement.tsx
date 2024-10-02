// src/components/RoomTypeManagement.tsx

import React, { useState, useEffect } from "react";
import { RoomType } from "../interfaces/roomtype";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Toolbar,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const RoomTypeManagement: React.FC = () => {
  axios.defaults.baseURL = "https://localhost:7207";

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentRoomType, setCurrentRoomType] = useState<Partial<RoomType>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get<RoomType[]>("/api/RoomType");
      console.log("Room Types:", response.data);
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RoomType, value: any) => {
    setCurrentRoomType({
      ...currentRoomType,
      [field]: value,
    });
  };

  const handleAddClick = () => {
    setCurrentRoomType({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEditClick = (roomType: RoomType) => {
    setCurrentRoomType(roomType);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/RoomType/${id}`);
      fetchRoomTypes();
    } catch (error) {
      console.error("Error deleting room type:", error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentRoomType({});
  };

  const handleFormSubmit = async () => {
    try {
      const roomTypeName = currentRoomType.roomTypeName?.trim();
      if (!roomTypeName) {
        alert("Room Type Name is required");
        return;
      }

      const requestBody = JSON.stringify(roomTypeName);

      if (isEditing && currentRoomType.id !== undefined) {
        await axios.put(`/api/RoomType/${currentRoomType.id}`, requestBody, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await axios.post("/api/RoomType", requestBody, {
          headers: { "Content-Type": "application/json" },
        });
      }
      fetchRoomTypes();
      handleDialogClose();
    } catch (error) {
      console.error("Error saving room type:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "roomTypeName", headerName: "Room Type Name", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
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

  const renderDialog = () => (
    <Dialog
      open={openDialog}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isEditing ? "Edit Room Type" : "Add Room Type"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Room Type Name"
          fullWidth
          value={currentRoomType.roomTypeName || ""}
          onChange={(e) => handleInputChange("roomTypeName", e.target.value)}
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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddClick}
        sx={{ mb: 2 }}
      >
        Add Room Type
      </Button>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={roomTypes}
          columns={columns}
          pageSizeOptions={[10, 20, 50]}
          getRowId={(row) => row.id}
          loading={loading}
        />
      </Box>
      {renderDialog()}
    </Box>
  );
};

export default RoomTypeManagement;
