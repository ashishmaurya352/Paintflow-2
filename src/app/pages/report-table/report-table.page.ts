import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { IonHeader } from "@ionic/angular/standalone";
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';
import { FilterModalComponent } from 'src/app/shares/components/filter-modal/filter-modal.component';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.page.html',
  styleUrls: ['./report-table.page.scss'],
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportTablePage implements OnInit {

  constructor(
    private router: Router,
    private httpService: HttpService,
    private controller: ControllerService,
        private modalController: ModalController) { }
  tableData: any = [
    {
      ReqDate: '2025-08-16',
      SlipNumber: 'SLIP001',
      CONumber: 'CO12345',
      Person: 'John Doe',
      PendingSqFt: 1500,
      SumOfQuantity: 25
    },
    {
      ReqDate: '2025-08-15',
      SlipNumber: 'SLIP002',
      CONumber: 'CO12346',
      Person: 'Jane Smith',
      PendingSqFt: 1200,
      SumOfQuantity: 18
    }
  ];
  displayedColumns: string[] = ['ReqDate', 'SlipNumber', 'CONumber', 'Person', 'PendingSqFt', 'SumOfQuantity'];
  filteredData: any[] = [];
  timePeriods = [
    { label: '1D' },
    { label: '2D' },
    { label: '3D' },
    { label: '1W' },
    { label: '1M' }
  ];
  // selectedPeriod = this.timePeriods[4];
  startDate = new Date();
  endDate = new Date();
   filter: any = {
    StartDate : this.startDate,
    EndDate : this.endDate,
    ReqFrom : '',
    Person : '',
    Keyword : ''
  }
  selectedPeriod: string = '1D';
  sortByName: any;
  persons:any
  ngOnInit() {
    this.requisitionGetPersons();
    this.reportGetPaintingPlan();
  }
  backToRequisitionPage() {
    this.router.navigate(['/dashboard']);
  }
  reportGetPaintingPlan() {
    let startDate = new Date(this.startDate);
    startDate.setHours(0, 0, 0, 0);
    this.startDate = startDate;
    let endDate = new Date(this.endDate);
    endDate.setHours(23, 59, 59, 999);
    const params = new HttpParams()
      .set('StartDate', startDate.toISOString())
      .set('EndDate', endDate.toISOString())
      .set('ReqFrom', this.filter.ReqFrom || '')
      .set('Person', this.filter.Person || '')
      .set('Keyword', this.filter.Keyword || '');
    this.controller.showloader();
    this.httpService.reportGetPaintingPlan(params).subscribe(response => {
      console.log('Painting Plan Report:', response);
      this.tableData = response;
      this.controller.hideloader();
    });
  }

  addISTOffset(dateStr: string): Date {
  const originalDate = new Date(dateStr);
  const istOffsetMs = 5.5 * 60 * 60 * 1000; // 5 hours 30 mins in ms
  return new Date(originalDate.getTime() + istOffsetMs);
}
async openFilter() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: {
        // page: 'challan',
        // usereRole: this.usereRole,
        filter: this.filter,
        persons: this.persons,
        isreportFilter: true
        // tab: this.segmentValue
        // id: this.requisitionId,
      },
      cssClass: 'filter_model',
      mode: 'ios'
    });

    modal.onDidDismiss().then((dataReturned: any) => {
      if (dataReturned.data) {
        this.filter.ReqFrom = dataReturned.data.ReqFrom,
        this.filter.Person = dataReturned.data.Person,
        this.filter.Keyword = dataReturned.data.Keyword
        console.log('dataReturned:', dataReturned);
        this.reportGetPaintingPlan()
      }
    })
    await modal.present();
  }

  resetFilter() {
    this.filter = {
      PageNumber: 1,
      PageSize: 20,
      StartDate: null,
      EndDate: null,
      Keyword: null,
      Status: null,
    }
  }
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
    setTimeout(() => {
      this.reportGetPaintingPlan();
    }, 500);
  }
  onStartDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.startDate = selectedDate
    console.log('selectedDate', selectedDate)
    if (this.startDate && this.endDate) {

      this.reportGetPaintingPlan();
    }
  }
  onEndDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.endDate = new Date(selectedDate);
    this.endDate.setHours(23, 59, 59, 999);
    console.log('selectedDate', selectedDate)
    if (this.startDate && this.endDate) {
     this.reportGetPaintingPlan()
    }
  }
  requisitionGetPersons(){
    this.httpService.requisitionGetPersons().subscribe((response: any) => {
      this.persons = response;
      // this.persons = ["Ashish", "Ram", "Shame", "John", 'Doe','Maurka'];
      console.log('Requisition Get Persons:', response);
    });
  }
async calculateDateRange(period: string) {
    const currentDate = new Date();

    if (period.endsWith('D')) {
      const days = parseInt(period);
      this.startDate = new Date(currentDate);
      this.startDate.setDate(this.startDate.getDate() - (days - 1));
      this.endDate = currentDate;
    } else if (period.endsWith('W')) {
      const weeks = parseInt(period);
      this.startDate = new Date(currentDate);
      this.startDate.setDate(this.startDate.getDate() - (weeks * 7 - 1));
      this.endDate = currentDate;
    } else if (period.endsWith('M')) {
      const months = parseInt(period);
      this.startDate = new Date(currentDate);
      this.startDate.setMonth(this.startDate.getMonth() - months);
      this.startDate.setDate(this.startDate.getDate() + 1); // Optional: to include today
      this.endDate = currentDate;
    }

    // Return the date range at the end
  }
}
