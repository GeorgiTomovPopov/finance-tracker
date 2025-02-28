import "../index.css";  // ✅ Import Tailwind styles
import "../output.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExpenseModal from "../components/ExpenseModal";
import ExpenseChart from "../components/ExpenseChart";

const BACKEND_URL = "https://finance-tracker-bhwn.onrender.com";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(`${BACKEND_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [navigate]);

  useEffect(() => {
    let updatedExpenses = [...expenses];

    // Filter by category
    if (filterCategory) {
      updatedExpenses = updatedExpenses.filter((expense) => expense.category === filterCategory);
    }

    // Sorting logic
    if (sortBy === "amount") {
      updatedExpenses.sort((a, b) => b.amount - a.amount);
    } else {
      updatedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredExpenses(updatedExpenses);
  }, [expenses, filterCategory, sortBy]);

  const handleSaveExpense = async (expenseData) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      let updatedExpenses;
      
      if (expenseData._id) {
        // ✅ Edit existing expense
        const res = await axios.put(`${BACKEND_URL}/expenses/${expenseData._id}`, expenseData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updatedExpenses = expenses.map((exp) => (exp._id === expenseData._id ? res.data : exp));
      } else {
        // ✅ Add new expense
        const res = await axios.post(`${BACKEND_URL}/expenses`, expenseData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updatedExpenses = [...expenses, res.data];
      }
  
      setExpenses(updatedExpenses);
      setIsModalOpen(false); // ✅ Close modal after saving
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };
  
  
  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      await axios.delete(`${BACKEND_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6"><span role="img" aria-label="money">💰</span> My Expenses</h1>

        {/* Filters Section */}
        <div className="flex justify-between mb-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Categories</option>
            {Array.from(new Set(expenses.map((exp) => exp.category))).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        {/* Add Expense Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setExpenseToEdit(null);
              setIsModalOpen(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            ➕ Add Expense
          </button>
        </div>

        {/* Expenses Table */}
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-gray-600">No expenses found.</p>
        ) : (
          <div className="max-h-80 overflow-y-scroll border border-gray-300 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense._id} className="odd:bg-gray-100 even:bg-white hover:bg-gray-200 transition">
                  <td className="p-3 border text-center font-semibold">${expense.amount}</td>
                  <td className="p-3 border text-center">{expense.category}</td>
                  <td className="p-3 border text-center">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        setExpenseToEdit(expense);
                        setIsModalOpen(true);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button className="text-red-500" onClick={() => handleDeleteExpense(expense._id)}>
                      🗑️ Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        
        {/* Charts Section */}
        <ExpenseChart expenses={filteredExpenses} />

      </div>

      <ExpenseModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleSaveExpense} // ✅ Now it's actually used
  expenseToEdit={expenseToEdit}
/>

    </div>
  );
};

export default Dashboard;
