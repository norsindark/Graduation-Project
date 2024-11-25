import { ApexOptions } from 'apexcharts';

const eChart = {
  series: [
    {
      name: 'Number of sales',
      data: [],
      color: '#fff',
    },
  ],

  options: {
    chart: {
      type: 'bar',
      width: '100%',
      height: 'auto',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    grid: {
      show: true,
      borderColor: '#ccc',
      strokeDashArray: 2,
    },
    xaxis: {
      categories: [],
      labels: {
        show: true,
        align: 'right',
        style: {
          colors: '#fff',
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: 'right',
        style: {
          colors: '#fff',
        },
        formatter: (value: number) => Math.round(value).toString(),
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toString() + ' dishes';
        },
      },
    },
  } as ApexOptions,
};

export default eChart;
