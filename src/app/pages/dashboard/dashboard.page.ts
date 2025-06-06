import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardPage implements OnInit {
  @ViewChild('fileInput') fileInput:any;
  selectedOption ='WPP'
  paintData:any
  paintDesc:any
  allItem = 0

  filter: any = {
    ReqFrom: 'WPP',
    Status: 'Completed',
    StartDate:this.getStartOfLastMonth().toISOString(),
    EndDate:new Date().toISOString(),
  }
  dateRange = { start: new Date(), end: new Date() };

  timePeriods = [
    { label: '1D' },
    { label: '1W' },
    { label: '1M' },
    { label: '3M' },
    { label: '6M' },
    { label: '1Y' }
  ];
  costAnalysisType = 'External'
  
  constructor(
    
        private router: Router,
        private httpService: HttpService,
         private controller: ControllerService,
        
  ) {
    // addIcons({exit,addOutline,repeatOutline,cloudUploadOutline,cloudDownloadOutline,bicycleOutline,boatOutline,documentTextOutline});
   }

  ngOnInit() {
    this.getActiveRequisitionCount()
    this.getPaintDescWiseCostOverview()
    this.getCostOverview()
    this.addcss()
  }
  requisitions:any = [
    // { count: 0, title: 'Shot Blasting Team' },
    // { count: 0, title: 'PT/PH Team' },
    // { count: 0, title: 'Paint Team' },
    // { count: 0, title: 'Touch Up Team' },
    // { count: 0, title: 'QA Team' },
    // { count: 0, title: 'All Teams' },
  ];
  // paintData = [
  //   { title: 'Shot Blasting', value: 0, qty: 0, unit: 'kg', rate: 0.0 },
  //   { title: 'Powder Coating', value: 0, qty: 0, unit: 'sq.ft.', rate: 0.0 },
  //   { title: 'Paint Total Value', value: 0, qty: 0, unit: 'sq.ft.', rate: 0.0 },
  //   { title: 'Primer + Regular', value: 0, qty: 0, unit: 'sq.ft.', rate: 0.0 },
  //   { title: 'Finish Paint Regular', value: 0, qty: 0, unit: 'sq.ft.', rate: 0.0 },
  //   { title: 'Red Paint Transportation', value: 0, qty: 0, unit: 'sq.ft.', rate: 0.0 }
  // ];

  viewAll(item: any) {
    // console.log('Viewing all for:', item.title);
    const team = item.name;
    this.router.navigate(['/order'],{ queryParams: { team: team }});
    // Add navigation logic here
  }
  logout(){
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      // Once navigation is done, force a page reload to simulate app restart
      if (Capacitor.getPlatform() === 'android') {
      window.location.reload();
    }
    });
  }
  getActiveRequisitionCount(){
    const  parm = new HttpParams().set('ReqFrom', '');
    this.httpService.getActiveRequisitionCount(parm).subscribe(
      (apidata: any) => {
        this.requisitions = apidata
        const allItem  = this.requisitions.find((item:any) => item.name === "All");
        this.allItem = allItem ? allItem.count : 0;
        // Define a mapping between the requisition titles and the corresponding apidata fields
        // const dataMapping: { [key: string]: string }  = {
        //   'Shot Blasting Team': 'shortblastingCount',
        //   'Powder Coating Team':'powderCoatingCount',
        //   'PT/PH Team': 'ptUtCount',
        //   'Paint Team': 'paintCount',
        //   'Touch Up Team': 'touchUpCount',
        //   'QA Team': 'qaCount',
        //   'All Teams': 'all'
        // };
  
        // Update the requisitions based on the mapping
        // this.requisitions.forEach(req => {
        //   const countKey = dataMapping[req.title]; // Get the property name from the mapping
        //   if (countKey && apidata[countKey] !== undefined) {  // Ensure the data exists
        //     req.count = apidata[countKey];
        //   }
        // });
      },
      (error) => {
        console.error('Error fetching active requisition count:', error);
      }
    );
  }
  getCostOverview(){
    let parm = new HttpParams()
    Object.keys(this.filter).forEach(key => {
      if (this.filter[key] !== null) {
        parm = parm.set(key, this.filter[key]);
      }
      parm = parm.set('Type', this.costAnalysisType);
    });
    this.httpService.getCostOverview(parm).subscribe((res:any)=>{
      this.paintData = res
      // this.paintData = [
      //   { title: 'Shot Blasting ', value: res.shortBlasting.amount, qty: res.shortBlasting.quantity, unit: 'kg', rate: res.shortBlasting.rate },
      //   { title: 'Powder Coating', value: res.powderCoating.amount, qty: res.powderCoating.quantity, unit: 'sq.ft.', rate: res.powderCoating.rate },
      //   { title: 'Paint Total Value', value: res.paintTotalValue.amount, qty: res.paintTotalValue.quantity, unit: 'sq.ft.', rate: 'NA' },
      //   { title: 'Primer + Regular', value: res.primerRegular.amount, qty: res.primerRegular.quantity, unit: 'sq.ft.', rate: res.primerRegular.rate },
      //   { title: 'Finish Paint Regular', value: res.finishPaintRegular.amount, qty: res.finishPaintRegular.quantity, unit: 'sq.ft.', rate: res.finishPaintRegular.rate },
      //   { title: 'Red Paint Transportation', value: res.redPaintTransportation.amount, qty: res.redPaintTransportation.quantity, unit: 'sq.ft.', rate: res.redPaintTransportation.rate }
      // ];
    })
  }
  openFileInput() {
    this.fileInput.nativeElement.click();
  }
  async handleFileSelection(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const formData = new FormData();
    formData.append('file', file);

    // Show loading spinner while uploading
    this.controller.showloader()
      this.httpService.documentsUploadExcel(formData)
      .subscribe(async (res:any)=>{
        console.log('File uploaded successfully:', res);
        this.controller.hideloader()
        this.controller.showToast('File uploaded successfully')


        // Handle the response from the server if needed
      },(error) => {
        console.error('Error uploading file:', error);
      this.controller.hideloader()
      this.controller.showToast('Error uploading file')


      })
      console.log('Selected file:', file);

      // Handle the file upload logic here
    } 
  }
  getRequisitionFetch()  {
    this.controller.showloader()

    this.httpService.getRequisitionFetch().subscribe((res:any)=>{
      this.controller.hideloader()
      this.controller.showToast(res.message)
    },(error) => {
      this.controller.hideloader()
      this.controller.showToast('Error fetching requisition')

      console.error('Error fetching requisition:', error);})
  }
  downloadFile() {
    // The URL of the Excel file
    const fileUrl = 'https://paintflow.runasp.net/Docs/Excel_File.xlsx';

    // Create an invisible link element
    const link = document.createElement('a');
    link.href = fileUrl;

    // Set the download attribute to specify the default filename
    link.download = 'Excel_File.xlsx'; // You can change the filename here

    // Programmatically click the link to trigger the download
    link.click();
  }

  onStatusChange(event: any) {
    const Status = event.target.value;
    this.filter.Status = Status
    this.getPaintDescWiseCostOverview()
    this.getActiveRequisitionCount()
    this.getCostOverview()


  }
  addcss() {
    const observer = new MutationObserver(() => {
      document.querySelectorAll("ion-select").forEach((ionSelect) => {
        if (ionSelect.shadowRoot && !ionSelect.shadowRoot.querySelector("style.custom-style")) {
          console.log("✅ Styling dynamically added ion-select");
          const style = document.createElement("style");
          style.classList.add("custom-style"); // Prevent duplicate styles
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
          ionSelect.shadowRoot.appendChild(style);
        }
      });
    });

    // Observe the entire document for new elements
    observer.observe(document.body, { childList: true, subtree: true });
  }

  getPaintDescWiseCostOverview(filter:any = false){
    let parm = new HttpParams()
    
    if(filter){
      this.filter.StartDate = this.dateRange.start.toISOString()
      this.filter.EndDate = this.dateRange.end.toISOString()
    }
    Object.keys(this.filter).forEach(key => {
      if (this.filter[key] !== null) {
        parm = parm.set(key, this.filter[key]);
      }
    });
    this.httpService.getPaintDescWiseCostOverview(parm).subscribe(async (res:any)=>{
      this.paintDesc = res
    })
  }
  // objectKeys(obj: any): string[] {
  //   return obj ? Object.keys(obj) : [];
  // }
  objectKeys = Object.keys;

