import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Pages.css';
import { API_URL } from '../config';

const Livestock = () => {
  const { user } = useAuth();
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLivestock, setEditingLivestock] = useState(null);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: '',
  });

  const [formData, setFormData] = useState({
    tagNumber: '',
    name: '',
    type: 'cattle',
    breed: '',
    gender: 'female',
    birthDate: '',
    weight: '',
    weightUnit: 'kg',
    healthStatus: 'healthy',
    location: '',
    notes: '',
  });

  useEffect(() => {
    fetchLivestock();
    fetchStats();
  }, [filters]);

  const fetchLivestock = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.location) queryParams.append('location', filters.location);

      const response = await axios.get(
        `${API_URL}/api/livestock?${queryParams.toString()}`
      );
      setLivestock(response.data);
    } catch (error) {
      console.error('Error fetching livestock:', error);
      setMessage('Error fetching livestock');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/livestock/stats/overview`
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching livestock stats:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingLivestock) {
        // Update existing livestock
        await axios.put(
          `${API_URL}/api/livestock/${editingLivestock._id}`,
          formData
        );
        setMessage('Animal updated successfully');
      } else {
        // Create new livestock
        await axios.post(`${API_URL}/api/livestock`, formData);
        setMessage('Animal added successfully');
      }

      // Reset form and refresh data
      resetForm();
      fetchLivestock();
      fetchStats();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error saving animal';
      setMessage(errorMsg);
    }
  };

  const handleEdit = (animal) => {
    setEditingLivestock(animal);
    setFormData({
      tagNumber: animal.tagNumber,
      name: animal.name || '',
      type: animal.type,
      breed: animal.breed || '',
      gender: animal.gender,
      birthDate: animal.birthDate ? animal.birthDate.split('T')[0] : '',
      weight: animal.weight || '',
      weightUnit: animal.weightUnit,
      healthStatus: animal.healthStatus,
      location: animal.location || '',
      notes: animal.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (animalId, tagNumber) => {
    if (
      window.confirm(`Are you sure you want to delete animal ${tagNumber}?`)
    ) {
      try {
        await axios.delete(`${API_URL}/api/livestock/${animalId}`);
        setMessage('Animal deleted successfully');
        fetchLivestock();
        fetchStats();
      } catch (error) {
        setMessage('Error deleting animal');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tagNumber: '',
      name: '',
      type: 'cattle',
      breed: '',
      gender: 'female',
      birthDate: '',
      weight: '',
      weightUnit: 'kg',
      healthStatus: 'healthy',
      location: '',
      notes: '',
    });
    setEditingLivestock(null);
    setShowForm(false);
  };

  const getHealthBadge = (status) => {
    const statusColors = {
      healthy: 'health-healthy',
      sick: 'health-sick',
      injured: 'health-injured',
      quarantine: 'health-quarantine',
      deceased: 'health-deceased',
    };

    return (
      <span className={`health-badge ${statusColors[status]}`}>{status}</span>
    );
  };

  const getAnimalIcon = (type) => {
    const icons = {
      cattle: '🐄',
      sheep: '🐑',
      goat: '🐐',
      pig: '🐷',
      chicken: '🐓',
      duck: '🦆',
      horse: '🐴',
      other: '🐾',
    };
    return icons[type] || '🐾';
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    return age > 0
      ? `${age} year${age > 1 ? 's' : ''} old`
      : 'Less than 1 year';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading livestock...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="livestock-header">
        <h1>🐄 Livestock Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Animal'}
        </button>
      </div>

      {message && (
        <div
          className={
            message.includes('Error') ? 'error-message' : 'success-message'
          }
        >
          {message}
        </div>
      )}

      {/* Livestock Statistics */}
      {stats && (
        <div className="livestock-stats">
          <div className="stat-card">
            <h3>Total Animals</h3>
            <div className="stat-number">{stats.totalLivestock}</div>
          </div>
          <div className="stat-card">
            <h3>Healthy</h3>
            <div className="stat-number">{stats.healthyAnimals}</div>
          </div>
          <div className="stat-card">
            <h3>Need Attention</h3>
            <div className="stat-number">{stats.sickAnimals}</div>
          </div>
          <div className="stat-card">
            <h3>Types</h3>
            <div className="stat-detail">
              {stats.typeBreakdown.map((type) => (
                <div key={type._id}>
                  {getAnimalIcon(type._id)} {type._id}: {type.count}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="livestock-filters">
        <div className="filter-group">
          <label>Filter by Type:</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="cattle">Cattle</option>
            <option value="sheep">Sheep</option>
            <option value="goat">Goat</option>
            <option value="pig">Pig</option>
            <option value="chicken">Chicken</option>
            <option value="duck">Duck</option>
            <option value="horse">Horse</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Filter by Health:</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="sick">Sick</option>
            <option value="injured">Injured</option>
            <option value="quarantine">Quarantine</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Filter by Location:</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Enter location..."
          />
        </div>
      </div>

      {/* Add/Edit Livestock Form */}
      {showForm && (
        <div className="livestock-form-container">
          <h3>{editingLivestock ? 'Edit Animal' : 'Add New Animal'}</h3>
          <form onSubmit={handleSubmit} className="livestock-form">
            <div className="form-row">
              <div className="form-group">
                <label>Tag Number *</label>
                <input
                  type="text"
                  name="tagNumber"
                  value={formData.tagNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., C001, S042"
                  required
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Animal name (optional)"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="cattle">Cattle</option>
                  <option value="sheep">Sheep</option>
                  <option value="goat">Goat</option>
                  <option value="pig">Pig</option>
                  <option value="chicken">Chicken</option>
                  <option value="duck">Duck</option>
                  <option value="horse">Horse</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Breed</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="e.g., Holstein, Angus"
                />
              </div>
              <div className="form-group">
                <label>Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Weight</label>
                <div className="weight-input">
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.1"
                    min="0"
                  />
                  <select
                    name="weightUnit"
                    value={formData.weightUnit}
                    onChange={handleInputChange}
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Health Status</label>
                <select
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleInputChange}
                >
                  <option value="healthy">Healthy</option>
                  <option value="sick">Sick</option>
                  <option value="injured">Injured</option>
                  <option value="quarantine">Quarantine</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Pasture A, Barn 2, Pen 15"
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes about this animal..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingLivestock ? 'Update Animal' : 'Add Animal'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Livestock List */}
      <div className="livestock-list">
        {livestock.length === 0 ? (
          <div className="content-placeholder">
            <p>No animals added yet. Click "Add New Animal" to get started!</p>
          </div>
        ) : (
          <div className="livestock-grid">
            {livestock.map((animal) => (
              <div key={animal._id} className="livestock-card">
                <div className="livestock-header">
                  <div className="animal-title">
                    <span className="animal-icon">
                      {getAnimalIcon(animal.type)}
                    </span>
                    <h3>{animal.name || animal.tagNumber}</h3>
                  </div>
                  {getHealthBadge(animal.healthStatus)}
                </div>

                <div className="livestock-details">
                  <p>
                    <strong>Age:</strong> {calculateAge(animal.birthDate)}
                  </p>
                  {animal.weight && (
                    <p>
                      <strong>Weight:</strong> {animal.weight}{' '}
                      {animal.weightUnit}
                    </p>
                  )}
                  {animal.location && (
                    <p>
                      <strong>Location:</strong> {animal.location}
                    </p>
                  )}
                </div>

                {animal.notes && (
                  <div className="livestock-notes">
                    <p>
                      <strong>Notes:</strong> {animal.notes}
                    </p>
                  </div>
                )}

                <div className="livestock-meta">
                  <p>Added by: {animal.createdBy?.name || 'Unknown'}</p>
                  <p>
                    Created: {new Date(animal.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="livestock-actions">
                  <button
                    onClick={() => handleEdit(animal)}
                    className="btn-small btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(animal._id, animal.tagNumber)}
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

export default Livestock;
