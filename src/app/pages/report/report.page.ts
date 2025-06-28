import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { async } from 'rxjs';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportPage implements OnInit {

  @ViewChild('startDatePopover') startDatePopover: any;
  @ViewChild('endDatePopover') endDatePopover: any;
  pageTitles = 'Report';
  sortByName: any
  teams: any = [];

  // dateRange = { start: new Date(), end: new Date() };
  timePeriods = [
    { label: '1D' },
    { label: '1W' },
    { label: '1M' },
    { label: '3M' },
    { label: '6M' },
    { label: '1Y' }
  ];
  filter: any = {
    StartDate: this.getStartOfLastMonth().toISOString(),
    EndDate: new Date().toISOString(),
    Type : 'Delay',
    Team: '',
  }
  popoverState = {
  Type: { isOpen: false, event: null },
  Team: { isOpen: false, event: null }
};
  constructor(

    private modalController: ModalController,
    private httpService: HttpService,
    private controller: ControllerService,
  ) { 

  }

  ngOnInit() {
    this.getTeams();
      // this.addcss();
  }
  backToDashboardPage() {
    window.history.back();
  }
  openPopover(event: any, key: 'Type' | 'Team') {
  this.popoverState[key].event = event;
  this.popoverState[key].isOpen = true;
}
selectOption(key: 'Type' | 'Team', value: string) {
  this.filter[key] = value;
  this.popoverState[key].isOpen = false;
}
  onStartDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.filter.StartDate = selectedDate
    console.log('selectedDate', selectedDate);
    this.startDatePopover?.dismiss();


  }

  onEndDateChange(event: any) {
    const selectedDate = event.detail.value;
   this.filter.EndDate = selectedDate
    console.log('selectedDate', selectedDate);
    this.endDatePopover?.dismiss();

  }

  selectedPeriod: string = '1M';

  // Function to set the active period
  async setActive(period: any) {
    this.selectedPeriod = period;

    if (period === 'Custom Date') {
      setTimeout(() => {
        const triggerEl = document.getElementById('startDate-trigger');
        if (triggerEl) {
          triggerEl.click();
        } else {
          console.warn('Popover trigger not found.');
        }
      }, 100);
      return
    }
    await this.calculateDateRange(period);
    // this.getReport()
  }

  getReport(reportType: string) {
    if (reportType === 'Items Report') {
      this.controller.showloader();
    let params = new HttpParams().set('StartDate', this.filter.StartDate).set('EndDate', this.filter.EndDate)
    this.httpService.reportGetItems(params).subscribe({
      next: (res: any) => {
        this.controller.hideloader();
        console.log('Report URL:', res);
      },
        error: (err) => {
          this.controller.hideloader()
          this.controller.showToast('Error fetching report');
          console.error('Download error:', err);
        }
    });
    }
    else if (reportType === 'Team Wise Delay') {
      this.controller.showloader();
      let params = new HttpParams().set('StartDate', this.filter.StartDate).set('EndDate', this.filter.EndDate).set('Team', this.filter.Team);

      this.httpService.reportGetTeamWiseDelay(params).subscribe({
        next: (res: any) => {
          this.controller.hideloader();
          console.log('Report URL:', res);
        },
        error: (err) => {
          this.controller.hideloader()
          this.controller.showToast('Error fetching report');
          console.error('Download error:', err);
        }
      });
    }
    else if (reportType === 'Team Wise Rework') {
      this.controller.showloader();
      let params = new HttpParams().set('StartDate', this.filter.StartDate).set('EndDate', this.filter.EndDate).set('Team', this.filter.Team);

      this.httpService.reportGetTeamWiseRework(params).subscribe({
        next: (res: any) => {
          this.controller.hideloader();
          console.log('Report URL:', res);
        },
        error: (err) => {
          this.controller.hideloader()
          this.controller.showToast('Error fetching report');
          console.error('Download error:', err);
        }
      });
    }

  }
  async calculateDateRange(period: string): Promise<{ start: Date; end: Date }> {
    const currentDate = new Date();

    switch (period) {
      case '1D':
        this.filter.start = await this.getStartOfDay(currentDate);
        this.filter.end = currentDate;
        break;
      case '1W':
        this.filter.start = await this.getStartOfDay(await this.addDays(currentDate, -7));
        this.filter.end = currentDate;
        break;
      case '1M':
        this.filter.start = await this.getStartOfDay(await this.addMonths(currentDate, -1));
        this.filter.end = currentDate;
        break;
      case '3M':
        this.filter.start = await this.getStartOfDay(await this.addMonths(currentDate, -3));
        this.filter.end = currentDate;
        break;
      case '6M':
        this.filter.start = await this.getStartOfDay(await this.addMonths(currentDate, -6));
        this.filter.end = currentDate;
        break;
      case '1Y':
        this.filter.start = await this.getStartOfDay(await this.addYears(currentDate, -1));
        this.filter.end = currentDate;
        break;
      case 'Custom Date':
        this.filter.start = currentDate;
        this.filter.end = currentDate;
        break;
      default:
        this.filter.start = currentDate;
        this.filter.end = currentDate;
        break;
    }

    // Return the date range at the end
    return this.filter;
  }

  // Helper function to add days to a date
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  }

  // Helper function to add months to a date
  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(date.getMonth() + months);
    return result;
  }

  // Helper function to add years to a date
  addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(date.getFullYear() + years);
    return result;
  }
  getStartOfLastMonth(): Date {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

    // Set time to 00:00:00 for consistency
    lastMonth.setHours(0, 0, 0, 0);

    return lastMonth;
  }

   getStartOfDay(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }
   addcss() {
    // Check if we're on the requisition page
    const isRequisitionPage = window.location.pathname === '/requisition' && window.location.search.startsWith('?id=');

    if (!isRequisitionPage) {
      return; // Exit the function if not on the requisition page
    }
    const observer = new MutationObserver(() => {
      document.querySelectorAll("ion-select").forEach((ionSelect) => {
        // Ensure ion-select has shadowRoot and check for existing styles
        if (ionSelect.shadowRoot && !ionSelect.shadowRoot.querySelector("style.custom-style")) {
          try {
            console.log("✅ Styling dynamically added ion-select");

            // Create style element and add the styles
            const style = document.createElement("style");
            style.classList.add("custom-style");
            style.textContent = `
              .select-outline-container {
                height: 32px !important;
                left: 20px !important;
                width: 80% !important;
              }
              .select-wrapper-inner {
                display: block !important;
              }
            `;

            // Append to shadow DOM
            ionSelect.shadowRoot.appendChild(style);
          } catch (error) {
            console.error("Error while adding custom styles to ion-select:", error);
          }
        }
      });
    });

    // Observe the entire document for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      console.log("Stopping the observer");
      observer.disconnect(); // Stop observing
    }, 2000);
  }

  getTeams() {
    this.httpService.getTeams().subscribe({
      next: (res: any) => {
        this.teams = res;
      }
    });
  }
}