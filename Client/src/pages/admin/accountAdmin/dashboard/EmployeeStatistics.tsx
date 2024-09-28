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
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import LineChart from './LineChart';
import dayjs, { Dayjs } from 'dayjs';
import {
  callGetCountHoursWork,
  callGetCountEmployeeShift,
  callGetSumStatusPerMonth,
  callGetSumSalaryPerMonth,
  callGetCountEmployeePerMonth
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

  const [previousMonthStatistics, setPreviousMonthStatistics] =
    useState<StatisticsData>({
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
    const currentMonth = startDate.format('MM');
    const currentYear = startDate.format('YYYY');
    const previousMonth = startDate.subtract(1, 'month');
    const previousMonthStr = previousMonth.format('MM');
    const previousYearStr = previousMonth.format('YYYY');

    try {
      const [currentMonthData, previousMonthData] = await Promise.all([
        fetchMonthData(currentMonth, currentYear),
        fetchMonthData(previousMonthStr, previousYearStr),
      ]);

      setStatistics(currentMonthData);
      setPreviousMonthStatistics(previousMonthData);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      message.error('Error fetching statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthData = async (
    month: string,
    year: string
  ): Promise<StatisticsData> => {
    const [hoursWorked, employeeShifts, attendance, salary, lateArrivals, Employees] =
      await Promise.all([
        callGetCountHoursWork(month, year),
        callGetCountEmployeeShift(month, year),
        callGetSumStatusPerMonth(month, year, 'present'),
        callGetSumSalaryPerMonth(month, year),
        callGetSumStatusPerMonth(month, year, 'late'),
        callGetCountEmployeePerMonth(month, year)
      ]);

    return {
      totalShifts: employeeShifts.data || 0,
      totalEmployees: Employees.data || 0,
      totalHours: hoursWorked.data || 0,
      totalPayment: salary.data || 0,
      averageAttendance: (attendance.data / (employeeShifts.data || 1)) * 100,
      lateArrivals: lateArrivals.data || 0,
    };
  };
  const calculatePercentageChange = (
    current: number,
    previous: number
  ): number => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (dates) {
      setDateRange(dates as [Dayjs, Dayjs]);
    }
  };

  const renderPercentageChange = (current: number, previous: number) => {
    const percentageChange = calculatePercentageChange(current, previous);
    const isPositive = percentageChange >= 0;
    return (
      <div className={isPositive ? 'text-green-500' : 'text-red-500'}>
        {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        Month: {Math.abs(percentageChange).toFixed(2)}%
      </div>
    );
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
          format="MM/YYYY"
          picker="month"
          className="mb-4"
        />
        <Row
          gutter={[8, 8]}
          className="rowgap-vbox bg-[#faf6f3fa] justify-center"
        >
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div>
                  <div className="text-gray-500">Total Shifts</div>
                  <CountUp end={statistics.totalShifts} separator="," />
                </div>
                {renderPercentageChange(
                  statistics.totalShifts,
                  previousMonthStatistics.totalShifts
                )}
              </div>
              <CalendarOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div>
                  <div className="text-gray-500">Total Employees</div>
                  <CountUp end={statistics.totalEmployees} separator="," />
                </div>
                {renderPercentageChange(
                  statistics.totalEmployees,
                  previousMonthStatistics.totalEmployees
                )}
              </div>
              <UserOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div>
                  <div className="text-gray-500">Total Hours Worked</div>
                  <CountUp end={statistics.totalHours} separator="," /> hours
                </div>
                {renderPercentageChange(
                  statistics.totalHours,
                  previousMonthStatistics.totalHours
                )}
              </div>
              <ClockCircleOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div>
                  <div className="text-gray-500">Total Payment</div>
                  <CountUp end={statistics.totalPayment} separator="," /> VNĐ
                </div>
                {renderPercentageChange(
                  statistics.totalPayment,
                  previousMonthStatistics.totalPayment
                )}
              </div>
              <DollarOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div>
                  <div className="text-gray-500">Average Attendance Rate</div>
                  <CountUp end={statistics.averageAttendance} decimals={2} />%
                </div>
                {renderPercentageChange(
                  statistics.averageAttendance,
                  previousMonthStatistics.averageAttendance
                )}
              </div>
              <CheckCircleOutlined className="text-blue-500 text-3xl" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={7}>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <div>
                  <div className="text-gray-500">Late Arrivals</div>
                  <CountUp end={statistics.lateArrivals} separator="," />
                </div>
                {renderPercentageChange(
                  statistics.lateArrivals,
                  previousMonthStatistics.lateArrivals
                )}
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
