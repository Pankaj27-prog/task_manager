import React, { useState, useEffect } from "react";
import axios from "axios";
import "./inputPage.css";

function InputPage({ onNavigateToInitial }) {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get("/entries");
      setTodos(res.data.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/submit", {
        task,
        description,
      });
      setTask("");
      setDescription("");
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Error saving todo");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/entries/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditTask(todo.task);
    setEditDescription(todo.description);
  };

  const submitEdit = async (id) => {
    try {
      await axios.put(`/entries/${id}`, {
        task: editTask,
        description: editDescription,
      });
      setEditId(null);
      fetchData();
    } catch (err) {
      alert("Update failed");
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await axios.put(`/entries/${todo._id}`, {
        task: todo.task,
        description: todo.description,
        completed: !todo.completed,
      });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setTask("");
    setDescription("");
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-content">
          <h2 className="topbar-title">📝 Todo Manager</h2>
          <button 
            className="back-button"
            onClick={onNavigateToInitial}
          >
            ← Back to Home
          </button>
        </div>
      </header>
  
      <div className="input-container">
        <div className="todo-list">
          
          {todos.length === 0 ? (
            <p className="no-todos">No todos yet. Add your first todo below!</p>
          ) : (
            <ul className="todo-card-list">
              {todos.map((todo) => (
                <li key={todo._id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-card-left">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo)}
                      className="todo-checkbox"
                    />
                  </div>
                  <div className="todo-card-main">
                    {editId === todo._id ? (
                      <div className="edit-form">
                        <input
                          value={editTask}
                          onChange={(e) => setEditTask(e.target.value)}
                          className="edit-input"
                          placeholder="Task"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="edit-textarea"
                          placeholder="Description"
                          rows="2"
                        />
                        <div className="edit-buttons">
                          <button onClick={() => submitEdit(todo._id)}>Save</button>
                          <button onClick={() => setEditId(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="todo-title-row">
                          <span className={`todo-task ${todo.completed ? 'completed-text' : ''}`}>{todo.task}</span>
                        </div>
                        {todo.description && (
                          <div className={`todo-description ${todo.completed ? 'completed-text' : ''}`}>{todo.description}</div>
                        )}
                        <div className="todo-date">Created: {formatDate(todo.createdAt)}</div>
                      </>
                    )}
                  </div>
                  <div className="todo-card-actions">
                    {editId !== todo._id && (
                      <>
                        <button className="icon-btn" title="Edit" onClick={() => startEdit(todo)}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                        </button>
                        <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(todo._id)}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button className="fab" onClick={openModal} title="Add New Todo">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      </button>

      {/* Modal for Add Todo */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} title="Close">&times;</button>
            <form onSubmit={handleSubmit} className="modal-form">
              <h3>Add New Todo</h3>
              <div className="form-group">
                <label htmlFor="modalTaskInput">Task:</label>
                <input
                  id="modalTaskInput"
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Enter task ..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="modalDescriptionInput">Description:</label>
                <textarea
                  id="modalDescriptionInput"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description (optional) ..."
                  rows="3"
                />
              </div>
              <button type="submit" className="modal-add-btn">Add Todo</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default InputPage;
