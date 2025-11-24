import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

const Crops = () => {
  // const { user } = useAuth();
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
    notes: '',
  });

  useEffect(() => {
    fetchCrops();
    fetchStats();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/crops`);
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
      const response = await axios.get(`${API_URL}/api/crops/stats/overview`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching crop stats:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingCrop) {
        await axios.put(`${API_URL}/api/crops/${editingCrop._id}`, formData);
        setMessage('Crop updated successfully');
      } else {
        await axios.post(`${API_URL}/api/crops`, formData);
        setMessage('Crop created successfully');
      }

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
      actualHarvestDate: crop.actualHarvestDate
        ? crop.actualHarvestDate.split('T')[0]
        : '',
      area: crop.area,
      areaUnit: crop.areaUnit,
      status: crop.status,
      notes: crop.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (cropId, cropName) => {
    if (window.confirm(`Are you sure you want to delete ${cropName}?`)) {
      try {
        await axios.delete(`${API_URL}/api/crops/${cropId}`);
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
      notes: '',
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      planted: 'bg-blue-100 text-blue-700',
      growing: 'bg-green-100 text-green-700',
      ready: 'bg-yellow-100 text-yellow-700',
      harvested: 'bg-slate-100 text-slate-700',
      failed: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
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
          <h1 className="text-3xl font-bold text-slate-800">Crop Management</h1>
          <p className="text-slate-500">Track and manage your fields and harvests</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Crop'}
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
            <p className="text-slate-500 text-sm font-medium">Total Crops</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalCrops}</p>
          </Card>
          <Card className="bg-white border-l-4 border-l-green-500">
            <p className="text-slate-500 text-sm font-medium">Growing</p>
            <p className="text-2xl font-bold text-slate-800">{stats.growingCrops}</p>
          </Card>
          <Card className="bg-white border-l-4 border-l-yellow-500">
            <p className="text-slate-500 text-sm font-medium">Ready</p>
            <p className="text-2xl font-bold text-slate-800">{stats.readyCrops}</p>
          </Card>
          <Card className="bg-white border-l-4 border-l-slate-500">
            <p className="text-slate-500 text-sm font-medium">Harvested</p>
            <p className="text-2xl font-bold text-slate-800">{stats.harvestedCrops}</p>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-bold text-slate-800 mb-6">Area Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.areaBreakdown.map(item => ({ name: item._id, value: item.totalArea }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.areaBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-slate-800 mb-6">Crop Status</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Planted', count: stats.plantedCrops },
                    { name: 'Growing', count: stats.growingCrops },
                    { name: 'Ready', count: stats.readyCrops },
                    { name: 'Harvested', count: stats.harvestedCrops },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="border-t-4 border-t-primary-500">
          <h3 className="text-xl font-bold text-slate-800 mb-6">{editingCrop ? 'Edit Crop' : 'Add New Crop'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Crop Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Tomatoes"
                required
              />
              <Input
                label="Variety"
                name="variety"
                value={formData.variety}
                onChange={handleInputChange}
                placeholder="e.g., Cherry"
              />
              <Input
                label="Field Location *"
                name="field"
                value={formData.field}
                onChange={handleInputChange}
                placeholder="e.g., North Field"
                required
              />
              <div className="flex gap-4">
                <Input
                  label="Area *"
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  step="0.1"
                  min="0.1"
                  required
                  className="flex-1"
                />
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Unit</label>
                  <select
                    name="areaUnit"
                    value={formData.areaUnit}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>
              <Input
                label="Planted Date *"
                type="date"
                name="plantedDate"
                value={formData.plantedDate}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Expected Harvest *"
                type="date"
                name="expectedHarvestDate"
                value={formData.expectedHarvestDate}
                onChange={handleInputChange}
                required
              />
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="planted">Planted</option>
                    <option value="growing">Growing</option>
                    <option value="ready">Ready to Harvest</option>
                    <option value="harvested">Harvested</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <Input
                  label="Actual Harvest Date"
                  type="date"
                  name="actualHarvestDate"
                  value={formData.actualHarvestDate}
                  onChange={handleInputChange}
                />
              </div>
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
                {editingCrop ? 'Update Crop' : 'Add Crop'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <Card key={crop._id} hover className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{crop.name}</h3>
                {crop.variety && <p className="text-sm text-slate-500">{crop.variety}</p>}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                {crop.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-600 flex-grow">
              <div className="flex justify-between">
                <span>📍 Field:</span>
                <span className="font-medium">{crop.field}</span>
              </div>
              <div className="flex justify-between">
                <span>📏 Area:</span>
                <span className="font-medium">{crop.area} {crop.areaUnit}</span>
              </div>
              <div className="flex justify-between">
                <span>📅 Planted:</span>
                <span className="font-medium">{new Date(crop.plantedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>🌾 Harvest:</span>
                <span className="font-medium">{new Date(crop.expectedHarvestDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleEdit(crop)}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(crop._id, crop.name)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
        
        {crops.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="text-4xl mb-3">🌱</div>
            <p className="text-slate-500 font-medium">No crops found. Start by adding one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crops;
