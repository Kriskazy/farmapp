import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css";

const Home = () => {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [dbStatus, setDbStatus] = useState("Checking...");

  useEffect(() => {
    const checkConnections = async () => {
      // Check server
      try {
        const response = await axios.get("http://localhost:5000/api/test");
        setServerStatus(response.data.message);
      } catch (error) {
        setServerStatus("Server connection failed");
      }

      // Check database
      try {
        const dbResponse = await axios.get("http://localhost:5000/api/db-test");
        setDbStatus(dbResponse.data.message);
      } catch (error) {
        setDbStatus("Database connection failed");
      }
    };
    checkConnections();
  }, []);

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>🌾 Welcome to Farm Management System</h1>
        <p className="hero-subtitle">
          Streamline your farm operations with modern technology
        </p>
        <div className="status-cards">
          <div className="status-card">
            <strong>Server Status:</strong> {serverStatus}
          </div>
          <div className="status-card">
            <strong>Database Status:</strong> {dbStatus}
          </div>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>🌱 Crop Management</h3>
          <p>Track planting, growth, and harvest schedules</p>
        </div>
        <div className="feature-card">
          <h3>🐄 Livestock Tracking</h3>
          <p>Monitor animal health and breeding records</p>
        </div>
        <div className="feature-card">
          <h3>📋 Task Management</h3>
          <p>Assign and track daily farm activities</p>
        </div>
        <div className="feature-card">
          <h3>📊 Analytics</h3>
          <p>Get insights into your farm's performance</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
