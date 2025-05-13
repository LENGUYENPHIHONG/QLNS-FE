import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

/**
 * PieChart component
 * @param {{data: { name: string; value: number; }[]}} props
 */
const PieChart = ({ data }) => {
  const labels = data.map(item => item.name);
  const values = data.map(item => item.value);
  // define a set of colors for slices
  const colors = [
    '#3f51b5', '#4caf50', '#f44336', '#ff9800', '#9c27b0',
    '#009688', '#e91e63', '#00bcd4', '#cddc39', '#795548'
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Số lượng',
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Thống kê' }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 400, margin: 'auto' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
