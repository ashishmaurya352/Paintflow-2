
// import { Component, Input, OnInit } from '@angular/core';
// import { Chart, ChartOptions, registerables } from 'chart.js';

// @Component({
//   selector: 'app-chart',
//   templateUrl: './chart.component.html',
//   styleUrls: ['./chart.component.scss'],
// })
// export class ChartComponent  implements OnInit {
//   @Input() chartData: any;
//   @Input() canvasId: string = 'pieChart';
//   @Input() height = 'small'
//   chart!: Chart<any>;
//   color: any;

//   constructor() { }

//   ngOnInit() {
//     Chart.register(...registerables);
//     setTimeout(async () => {
//       this.chartData = await this.chartData.map((num: number) =>
//         num.toFixed(0)
//       );
//       this.createChart();
//     }, 100);
//     if (this.chartData[0] < 35) {
//       this.color = '#EC4949';
//     } else if (this.chartData[0] < 60) {
//       this.color = '#E8B500';
//     } else {
//       this.color = ' #499DF3';
//     }
//   }

//   createChart() {
//     const ctx = document.getElementById(this.canvasId) as HTMLCanvasElement;
    
//     const data = {
//       datasets: [
//         {
//           data: this.chartData, // Your data for the chart
//           backgroundColor: [this.color, '#eeeeee'], // Segment colors
//           borderWidth: 0,
//           height: this.height
//         },
//       ],
//       // Optionally, you can use labels like:
//       // labels: ['Complete', 'Pending'] 
//     };
  
//     // Define the custom plugin to draw text inside the doughnut chart
//     const doughnutLabel = {
//       id: 'doughnutLabel',
//       beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
//         const { ctx, data } = chart;
//         ctx.save();

//         const meta = chart.getDatasetMeta(0); 
//         const { x, y } = meta.data[0]; // Use getCenterPoint for the center coordinates
  
//         // Set text properties
//         if(data.datasets[0].height === 'small'){

//           ctx.font = 'bold 11px sans-serif';
//         }else{
//           ctx.font = 'bold 25px sans-serif';
//         }
//         ctx.fillStyle = '#6E7882'; // Text color
//         ctx.textAlign = 'center'; // Center horizontally
//         ctx.textBaseline = 'middle'; // Center vertically
//         ctx.fillText(`${data?.datasets[0]?.data[0]}%`, x, y); // Display percentage
  
//         ctx.restore();
//       }
//     };
  
//     // Create the doughnut chart with the custom plugin
//     this.chart = new Chart(ctx, {
//       type: 'doughnut',
//       data: data,
//       options: {
//         cutout: '75%', // Adjust donut cutout size
//         responsive: true, // Make it responsive
//       } as ChartOptions<'doughnut'>,
//       plugins: [doughnutLabel] // Register the custom plugin
//     });
//   }
  

//   ngOnDestroy() {
//     if (this.chart) {
//       this.chart.destroy();
//     }
//   }
// }

import { Component, Input, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Chart, registerables, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartData: number[] = [];
  @Input() canvasId: string = 'pieChart';
  @Input() height: 'small' | 'large' = 'small';

  chart!: Chart;
  color: string = '#499DF3'; // default

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    if (!this.chartData || this.chartData.length === 0) {
      console.warn('chartData is empty or undefined.');
      return;
    }

    // Format data
    this.chartData = this.chartData.map((num: number) => Number(num.toFixed(0)));

    // Assign color based on chartData[0]
    const value = this.chartData[0];
    if (value < 35) {
      this.color = '#EC4949';
    } else if (value < 60) {
      this.color = '#E8B500';
    } else {
      this.color = '#499DF3';
    }

    this.createChart();
  }

  createChart() {
    const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;

    if (!canvas) {
      console.error(`Canvas with ID '${this.canvasId}' not found.`);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Can't acquire 2D context from canvas.");
      return;
    }

    // Destroy existing chart instance
    if (this.chart) {
      this.chart.destroy();
    }

    const data = {
      datasets: [
        {
          data: this.chartData,
          backgroundColor: [this.color, '#eeeeee'],
          borderWidth: 0,
          height: this.height
        },
      ]
    };

    const doughnutLabel = {
      id: 'doughnutLabel',
      beforeDatasetsDraw(chart: any) {
        const { ctx, data } = chart;
        ctx.save();

        const meta = chart.getDatasetMeta(0);
        if (!meta.data[0]) return;

        const { x, y } = meta.data[0];

        ctx.font = data.datasets[0].height === 'small' ? 'bold 11px sans-serif' : 'bold 25px sans-serif';
        ctx.fillStyle = '#6E7882';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${data.datasets[0].data[0]}%`, x, y);

        ctx.restore();
      }
    };

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        cutout: '75%',
        responsive: true,
      } as ChartOptions<'doughnut'>,
      plugins: [doughnutLabel]
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
