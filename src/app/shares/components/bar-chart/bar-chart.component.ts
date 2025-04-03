import { Component, Input, OnInit } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
  registerables
} from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {

  // @Input() chartData: number[] = [];
  @Input() chartData: number[] = [
    25000, 50000, 27000, 33000, 21000
  ]; // Default data
  @Input() canvasId: string = 'barChart';
  chart!: Chart;

  constructor() {}

  ngOnInit() {
    Chart.register(...registerables);
    setTimeout(() => {
      this.createBarChart();
    }, 100);
  }

  createBarChart() {
    const ctx = document.getElementById(this.canvasId) as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        // datasets: [
        //   {
        //     data: this.chartData,
        //     backgroundColor: '#880E4F',
        //     hoverBackgroundColor: '#AD1457',
        //     barThickness: 40 // Adjust bar width if needed
        //   }
        // ]
        datasets: [
          {
            label: 'Short Blasting',  // Added default label
            data: this.chartData,
            backgroundColor: '#880E4F',
            hoverBackgroundColor: '#AD1457',
            barThickness: 40 // Adjust bar width if needed
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: number) => `${value / 1000}K`, // Format Y-axis labels
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      } as ChartOptions<'bar'>
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
