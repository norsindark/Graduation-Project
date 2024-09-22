import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Typography } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import lineChartConfig from '../../../../components/admin/chart/configs/lineChart';

const LineChart: React.FC = () => {
  const { Title, Paragraph } = Typography;

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={4}>Biểu đồ thống kê nhân viên</Title>
          <Paragraph className="lastweek">
            So với tháng trước <span className="bnb2">+5%</span>
          </Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Tuần trước</li>
            <li>{<MinusOutlined />} Tuần này</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="w-full h-[245px] fixErrorChartMinHeight"
        options={lineChartConfig.options}
        series={lineChartConfig.series}
        type="line"
        height={250}
        width={'100%'}
      />
    </>
  );
};

export default LineChart;
