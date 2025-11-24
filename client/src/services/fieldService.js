import axios from 'axios';
import { API_URL } from '../config';

const getFields = async () => {
  const response = await axios.get(`${API_URL}/api/fields`);
  return response.data;
};

const createField = async (fieldData) => {
  const response = await axios.post(`${API_URL}/api/fields`, fieldData);
  return response.data;
};

const updateField = async (id, fieldData) => {
  const response = await axios.put(`${API_URL}/api/fields/${id}`, fieldData);
  return response.data;
};

const deleteField = async (id) => {
  const response = await axios.delete(`${API_URL}/api/fields/${id}`);
  return response.data;
};

const fieldService = {
  getFields,
  createField,
  updateField,
  deleteField,
};

export default fieldService;
