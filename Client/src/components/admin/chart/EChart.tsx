import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Row, Col, Typography, Spin } from 'antd';
import { callGetDishSalesStatistics } from '../../../services/serverApi';
import eChart from './configs/eChart';

const EChart: React.FC = () => {
  const { Title } = Typography;
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{
    categories: string[];
    data: number[];
  }>({
    categories: [],
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await callGetDishSalesStatistics();
        const salesData = response.data;

        const categories = Object.keys(salesData);
        const data = Object.values(salesData) as number[];

        setChartData({
          categories,
          data,
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    ...eChart.options,
    xaxis: {
      ...eChart.options.xaxis,
      categories: chartData.categories,
      labels: {
        ...eChart.options.xaxis?.labels,
        style: {
          colors: Array(chartData.categories.length).fill('#fff'),
        },
      },
    },
    yaxis: {
      ...eChart.options.yaxis,
      labels: {
        ...(eChart.options.yaxis as ApexYAxis).labels,
        style: {
          colors: Array(10).fill('#fff'), // Số lượng nhãn trục y
        },
      },
    },
  };

  const chartSeries = [
    {
      name: 'Number of sales',
      data: chartData.data,
      color: '#fff',
    },
  ];

  const items = [
    {
      title: chartData.data.reduce((a, b) => a + b, 0),
      description: 'Total number of dishes sold',
    },
    {
      title: chartData.categories.length,
      description: 'Number of dish types',
    },
    {
      title: Math.max(...(chartData.data.length ? chartData.data : [0])),
      description: 'Most sold dish',
    },
    {
      title: Math.min(...(chartData.data.length ? chartData.data : [0])),
      description: 'Least sold dish',
    },
  ];

  if (loading) {
    return <Spin size="large" className="center-spin" />;
  }

  return (
    <>
      <div id="chart">
        <ReactApexChart
          className="bar-chart"
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={220}
        />
      </div>
      <div className="chart-vistior">
        <Title level={5}>Sales Statistics</Title>
        <Row gutter={[16, 16]}>
          {items.map((item, index) => (
            <Col xs={6} xl={6} sm={6} md={6} key={index}>
              <div className="chart-visitor-count">
                <Title level={4}>{item.title}</Title>
                <span>{item.description}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default EChart;
