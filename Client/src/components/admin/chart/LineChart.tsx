import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Typography } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import {
  callGetDishSalesRevenueProfitByWeek,
  callGetDishSalesRevenueProfitByMonth,
} from '../../../services/serverApi';

interface ChartData {
  dates: string[];
  revenue: number[];
  profit: number[];
}

// Thêm cấu hình mặc định cho chart
const defaultChartOptions = {
  chart: {
    type: 'area',
    height: 350,
    zoom: {
      enabled: false,
    },
  },
  colors: ['#1890ff', '#52c41a'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  grid: {
    show: true,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  legend: {
    show: true,
  },
  xaxis: {
    type: 'category',
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (value: number) => `${value.toLocaleString()}đ`,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 90, 100],
    },
  },
};

const LineChart: React.FC = () => {
  const { Title, Paragraph } = Typography;
  const [weeklyData, setWeeklyData] = useState<ChartData>({
    dates: [],
    revenue: [],
    profit: [],
  });
  const [monthlyData, setMonthlyData] = useState<ChartData>({
    dates: [],
    revenue: [],
    profit: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weeklyResponse, monthlyResponse] = await Promise.all([
          callGetDishSalesRevenueProfitByWeek(),
          callGetDishSalesRevenueProfitByMonth(),
        ]);

        // Xử lý dữ liệu theo tuần
        const weeklyStats = weeklyResponse.data;
        const weeklyChartData = {
          dates: Object.keys(weeklyStats),
          revenue: [] as number[],
          profit: [] as number[],
        };

        weeklyChartData.dates.forEach((week) => {
          const weekRevenue = Object.values(weeklyStats[week]).reduce(
            (sum, dish: any) => sum + (dish.totalRevenue || 0),
            0
          );
          const weekProfit = Object.values(weeklyStats[week]).reduce(
            (sum, dish: any) => sum + (dish.profit || 0),
            0
          );
          weeklyChartData.revenue.push(weekRevenue as number);
          weeklyChartData.profit.push(weekProfit as number);
        });

        setWeeklyData(weeklyChartData);

        // Xử lý dữ liệu theo tháng
        const monthlyStats = monthlyResponse.data;
        const monthlyChartData = {
          dates: Object.keys(monthlyStats),
          revenue: [] as number[],
          profit: [] as number[],
        };

        monthlyChartData.dates.forEach((month) => {
          const monthRevenue = Object.values(monthlyStats[month]).reduce(
            (sum, dish: any) => sum + (dish.totalRevenue || 0),
            0
          );
          const monthProfit = Object.values(monthlyStats[month]).reduce(
            (sum, dish: any) => sum + (dish.profit || 0),
            0
          );
          monthlyChartData.revenue.push(monthRevenue as number);
          monthlyChartData.profit.push(monthProfit as number);
        });

        setMonthlyData(monthlyChartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    ...defaultChartOptions, // Thay thế lineChart.options bằng defaultChartOptions
    xaxis: {
      ...defaultChartOptions.xaxis,
      categories: monthlyData.dates.map((month) => {
        const [m, y] = month.split('-');
        return `Month ${m}/${y}`;
      }),
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value.toLocaleString()}đ`,
      },
    },
  };

  const chartSeries = [
    {
      name: 'Revenue',
      data: monthlyData.revenue,
    },
    {
      name: 'Profit',
      data: monthlyData.profit,
    },
  ];

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={4}>Revenue and Profit Chart</Title>
          <Paragraph className="lastweek">
            Total revenue:{' '}
            {monthlyData.revenue.reduce((a, b) => a + b, 0).toLocaleString()}đ
          </Paragraph>
          <Paragraph className="lastweek">
            Total profit:{' '}
            {monthlyData.profit.reduce((a, b) => a + b, 0).toLocaleString()}đ
          </Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Revenue</li>
            <li>{<MinusOutlined />} Profit</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={chartOptions as any}
        series={chartSeries}
        type="area"
        height={350}
        width={'100%'}
      />
    </>
  );
};

export default LineChart;
