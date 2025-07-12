import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Paper,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import axios from "axios";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  deadline?: string;
  group?: {
    id: string;
    name: string;
  };
}

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      await axios.patch(`http://localhost:3001/api/tasks/${taskId}/toggle`);
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Paper sx={{ mt: 2 }}>
      <List>
        {tasks.length === 0 ? (
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body1" color="textSecondary" align="center">
                  No tasks yet. Create your first task!
                </Typography>
              }
            />
          </ListItem>
        ) : (
          tasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                textDecoration: task.completed ? "line-through" : "none",
                opacity: task.completed ? 0.7 : 1,
              }}
            >
              <Checkbox
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />
              <ListItemText
                primary={task.title}
                secondary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {task.description}
                    {task.group && (
                      <Chip
                        label={task.group.name}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                    {task.deadline && (
                      <Tooltip title="Deadline">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "text.secondary",
                          }}
                        >
                          <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {format(new Date(task.deadline), "MMM d, yyyy")}
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEditTask(task)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
}; 