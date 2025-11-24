import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'seeds',
    quantity: '',
    unit: 'kg',
    threshold: '10',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/inventory`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
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
      if (editingItem) {
        await axios.put(`${API_URL}/api/inventory/${editingItem._id}`, formData);
        setMessage('Item updated successfully');
      } else {
        await axios.post(`${API_URL}/api/inventory`, formData);
        setMessage('Item added successfully');
      }
      resetForm();
      fetchItems();
    } catch (error) {
      setMessage('Error saving item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_URL}/api/inventory/${id}`);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      threshold: item.threshold,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'seeds',
      quantity: '',
      unit: 'kg',
      threshold: '10',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      seeds: '🌱',
      fertilizer: '🧪',
      feed: '🌽',
      equipment: '🚜',
      other: '📦',
    };
    return icons[category] || '📦';
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Inventory Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track your seeds, feed, and equipment
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Item'}
        </Button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.includes('Error')
              ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
              : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
          }`}
        >
          {message}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-t-4 border-t-primary-500">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Item Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Tomato Seeds"
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="seeds">Seeds</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="feed">Feed</option>
                  <option value="equipment">Equipment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-4">
                <Input
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                  min="0"
                  className="flex-1"
                />
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="bags">bags</option>
                    <option value="liters">liters</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              <Input
                label="Low Stock Threshold"
                type="number"
                name="threshold"
                value={formData.threshold}
                onChange={handleInputChange}
                placeholder="Alert when below..."
                required
                min="0"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item._id} hover className="flex flex-col h-full relative overflow-hidden">
            {item.quantity <= item.threshold && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                Low Stock
              </div>
            )}
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl">
                {getCategoryIcon(item.category)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                  {item.category}
                </p>
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-800 dark:text-white">
                  {item.quantity}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">
                  {item.unit}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.quantity <= item.threshold
                      ? 'bg-red-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      (item.quantity / (item.threshold * 3)) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Threshold: {item.threshold} {item.unit}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
        {items.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Your inventory is empty. Add items to start tracking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
