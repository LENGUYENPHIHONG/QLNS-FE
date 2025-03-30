import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const data = {
    labels: ['Nhân Viên', 'Hợp Đồng', 'Phòng Ban'],
    datasets: [
      {
        label: 'Số lượng',
        data: [1000, 45, 10],
        backgroundColor: ['#3f51b5', '#4caf50', '#f44336'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê nhân sự',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;