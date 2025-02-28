import React, { useState, useEffect } from "react";

const ExpenseModal = ({ isOpen, onClose, onSave, expenseToEdit }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount);
      setCategory(expenseToEdit.category);
      setDate(expenseToEdit.date ? expenseToEdit.date.split("T")[0] : ""); // Format date
      setNote(expenseToEdit.note || "");
    } else {
      setAmount("");
      setCategory("");
      setDate("");
      setNote("");
    }
  }, [expenseToEdit, isOpen]); // Reset values when modal opens

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    onSave({ amount: Number(amount), category, date, note, _id: expenseToEdit?._id }); // Pass ID for edits
    onClose(); // Close modal after save
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => e.target.id === "modal-overlay" && onClose()} // Close when clicking outside
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-center mb-4">
          {expenseToEdit ? "✏️ Edit Expense" : "➕ Add Expense"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="number"
            placeholder="Amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {expenseToEdit ? "Save Changes" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
