import { Pie } from 'react-chartjs-2';
import useAsync from '../../hooks/useAsync';
import OrderServices from '../../services/OrderServices';
// import { logDOM } from '@testing-library/react';

const RevenueChart = () => {
  const { data } = useAsync(OrderServices.getBestSellerProductChart);
// console.log('vRevenueChart data' , data);
  const PieOption = {
    data: {
      datasets: [
        {
          data: data?.bestSellingProducts?.map((selling) => selling.count),
          backgroundColor: ['#68CC58', '#3B82F6', '#F97316', '#0EA5E9'],
          label: 'Dataset 1',
        },
      ],
      labels: data?.bestSellingProducts?.map((selling) => selling.name),
    },
    options: {
      responsive: true,
      cutoutPercentage: 80,
    },
    legend: {
      display: false,
    },
  };

  return (
    <div>
      <Pie {...PieOption} className="chart" />
    </div>
  );
};

export default RevenueChart;



