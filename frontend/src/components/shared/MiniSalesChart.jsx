// src/components/shared/MiniSalesChart.js
import { Pie } from 'react-chartjs-2';

export default function MiniSalesChart({ salesData }) {
  const data = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [salesData.completed, salesData.pending, salesData.cancelled],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      },
    ],
  };

  return <Pie data={data} />;
}