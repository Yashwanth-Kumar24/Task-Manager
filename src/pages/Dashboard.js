import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({  title: '', description: '', status: 'Pending' });
    const [editTask, setEditTask] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            alert('No user logged in. Redirecting to login...');
            navigate('/'); // Redirect to login page
            return;
        }

    axios.get(`http://localhost:5000/tasks/${userId}`)
      .then(response => { setTasks(response.data)})
      .catch(error => console.error('Error fetching tasks', error));
      
  }, [userId]);

  const handleCreateTask = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/tasks/${userId}`, {
        userId,
        ...newTask,
      });

      setTasks([...tasks, response.data]); // Add new task to list
      setShowForm(false); // Hide form after adding
      setNewTask({ title: '', description: '', status: 'Pending' }); // Reset form
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setNewTask({ title: task.title, description: task.description, status: task.status });
    setShowForm(true);
  };

  const handleUpdateTask = async () => {
    try {
      await axios.patch(`http://localhost:5000/tasks/${userId}`, newTask);
      
      // Update tasks list
      setTasks(tasks.map(task => (task._id === editTask._id ? { ...task, ...newTask } : task)));

      setShowForm(false);
      setEditTask(null);
      setNewTask({ title: '', description: '', status: 'Pending' });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = '/'; // Redirect to login
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      
      // Remove from state
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleClose = async() =>{
    setShowForm(false);
    setNewTask({ title: '', description: '', status: 'Pending' })
  };

  return (
    <div className="body">
        <div className="glass-container">
            <h2>Welcome, {localStorage.getItem('userName')}</h2>

            <button className="create-btn" onClick={() => { setShowForm(true); setEditTask(null); }}> Create Task</button>
            
            
            {showForm && (
                <div className="task">
                    <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                    <input type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                    <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    
                    {editTask ? (
                        <button className="update-btn" onClick={handleUpdateTask}>Update</button>
                    ) : (
                        <button className="create-btn" onClick={handleCreateTask}>Create</button>
                        
                    )}
                    <button className="close-btn" onClick={handleClose}>Close</button>
                </div>
            )}

            <div className="task-list">
                {tasks.length === 0 ? (
                    <p className="no-tasks">No tasks found.</p>
                ) : (
                    tasks.map(task => (
                        <div key={task._id} className="task-item">
                            <strong>{task.title}</strong>
                            {task.description} <br />
                            ({task.status})
                            <div>
                                <button className="edit-btn" onClick={() => handleEditTask(task)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
    </div>
);
};

export default Dashboard;