getFirstSixKeys(obj: any): string[] {
  return Object.keys(obj).slice(0, 6);
}

getRemainingKeys(obj: any): string[] {
  return Object.keys(obj).slice(6);
}

  selectedPeriod: string = '1M';

  // Function to set the active period
  async setActive(period: any) {
    this.selectedPeriod = period;
    await this.calculateDateRange(period);
    this.getActiveRequisitionCount()
    this.getPaintDescWiseCostOverview(true)
    this.getCostOverview()

    console.log('this.selectedPeriod',this.selectedPeriod)
    console.log('this.dateRange',this.dateRange)
  }

  async calculateDateRange(period: string): Promise<{ start: Date; end: Date }> {
    const currentDate = new Date();
  
    switch (period) {
      case '1D':
        this.dateRange.start = await this.getStartOfDay(currentDate);
        this.dateRange.end = currentDate;
        break;
      case '1W':
        this.dateRange.start = await this.getStartOfDay(await this.addDays(currentDate, -7));
        this.dateRange.end = currentDate;
        break;
      case '1M':
        this.dateRange.start = await this.getStartOfDay(await this.addMonths(currentDate, -1));
        this.dateRange.end = currentDate;
        break;
      case '3M':
        this.dateRange.start = await this.getStartOfDay(await this.addMonths(currentDate, -3));
        this.dateRange.end = currentDate;
        break;
      case '6M':
        this.dateRange.start = await this.getStartOfDay(await this.addMonths(currentDate, -6));
        this.dateRange.end = currentDate;
        break;
      case '1Y':
        this.dateRange.start = await this.getStartOfDay(await this.addYears(currentDate, -1));
        this.dateRange.end = currentDate;
        break;
      case 'Custom Date':
        this.dateRange.start = currentDate;
        this.dateRange.end = currentDate;
        break;
      default:
        this.dateRange.start = currentDate;
        this.dateRange.end = currentDate;
        break;
    }
  
    // Return the date range at the end
    return this.dateRange;
  }
  

  // Helper function to set the time to the start of the day (midnight)
  getStartOfDay(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
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
  segment(event: any){
    this.filter.ReqFrom =  event.target.value;
    this.getActiveRequisitionCount()
    this.getPaintDescWiseCostOverview()
    this.getCostOverview()
  }
  onCostAnalysisStatusChange(event: any) {
    this.costAnalysisType = event.target.value;
    // this.filter.Status = Status
    // this.getPaintDescWiseCostOverview()
    // this.getActiveRequisitionCount()
    this.getCostOverview()
  }
  changearePage(){
    this.router.navigate(['/change-rate']);
  }
  
 

}
