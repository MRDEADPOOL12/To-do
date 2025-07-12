import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: {
    id: string;
    title: string;
    description?: string;
    deadline?: string;
    group?: {
      id: string;
      name: string;
    };
  };
}

interface Group {
  id: string;
  name: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, task }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [groupId, setGroupId] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDeadline(task.deadline ? new Date(task.deadline) : null);
      setGroupId(task.group?.id || "");
    } else {
      setTitle("");
      setDescription("");
      setDeadline(null);
      setGroupId("");
    }
  }, [task]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title,
        description: description || undefined,
        deadline: deadline?.toISOString(),
        groupId: groupId || undefined,
      };

      if (task) {
        await axios.put(`http://localhost:3001/api/tasks/${task.id}`, data);
      } else {
        await axios.post("http://localhost:3001/api/tasks", data);
      }

      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Deadline"
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Group</InputLabel>
              <Select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                label="Group"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {task ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 