import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import fieldService from '../services/fieldService';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const FieldMap = () => {
  const [fields, setFields] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newFieldPoints, setNewFieldPoints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    crop: '',
    color: '#10b981',
    description: '',
  });

  const position = [51.505, -0.09]; // Default center

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const data = await fieldService.getFields();
      setFields(data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (isDrawing) {
          setNewFieldPoints([...newFieldPoints, [e.latlng.lat, e.latlng.lng]]);
        }
      },
    });
    return null;
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setNewFieldPoints([]);
    setShowForm(false);
  };

  const handleFinishDrawing = () => {
    if (newFieldPoints.length < 3) {
      alert('A field must have at least 3 points.');
      return;
    }
    setIsDrawing(false);
    setShowForm(true);
  };

  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setNewFieldPoints([]);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newField = {
        ...formData,
        boundaries: newFieldPoints,
        area: 0, // Calculate area if needed
      };
      await fieldService.createField(newField);
      setShowForm(false);
      setNewFieldPoints([]);
      setFormData({ name: '', crop: '', color: '#10b981', description: '' });
      fetchFields();
    } catch (error) {
      console.error('Error creating field:', error);
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Field Map</h1>
        <div className="space-x-4">
          {!isDrawing && !showForm && (
            <button
              onClick={handleStartDrawing}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
            >
              + Add Field
            </button>
          )}
          {isDrawing && (
            <>
              <span className="text-slate-600 mr-2">Click on map to add points</span>
              <button
                onClick={handleFinishDrawing}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
              >
                Finish Drawing
              </button>
              <button
                onClick={handleCancelDrawing}
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents />
            
            {/* Existing Fields */}
            {fields.map((field) => (
              <Polygon
                key={field._id}
                positions={field.boundaries}
                pathOptions={{ color: field.color }}
              >
                <Popup>
                  <div className="font-semibold">{field.name}</div>
                  <div className="text-sm text-slate-600">{field.description}</div>
                </Popup>
              </Polygon>
            ))}

            {/* Field being drawn */}
            {newFieldPoints.length > 0 && (
              <>
                <Polygon positions={newFieldPoints} pathOptions={{ color: '#3b82f6', dashArray: '5, 5' }} />
                {newFieldPoints.map((point, idx) => (
                  <Marker key={idx} position={point} />
                ))}
              </>
            )}
          </MapContainer>
        </div>

        {/* Field Details Form */}
        {showForm && (
          <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4">New Field Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Field Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., North Pasture"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-slate-600 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Save Field
                </button>
                <button
                  type="button"
                  onClick={handleCancelDrawing}
                  className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldMap;
