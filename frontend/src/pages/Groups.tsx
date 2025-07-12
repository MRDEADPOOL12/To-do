import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import axios from "axios";

interface Group {
  id: string;
  name: string;
  description?: string;
}

export const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      setName(selectedGroup.name);
      setDescription(selectedGroup.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleAddGroup = () => {
    setSelectedGroup(undefined);
    setIsFormOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedGroup(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name,
        description: description || undefined,
      };

      if (selectedGroup) {
        await axios.put(`http://localhost:3001/api/groups/${selectedGroup.id}`, data);
      } else {
        await axios.post("http://localhost:3001/api/groups", data);
      }

      handleCloseForm();
      fetchGroups();
    } catch (error) {
      console.error("Error saving group:", error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/groups/${groupId}`);
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Task Groups
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddGroup}
          >
            Add Group
          </Button>
        </Box>
        <Paper>
          <List>
            {groups.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body1" color="textSecondary" align="center">
                      No groups yet. Create your first group!
                    </Typography>
                  }
                />
              </ListItem>
            ) : (
              groups.map((group) => (
                <ListItem key={group.id}>
                  <ListItemText
                    primary={group.name}
                    secondary={group.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditGroup(group)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Box>

      <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedGroup ? "Edit Group" : "New Group"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedGroup ? "Save" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}; 