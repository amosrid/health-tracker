import React from 'react';
import { Line } from 'react-chartjs-2';
// ...existing code...

const BMIProgressChart = ({ bmiData }) => {
  // Sort data by date ascending (oldest to newest)
  const sortedData = [...bmiData].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  const chartData = {
    labels: sortedData.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        // ...existing code...
        data: sortedData.map(item => item.bmi),
        // ...existing code...
      }
    ]
  };

  // ...existing code...

  return (
    <div className="chart-container">
      <h3>BMI Progress</h3>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default BMIProgressChart;
