import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ExpenseChart = ({ expenses }) => {
  if (expenses.length === 0) return <p className="text-center text-gray-600">No data to display.</p>;

  // 📊 Group expenses by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"],
      },
    ],
  };

  // 📊 Group expenses by month
  const monthlyTotals = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + exp.amount;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(monthlyTotals),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  return (
    <div className="mt-6 bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-center text-blue-600 mb-4">📊 Expense Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-center">By Category</h3>
          <Pie data={pieData} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-center">By Month</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
