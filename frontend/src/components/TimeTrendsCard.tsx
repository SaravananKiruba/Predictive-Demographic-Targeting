import React from 'react';
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TimeTrendsProps {
  data: {
    months: string[];
    values: number[];
    trend_analysis: string;
  };
}

const TimeTrendsCard: React.FC<TimeTrendsProps> = ({ data }) => {
  const { months, values, trend_analysis } = data;
  const cardBg = useColorModeValue('white', 'gray.700');
  const chartColor = useColorModeValue('rgba(49, 130, 206, 1)', 'rgba(99, 179, 237, 1)');
  const chartAreaColor = useColorModeValue('rgba(49, 130, 206, 0.2)', 'rgba(99, 179, 237, 0.2)');
  
  // Determine if trend is positive
  const isTrendPositive = values[values.length - 1] > values[0];
  
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Patient Interest',
        data: values,
        fill: true,
        backgroundColor: chartAreaColor,
        borderColor: chartColor,
        borderWidth: 2,
        pointBackgroundColor: chartColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: chartColor,
        tension: 0.4,
      },
    ],
  };
  
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.1)'),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  return (
    <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" height="100%">
      <Heading as="h2" size="md" mb={4} color="brand.600">
        Time-Based Trends (Last 12 Months)
      </Heading>
      
      <Box height="250px" mb={4}>
        <Line data={chartData} options={chartOptions} />
      </Box>
      
      <Box>
        <Text fontWeight="medium" mb={2} color={isTrendPositive ? 'green.500' : 'red.500'}>
          {isTrendPositive ? '↗ Upward Trend' : '↘ Downward Trend'}
        </Text>
        <Text fontSize="sm">{trend_analysis}</Text>
      </Box>
    </Box>
  );
};

export default TimeTrendsCard;
