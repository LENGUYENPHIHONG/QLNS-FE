import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
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
        text: 'Tỷ lệ nhân sự',
      },
    },
  };

  return (
      <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
        <Pie data={data} options={options} />
      </div>
    );
};

export default PieChart;