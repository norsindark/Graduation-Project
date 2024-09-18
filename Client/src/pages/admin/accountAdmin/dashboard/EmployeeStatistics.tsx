import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import CountUp from 'react-countup';

interface ChartDataItem {
  date: string;
  value: number;
}

const EmployeeStatistics = () => {
  const [statistics, setStatistics] = useState({
    totalShifts: 0,
    totalEmployees: 0,
    totalHours: 0,
    totalPayment: 0,
    averageAttendance: 0,
    lateArrivals: 0,
  });

  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu thống kê
    // Ví dụ: fetchStatistics().then(data => setStatistics(data));

    // Giả lập dữ liệu
    setStatistics({
      totalShifts: 150,
      totalEmployees: 25,
      totalHours: 1200,
      totalPayment: 150000000,
      averageAttendance: 95,
      lateArrivals: 10,
    });

    // Giả lập dữ liệu biểu đồ
    setChartData([
      { date: '2023-01', value: 3 },
      { date: '2023-02', value: 4 },
      { date: '2023-03', value: 3.5 },
      { date: '2023-04', value: 5 },
      { date: '2023-05', value: 4.9 },
      { date: '2023-06', value: 6 },
    ]);
  }, []);

  const config = {
    data: chartData,
    height: 300,
    xField: 'date',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-home"
      role="tabpanel"
      aria-labelledby="v-pills-home-tab"
    >
      <div className="fp__dsahboard_overview">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card hoverable>
              <Statistic
                title="Tổng số ca làm việc"
                value={statistics.totalShifts}
                prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
                formatter={(value) => (
                  <CountUp end={value as number} separator="," />
                )}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card hoverable>
              <Statistic
                title="Tổng số nhân viên"
                value={statistics.totalEmployees}
                prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
                formatter={(value) => (
                  <CountUp end={value as number} separator="," />
                )}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card hoverable>
              <Statistic
                title="Tổng số giờ làm việc"
                value={statistics.totalHours}
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                suffix="giờ"
                valueStyle={{ color: '#faad14' }}
                formatter={(value) => (
                  <CountUp end={value as number} separator="," />
                )}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card hoverable>
              <Statistic
                title="Tổng tiền trả cho nhân viên"
                value={statistics.totalPayment}
                prefix={<DollarOutlined style={{ color: '#eb2f96' }} />}
                suffix="VNĐ"
                valueStyle={{ color: '#eb2f96' }}
                formatter={(value) => (
                  <CountUp end={value as number} separator="," />
                )}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card hoverable>
              <Statistic
                title="Tỷ lệ chuyên cần trung bình"
                value={statistics.averageAttendance}
                prefix={<CheckCircleOutlined style={{ color: '#13c2c2' }} />}
                suffix="%"
                valueStyle={{ color: '#13c2c2' }}
                formatter={(value) => (
                  <CountUp end={value as number} decimals={2} />
                )}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card hoverable>
              <Statistic
                title="Số lần đi muộn"
                value={statistics.lateArrivals}
                prefix={<WarningOutlined style={{ color: '#f5222d' }} />}
                valueStyle={{ color: '#f5222d' }}
                formatter={(value) => (
                  <CountUp end={value as number} separator="," />
                )}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Biểu đồ hiệu suất làm việc" hoverable>
              <Line {...config} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EmployeeStatistics;
