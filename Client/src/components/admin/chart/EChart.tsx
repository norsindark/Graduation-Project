import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Row, Col, Typography } from 'antd';
import { callGetDishSalesStatistics } from '../../../services/serverApi';
import eChart from './configs/eChart';

const EChart: React.FC = () => {
  const { Title, Paragraph } = Typography;
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
        const response = await callGetDishSalesStatistics();
        const salesData = response.data;

        // Chuyển đổi dữ liệu cho chart
        const categories = Object.keys(salesData);
        const data = Object.values(salesData);

        setChartData({
          categories,
          data: data as number[],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    ...eChart.options,
    xaxis: {
      ...eChart.options.xaxis,
      categories: chartData.categories,
    },
  };

  const chartSeries = [
    {
      name: 'Number of sales',
      data: chartData.data,
    },
  ];

  const items = [
    {
      Title: chartData.data.reduce((a, b) => a + b, 0),
      user: 'Total number of dishes sold',
    },
    {
      Title: chartData.categories.length,
      user: 'Number of dish types',
    },
    {
      Title: Math.max(...chartData.data),
      user: 'Most sold dish',
    },
    {
      Title: Math.min(...chartData.data),
      user: 'Least sold dish',
    },
  ];

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
          {items.map((v, index) => (
            <Col xs={6} xl={6} sm={6} md={6} key={index}>
              <div className="chart-visitor-count">
                <Title level={4}>{v.Title}</Title>
                <span>{v.user}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default EChart;
