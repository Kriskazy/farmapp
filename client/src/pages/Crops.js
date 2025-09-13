import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Pages.css';

const Crops = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    field: '',
    plantedDate: '',
    expectedHarvestDate: '',
    actualHarvestDate: '',
    area: '',
    areaUnit: 'acres',
    status: 'planted',
    notes: ''
  });

  useEffect(() => {
    fetchCrops();
    fetchStats();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crops');
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
      setMessage('Error fetching crops');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crops/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching crop stats:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingCrop) {
        // Update existing crop
        await axios.put(`http://localhost:5000/api/crops/${editingCrop._id}`, formData);
        setMessage('Crop updated successfully');
      } else {
        // Create new crop
        await axios.post('http://localhost:5000/api/crops', formData);
        setMessage('Crop created successfully');
      }
      
      // Reset form and refresh data
      resetForm();
      fetchCrops();
      fetchStats();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error saving crop';
      setMessage(errorMsg);
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      variety: crop.variety || '',
      field: crop.field,
      plantedDate: crop.plantedDate.split('T')[0],
      expectedHarvestDate: crop.expectedHarvestDate.split('T')[0],
      actualHarvestDate: crop.actualHarvestDate ? crop.actualHarvestDate.split('T')[0] : '',
      area: crop.area,
      areaUnit: crop.areaUnit,
      status: crop.status,
      notes: crop.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (cropId, cropName) => {
    if (window.confirm(`Are you sure you want to delete ${cropName}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/crops/${cropId}`);
        setMessage('Crop deleted successfully');
        fetchCrops();
        fetchStats();
      } catch (error) {
        setMessage('Error deleting crop');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      variety: '',
      field: '',
      plantedDate: '',
      expectedHarvestDate: '',
      actualHarvestDate: '',
      area: '',
      areaUnit: 'acres',
      status: 'planted',
      notes: ''
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      planted: 'status-planted',
      growing: 'status-growing',
      ready: 'status-ready',
      harvested: 'status-harvested',
      failed: 'status-failed'
    };
    
    return <span className={`status-badge ${statusColors[status]}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading crops...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="crops-header">
        <h1>🌱 Crop Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Crop'}
        </button>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {/* Crop Statistics */}
      {stats && (
        <div className="crop-stats">
          <div className="stat-card">
            <h3>Total Crops</h3>
            <div className="stat-number">{stats.totalCrops}</div>
          </div>
          <div className="stat-card">
            <h3>Growing</h3>
            <div className="stat-number">{stats.growingCrops}</div>
          </div>
          <div className="stat-card">
            <h3>Ready to Harvest</h3>
            <div className="stat-number">{stats.readyCrops}</div>
          </div>
          <div className="stat-card">
            <h3>Harvested</h3>
            <div className="stat-number">{stats.harvestedCrops}</div>
          </div>
        </div>
      )}

      {/* Add/Edit Crop Form */}
      {showForm && (
        <div className="crop-form-container">
          <h3>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</h3>
          <form onSubmit={handleSubmit} className="crop-form">
            <div className="form-row">
              <div className="form-group">
                <label>Crop Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Tomatoes, Corn, Wheat"
                  required
                />
              </div>
              <div className="form-group">
                <label>Variety</label>
                <input
                  type="text"
                  name="variety"
                  value={formData.variety}
                  onChange={handleInputChange}
                  placeholder="e.g., Cherry, Sweet Corn"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Field Location *</label>
                <input
                  type="text"
                  name="field"
                  value={formData.field}
                  onChange={handleInputChange}
                  placeholder="e.g., North Field, Greenhouse A"
                  required
                />
              </div>
              <div className="form-group">
                <label>Area *</label>
                <div className="area-input">
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0.1"
                    required
                  />
                  <select
                    name="areaUnit"
                    value={formData.areaUnit}
                    onChange={handleInputChange}
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Planted Date *</label>
                <input
                  type="date"
                  name="plantedDate"
                  value={formData.plantedDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Expected Harvest Date *</label>
                <input
                  type="date"
                  name="expectedHarvestDate"
                  value={formData.expectedHarvestDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="planted">Planted</option>
                  <option value="growing">Growing</option>
                  <option value="ready">Ready to Harvest</option>
                  <option value="harvested">Harvested</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Actual Harvest Date</label>
                <input
                  type="date"
                  name="actualHarvestDate"
                  value={formData.actualHarvestDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes about this crop..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingCrop ? 'Update Crop' : 'Add Crop'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Crops List */}
      <div className="crops-list">
        {crops.length === 0 ? (
          <div className="content-placeholder">
            <p>No crops added yet. Click "Add New Crop" to get started!</p>
          </div>
        ) : (
          <div className="crops-grid">
            {crops.map((crop) => (
              <div key={crop._id} className="crop-card">
                <div className="crop-header">
                  <h3>{crop.name}</h3>
                  {getStatusBadge(crop.status)}
                </div>
                
                {crop.variety && (
                  <p className="crop-variety">Variety: {crop.variety}</p>
                )}
                
                <div className="crop-details">
                  <p><strong>Field:</strong> {crop.field}</p>
                  <p><strong>Area:</strong> {crop.area} {crop.areaUnit}</p>
                  <p><strong>Planted:</strong> {new Date(crop.plantedDate).toLocaleDateString()}</p>
                  <p><strong>Expected Harvest:</strong> {new Date(crop.expectedHarvestDate).toLocaleDateString()}</p>
                  {crop.actualHarvestDate && (
                    <p><strong>Harvested:</strong> {new Date(crop.actualHarvestDate).toLocaleDateString()}</p>
                  )}
                </div>

                {crop.notes && (
                  <div className="crop-notes">
                    <p><strong>Notes:</strong> {crop.notes}</p>
                  </div>
                )}

                <div className="crop-meta">
                  <p>Added by: {crop.createdBy?.name || 'Unknown'}</p>
                  <p>Created: {new Date(crop.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="crop-actions">
                  <button 
                    onClick={() => handleEdit(crop)}
                    className="btn-small btn-secondary"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(crop._id, crop.name)}
                    className="btn-small btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Crops;