import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Typography, Spin } from 'antd';
import lineChartConfig from './lineChartConFig';
import { callGetAllAttendanceManagement } from '../../../../services/serverApi';
import dayjs from 'dayjs';

const { Title } = Typography;

const LineChart: React.FC = () => {
  const [chartData, setChartData] = useState(lineChartConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const startDate = dayjs().startOf('week').add(1, 'day');
      const endDate = dayjs().endOf('week').add(1, 'day');

      let query = `date=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}&pageSize=1000`;

      const response = await callGetAllAttendanceManagement(query);
      if (response?.status === 200) {
        const attendanceData =
          response.data._embedded?.attendanceByDateResponseList || [];
        updateChartData(attendanceData);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = (attendanceData: any) => {
    const newSeries = [
      { name: 'Present', data: Array(7).fill(0) },
      { name: 'Absent', data: Array(7).fill(0) },
      { name: 'Late', data: Array(7).fill(0) },
    ];

    attendanceData.forEach((record: any) => {
      const dayIndex = dayjs(record.attendanceDate).day();
      const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;

      if (adjustedDayIndex >= 0 && adjustedDayIndex < 7) {
        switch (record.status) {
          case 'PRESENT':
            newSeries[0].data[adjustedDayIndex]++;
            break;
          case 'ABSENT':
            newSeries[1].data[adjustedDayIndex]++;
            break;
          case 'LATE':
            newSeries[2].data[adjustedDayIndex]++;
            break;
        }
      }
    });

    setChartData((prevState) => ({
      ...prevState,
      series: newSeries,
    }));
  };

  return (
    <Spin spinning={loading}>
      <div className="linechart">
        <div>
          <Title level={4}>This week's attendance statistics chart</Title>
        </div>
      </div>

      {!loading && (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={230}
        />
      )}
    </Spin>
  );
};

export default LineChart;
