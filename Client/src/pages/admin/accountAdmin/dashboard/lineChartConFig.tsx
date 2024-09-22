import { ApexOptions } from 'apexcharts';

const lineChartConFig = {
  series: [
    {
      name: 'Tuần trước',
      data: [100, 200, 300, 400, 500, 600, 700],
    },
    {
      name: 'Tuần này',
      data: [150, 250, 350, 450, 550, 650, 750],
    },
  ],

  options: {
    chart: {
      height: 180,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    colors: ['#8884d8', '#82ca9d'],
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
          fontSize: '10px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 800,
      tickAmount: 5,
      labels: {
        style: {
          colors: '#8c8c8c',
          fontSize: '10px',
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
      show: false,
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
