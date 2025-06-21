import React from "react";
import "./initialPage.css";

function InitialPage({ onNavigateToInput }) {
  return (
    <div className="initial-container">
      <div className="initial-content">
        <div className="hero-section">
          <h1 className="main-title">Welcome to Todo Manager</h1>
          <p className="subtitle">
            A simple and efficient way to manage your tasks and stay organized
          </p>
        </div>
        
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Create Tasks</h3>
            <p>Add new tasks with descriptions to keep track of your work</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Mark Complete</h3>
            <p>Check off completed tasks to track your progress</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✏️</div>
            <h3>Edit & Update</h3>
            <p>Modify existing tasks and descriptions anytime</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🗑️</div>
            <h3>Delete Tasks</h3>
            <p>Remove completed or unnecessary tasks</p>
          </div>
        </div>
        
        <div className="cta-section">
          <button 
            className="cta-button"
            onClick={onNavigateToInput}
          >
            Start Managing Tasks
          </button>
        </div>
      </div>
    </div>
  );
}

export default InitialPage; 