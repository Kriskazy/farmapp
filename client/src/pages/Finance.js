import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    monthlyData: {},
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/finance`),
        axios.get(`${API_URL}/api/finance/stats`),
      ]);

      setTransactions(transactionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
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
      await axios.post(`${API_URL}/api/finance`, formData);
      setMessage('Transaction added successfully');
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      setMessage('Error adding transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`${API_URL}/api/finance/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const chartData = Object.keys(stats.monthlyData).map((month) => ({
    name: month,
    Income: stats.monthlyData[month].income,
    Expense: stats.monthlyData[month].expense,
  }));

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
            Financial Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track your farm's income and expenses
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Transaction'}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none">
          <p className="text-emerald-100 text-sm font-medium mb-1">Total Income</p>
          <p className="text-3xl font-bold">${stats.income.toLocaleString()}</p>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none">
          <p className="text-red-100 text-sm font-medium mb-1">Total Expenses</p>
          <p className="text-3xl font-bold">${stats.expense.toLocaleString()}</p>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-l-4 border-l-blue-500">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
            Net Balance
          </p>
          <p
            className={`text-3xl font-bold ${
              stats.balance >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            ${stats.balance.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
          Income vs Expense
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Add Transaction Form */}
      {showForm && (
        <Card className="border-t-4 border-t-primary-500">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Add New Transaction
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                  Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={handleInputChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Income</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={handleInputChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Expense</span>
                  </label>
                </div>
              </div>

              <Input
                label="Amount ($)"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                min="0"
                step="0.01"
              />

              <Input
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Seeds, Sales, Labor"
                required
              />

              <Input
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />

              <div className="md:col-span-2">
                <Input
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Details about this transaction..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Transaction</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Transaction List */}
      <Card>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
          Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Description</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium text-right">Amount</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              {transactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-white">
                    {transaction.description || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {transaction.category}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-bold ${
                      transaction.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}$
                    {transaction.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No transactions found. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Finance;
