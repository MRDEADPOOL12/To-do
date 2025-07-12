import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { TaskList } from "../components/TaskList";
import { TaskForm } from "../components/TaskForm";

interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  group?: {
    id: string;
    name: string;
  };
}

export const Tasks: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const handleAddTask = () => {
    setSelectedTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTask(undefined);
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
            Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </Box>
        <Paper sx={{ p: 0 }}>
          <TaskList onEditTask={handleEditTask} />
        </Paper>
      </Box>
      <TaskForm
        open={isFormOpen}
        onClose={handleCloseForm}
        task={selectedTask}
      />
    </Container>
  );
}; 