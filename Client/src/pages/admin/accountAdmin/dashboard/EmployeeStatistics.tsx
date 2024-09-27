// Component
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, DatePicker, message } from 'antd';
import {
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import LineChart from './LineChart';
import dayjs, { Dayjs } from 'dayjs';
import {
  callGetCountHoursWork,
  callGetCountEmployeeShift,
  callGetSumStatusPerMonth,
  callGetSumSalaryPerMonth,
} from '../../../../services/serverApi';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface StatisticsData {
  totalShifts: number;
  totalEmployees: number;
  totalHours: number;
  totalPayment: number;
  averageAttendance: number;
  lateArrivals: number;
}

const EmployeeStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData>({
    totalShifts: 0,
    totalEmployees: 0,
    totalHours: 0,
    totalPayment: 0,
    averageAttendance: 0,
    lateArrivals: 0,
  });

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    const [startDate] = dateRange;
    const month = startDate.format('MM');
    const year = startDate.format('YYYY');

    try {
      const [hoursWorked, employeeShifts, attendance, salary, lateArrivals] =
        await Promise.all([
          callGetCountHoursWork(month, year),
          callGetCountEmployeeShift(month, year),
          callGetSumStatusPerMonth(month, year, 'present'),
          callGetSumSalaryPerMonth(month, year),
          callGetSumStatusPerMonth(month, year, 'late'),
        ]);

      setStatistics({
        totalShifts: employeeShifts.data.totalShifts || 0,
        totalEmployees: employeeShifts.data.totalEmployees || 0,
        totalHours: hoursWorked.data.totalHours || 0,
        totalPayment: salary.data.totalSalary || 0,
        averageAttendance:
          (attendance.data.totalPresent /
            (employeeShifts.data.totalShifts || 1)) *
          100,
        lateArrivals: lateArrivals.data.totalLate || 0,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      message.error('Có lỗi xảy ra khi lấy dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (dates) {
      setDateRange(dates as [Dayjs, Dayjs]);
    }
  };

  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-home"
      role="tabpanel"
      aria-labelledby="v-pills-home-tab"
    >
      <div className="fp__dsahboard_overview">
        <RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
          className="mb-4"
        />
        <Row
          gutter={[8, 8]}
          className="rowgap-vbox bg-[#faf6f3fa] justify-center"
        >
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Total shifts</div>
                <CountUp end={statistics.totalShifts} separator="," />
              </div>
              <CalendarOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Total employees</div>
                <CountUp end={statistics.totalEmployees} separator="," />
              </div>
              <UserOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Total working hours</div>
                <CountUp end={statistics.totalHours} separator="," /> giờ
              </div>
              <ClockCircleOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Total payment</div>
                <CountUp end={statistics.totalPayment} separator="," /> VNĐ
              </div>
              <DollarOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Average attendance rate</div>
                <CountUp end={statistics.averageAttendance} decimals={2} />%
              </div>
              <CheckCircleOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div className="text-gray-500">Late arrivals</div>
                <CountUp end={statistics.lateArrivals} separator="," />
              </div>
              <WarningOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 0]} className="w-full m-auto pt-2">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
