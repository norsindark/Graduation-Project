import { ApexOptions } from 'apexcharts';

const lineChartConFig = {
  series: [
    {
      name: 'Có mặt',
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Vắng mặt',
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: 'Đi muộn',
      data: [0, 0, 0, 0, 0, 0, 0],
    },
  ],

  options: {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    colors: ['#82ca9d', '#ff6b6b', '#feca57'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      labels: {
        style: {
          colors: '#8c8c8c',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#8c8c8c',
          fontSize: '12px',
        },
        formatter: (value) => value.toFixed(0),
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    grid: {
      show: true,
      borderColor: '#f0f0f0',
      strokeDashArray: 4,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  } as ApexOptions,
};

export default lineChartConFig;
