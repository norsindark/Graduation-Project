import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Radio, Typography } from 'antd';
import { ApexOptions } from 'apexcharts';

const { Text } = Typography;

interface ChartProps {
  weeklyStats: any;
  monthlyStats: any;
}

const ChartProfitWeekAndMonth: React.FC<ChartProps> = ({
  weeklyStats,
  monthlyStats,
}) => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [chartData, setChartData] = useState<any>({
    series: [],
    categories: [],
  });

  useEffect(() => {
    if (viewMode === 'week') {
      processWeeklyData();
    } else {
      processMonthlyData();
    }
  }, [viewMode, weeklyStats, monthlyStats]);

  const processWeeklyData = () => {
    const weeks = Object.keys(weeklyStats).sort((a, b) => {
      const [weekA, yearA] = a.split('-').map(Number);
      const [weekB, yearB] = b.split('-').map(Number);
      return yearA !== yearB ? yearA - yearB : weekA - weekB;
    });

    const series = [
      {
        name: 'Revenue',
        data: weeks.map((week) =>
          Object.values(weeklyStats[week]).reduce(
            (sum: number, dish: any) => sum + (dish.totalRevenue || 0),
            0
          )
        ),
      },
      {
        name: 'Cost',
        data: weeks.map((week) =>
          Object.values(weeklyStats[week]).reduce(
            (sum: number, dish: any) => sum + (dish.totalCost || 0),
            0
          )
        ),
      },
      {
        name: 'Profit',
        data: weeks.map((week) =>
          Object.values(weeklyStats[week]).reduce(
            (sum: number, dish: any) => sum + (dish.profit || 0),
            0
          )
        ),
      },
    ];

    setChartData({
      series,
      categories: weeks.map((week) => {
        const [w, y] = week.split('-');
        return `Week ${w.replace('W', '')}/${y}`;
      }),
    });
  };

  const processMonthlyData = () => {
    const months = Object.keys(monthlyStats).sort((a, b) => {
      const [monthA, yearA] = a.split('-').map(Number);
      const [monthB, yearB] = b.split('-').map(Number);
      return yearA !== yearB ? yearA - yearB : monthA - monthB;
    });

    const series = [
      {
        name: 'Revenue',
        data: months.map((month) =>
          Object.values(monthlyStats[month]).reduce(
            (sum: number, dish: any) => sum + (dish.totalRevenue || 0),
            0
          )
        ),
      },
      {
        name: 'Cost',
        data: months.map((month) =>
          Object.values(monthlyStats[month]).reduce(
            (sum: number, dish: any) => sum + (dish.totalCost || 0),
            0
          )
        ),
      },
      {
        name: 'Profit',
        data: months.map((month) =>
          Object.values(monthlyStats[month]).reduce(
            (sum: number, dish: any) => sum + (dish.profit || 0),
            0
          )
        ),
      },
    ];

    setChartData({
      series,
      categories: months.map((month) => {
        const [m, y] = month.split('-');
        return `Month ${m}/${y}`;
      }),
    });
  };

  const options = {
    chart: {
      type: 'line' as const,
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    colors: ['#1890ff', '#ff4d4f', '#52c41a'],
    dataLabels: {
      enabled: true,
      formatter: (value: number) => `${value.toLocaleString()}đ`,
      style: {
        fontSize: '12px',
        colors: ['#000000'],
      },
      offsetY: -20,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: true,
        color: '#78909C',
      },
      axisTicks: {
        show: true,
        color: '#78909C',
      },
      crosshairs: {
        show: true,
        width: 1,
        position: 'back',
        opacity: 0.9,
        stroke: {
          color: '#b6b6b6',
          width: 1,
          dashArray: 0,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${(value / 1000).toFixed(0)}k đ`,
        style: {
          fontSize: '12px',
        },
      },
      title: {
        text: 'Value (VND)',
        style: {
          fontSize: '14px',
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: true,
        color: '#78909C',
      },
      axisTicks: {
        show: true,
        color: '#78909C',
      },
      crosshairs: {
        show: true,
        position: 'back',
        stroke: {
          color: '#b6b6b6',
          width: 1,
          dashArray: 0,
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `${value.toLocaleString()}đ`,
      },
      theme: 'light',
      style: {
        fontSize: '12px',
      },
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'center' as const,
      fontSize: '14px',
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      },
    },
    grid: {
      show: true,
      borderColor: '#f1f1f1',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true,
          opacity: 0.1,
        },
      },
      yaxis: {
        lines: {
          show: true,
          opacity: 0.3,
          color: '#90A4AE',
          dashArray: 0,
        },
      },
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5,
      },
      column: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    markers: {
      size: 6,
      hover: {
        size: 8,
      },
    },
  };

  return (
    <Card
      bordered={false}
      className="criclebox h-full"
      title={
        <div className="flex items-center justify-between">
          <Text strong>Revenue - Cost - Profit Chart</Text>
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="week">By Week</Radio.Button>
            <Radio.Button value="month">By Month</Radio.Button>
          </Radio.Group>
        </div>
      }
    >
      <ReactApexChart
        options={options as ApexOptions}
        series={chartData.series}
        type="line"
        height={350}
      />
    </Card>
  );
};

export default ChartProfitWeekAndMonth;
