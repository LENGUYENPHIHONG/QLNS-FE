import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const data = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
    datasets: [
      {
        label: 'Nhân Viên',
        data: [900, 950, 1000, 1050, 1100],
        borderColor: '#3f51b5',
        fill: false,
      },
      {
        label: 'Hợp Đồng',
        data: [30, 35, 40, 45, 50],
        borderColor: '#4caf50',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Quan trọng để điều chỉnh kích thước
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Xu hướng nhân sự',
      },
    },
  };

  return (
    <div style={{ width: '500px', height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
