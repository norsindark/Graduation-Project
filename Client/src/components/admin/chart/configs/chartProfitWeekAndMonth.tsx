import { ApexOptions } from 'apexcharts';

export const weeklyChartConfig: { options: ApexOptions } = {
  options: {
    chart: {
      type: 'line' as const,
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ['#2E93fA', '#66DA26', '#FF0000'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      type: 'category' as const,
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value.toLocaleString()}đ`,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `${value.toLocaleString()}đ`,
      },
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'center' as const,
    },
    grid: {
      borderColor: '#f1f1f1',
    },
  },
};

export const monthlyChartConfig: { options: ApexOptions } = {
  options: {
    ...weeklyChartConfig.options,
    xaxis: {
      ...weeklyChartConfig.options.xaxis,
      labels: {
        ...weeklyChartConfig.options.xaxis?.labels,
        formatter: (value: string) => {
          const [month, year] = value.split('-');
          return `T${month}/${year}`;
        },
      },
    },
  },
};
