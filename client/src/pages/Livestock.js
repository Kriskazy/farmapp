import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';

const Livestock = () => {
  const { } = useAuth();
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

  const fetchLivestock = useCallback(async () => {
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
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/livestock/stats/overview`
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching livestock stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchLivestock();
    fetchStats();
  }, [fetchLivestock, fetchStats]);

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
        await axios.put(
          `${API_URL}/api/livestock/${editingLivestock._id}`,
          formData
        );
        setMessage('Animal updated successfully');
      } else {
        await axios.post(`${API_URL}/api/livestock`, formData);
        setMessage('Animal added successfully');
      }

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

  const getHealthColor = (status) => {
    const colors = {
      healthy: 'bg-green-100 text-green-700',
      sick: 'bg-red-100 text-red-700',
      injured: 'bg-orange-100 text-orange-700',
      quarantine: 'bg-yellow-100 text-yellow-700',
      deceased: 'bg-slate-200 text-slate-600',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
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
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Livestock Management</h1>
          <p className="text-slate-500">Monitor health and track your herd</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Animal'}
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-l-4 border-l-blue-500">
            <p className="text-slate-500 text-sm font-medium">Total Animals</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalLivestock}</p>
          </Card>
          <Card className="bg-white border-l-4 border-l-green-500">
            <p className="text-slate-500 text-sm font-medium">Healthy</p>
            <p className="text-2xl font-bold text-slate-800">{stats.healthyAnimals}</p>
          </Card>
          <Card className="bg-white border-l-4 border-l-red-500">
            <p className="text-slate-500 text-sm font-medium">Need Attention</p>
            <p className="text-2xl font-bold text-slate-800">{stats.sickAnimals}</p>
          </Card>
          <Card className="bg-white border-l-4 border-l-purple-500">
            <p className="text-slate-500 text-sm font-medium">Types</p>
            <div className="flex gap-2 mt-1 overflow-x-auto">
              {stats.typeBreakdown.slice(0, 3).map((type) => (
                <span key={type._id} className="text-xs bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">
                  {getAnimalIcon(type._id)} {type.count}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-slate-50 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Filter by Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="input-field"
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Filter by Health</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="healthy">Healthy</option>
              <option value="sick">Sick</option>
              <option value="injured">Injured</option>
              <option value="quarantine">Quarantine</option>
            </select>
          </div>
          <Input
            label="Filter by Location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Search location..."
          />
        </div>
      </Card>

      {/* Form */}
      {showForm && (
        <Card className="border-t-4 border-t-primary-500">
          <h3 className="text-xl font-bold text-slate-800 mb-6">{editingLivestock ? 'Edit Animal' : 'Add New Animal'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Tag Number *"
                name="tagNumber"
                value={formData.tagNumber}
                onChange={handleInputChange}
                placeholder="e.g., C001"
                required
              />
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Animal name (optional)"
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="input-field"
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <Input
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="e.g., Holstein"
              />

              <Input
                label="Birth Date"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
              />

              <div className="flex gap-4">
                <Input
                  label="Weight"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="0.1"
                  min="0"
                  className="flex-1"
                />
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Unit</label>
                  <select
                    name="weightUnit"
                    value={formData.weightUnit}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Health Status</label>
                <select
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="healthy">Healthy</option>
                  <option value="sick">Sick</option>
                  <option value="injured">Injured</option>
                  <option value="quarantine">Quarantine</option>
                </select>
              </div>

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Barn 1"
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="input-field"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingLivestock ? 'Update Animal' : 'Add Animal'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Livestock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {livestock.map((animal) => (
          <Card key={animal._id} hover className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-slate-100 p-2 rounded-xl">{getAnimalIcon(animal.type)}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{animal.name || animal.tagNumber}</h3>
                  <p className="text-sm text-slate-500 font-mono">{animal.tagNumber}</p>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthColor(animal.healthStatus)}`}>
                {animal.healthStatus}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-600 flex-grow">
              <div className="flex justify-between">
                <span>🎂 Age:</span>
                <span className="font-medium">{calculateAge(animal.birthDate)}</span>
              </div>
              {animal.breed && (
                <div className="flex justify-between">
                  <span>🧬 Breed:</span>
                  <span className="font-medium">{animal.breed}</span>
                </div>
              )}
              {animal.weight && (
                <div className="flex justify-between">
                  <span>⚖️ Weight:</span>
                  <span className="font-medium">{animal.weight} {animal.weightUnit}</span>
                </div>
              )}
              {animal.location && (
                <div className="flex justify-between">
                  <span>📍 Location:</span>
                  <span className="font-medium">{animal.location}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleEdit(animal)}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(animal._id, animal.tagNumber)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
        
        {livestock.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="text-4xl mb-3">🐄</div>
            <p className="text-slate-500 font-medium">No animals found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Livestock;
