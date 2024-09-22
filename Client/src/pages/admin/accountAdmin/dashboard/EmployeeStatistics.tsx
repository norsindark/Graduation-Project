import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import LineChart from './LineChart';
import {
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';

const { Title } = Typography;

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
  }, []);

  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-home"
      role="tabpanel"
      aria-labelledby="v-pills-home-tab"
    >
      <div className="fp__dsahboard_overview">
        <Row
          className="rowgap-vbox bg-[#faf6f3fa] justify-center"
          gutter={[8, 8]}
        >
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Tổng số ca làm việc</div>
                <div className="">
                  <CountUp end={statistics.totalShifts} separator="," />
                </div>
                <div className="text-green-500">Month: +30%</div>
              </div>
              <CalendarOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Tổng số nhân viên</div>
                <div className="">
                  <CountUp end={statistics.totalEmployees} separator="," />
                </div>
                <div className="text-red-500">Month: -20%</div>
              </div>
              <UserOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Tổng số giờ làm việc</div>
                <div className="">
                  <CountUp end={statistics.totalHours} separator="," /> giờ
                </div>
                <div className="text-green-500">Month: +10%</div>
              </div>
              <ClockCircleOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Tổng tiền trả cho nhân viên</div>
                <div className="">
                  <CountUp end={statistics.totalPayment} separator="," /> VNĐ
                </div>
                <div className="text-green-500">Month: +20%</div>
              </div>
              <DollarOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Tỷ lệ chuyên cần trung bình</div>
                <div className=" ">
                  <CountUp end={statistics.averageAttendance} decimals={2} />%
                </div>
                <div className="text-green-500">Month: +15%</div>
              </div>
              <CheckCircleOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Số lần đi muộn</div>
                <div className="">
                  <CountUp end={statistics.lateArrivals} separator="," />
                </div>
                <div className="text-red-500">Month: -5%</div>
              </div>
              <WarningOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 0]} className="w-full m-auto pt-2 ">
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="">
            <Card bordered={false} className="criclebox">
              <LineChart />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EmployeeStatistics;
