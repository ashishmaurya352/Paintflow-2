import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonHeader, IonToolbar } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardPage implements OnInit {
  @ViewChild('fileInput') fileInput:any;
  constructor(
    
        private router: Router,
        private httpService: HttpService,
         private controller: ControllerService,
        
  ) {
    // addIcons({exit,addOutline,repeatOutline,cloudUploadOutline,cloudDownloadOutline,bicycleOutline,boatOutline,documentTextOutline});
   }

  ngOnInit() {
    this.getActiveRequisitionCount()
    this.getCostOverview()
  }
  requisitions = [
    { count: 0, title: 'Shot Blasting Team' },
    { count: 0, title: 'PT-UT Team' },
    { count: 0, title: 'Paint Team' },
    { count: 0, title: 'Touch Up Team' },
    { count: 0, title: 'QA Team' },
    { count: 0, title: 'All Teams' },
  ];
  paintData = [
    { title: 'Shot Blasting', value: 0, qty: 0, unit: 'kg', rate: 0.0 },
    { title: 'Powder Coating', value: 0, qty: 0, unit: 'sq.ft.', rate: 0.0 },
    { title: 'Paint Total Value', value: 0, qty: 0, unit: 'sq.ft.', rate: 0.0 },
    { title: 'Primer + Regular', value: 0, qty: 0, unit: 'sq.ft.', rate: 0.0 },
    { title: 'Finish Paint Regular', value: 0, qty: 0, unit: 'sq.ft.', rate: 0.0 },
    { title: 'Red Paint Transportation', value: 0, qty: 0, unit: 'sq.ft.', rate: 0.0 }
  ];

  viewAll(item: any) {
    // console.log('Viewing all for:', item.title);
    const team = item.title;
    this.router.navigate(['/order'],{ queryParams: { team: team }});
    // Add navigation logic here
  }
  logout(){
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      // Once navigation is done, force a page reload to simulate app restart
      window.location.reload();
    });
  }
  getActiveRequisitionCount(){
    const  parm = new HttpParams().set('ReqFrom', '');
    this.httpService.getActiveRequisitionCount(parm).subscribe(
      (apidata: any) => {
        // Define a mapping between the requisition titles and the corresponding apidata fields
        const dataMapping: { [key: string]: string }  = {
          'Shot Blasting Team': 'shortblastingCount',
          'PT-UT Team': 'ptUtCount',
          'Paint Team': 'paintCount',
          'Touch Up Team': 'touchUpCount',
          'QA Team': 'qaCount',
          'All Teams': 'all'
        };
  
        // Update the requisitions based on the mapping
        this.requisitions.forEach(req => {
          const countKey = dataMapping[req.title]; // Get the property name from the mapping
          if (countKey && apidata[countKey] !== undefined) {  // Ensure the data exists
            req.count = apidata[countKey];
          }
        });
      },
      (error) => {
        console.error('Error fetching active requisition count:', error);
      }
    );
  }
  getCostOverview(){
    this.httpService.getCostOverview().subscribe((res:any)=>{
      this.paintData = [
        { title: 'Shot Blasting ', value: res.shortBlasting.amount, qty: res.shortBlasting.quantity, unit: 'kg', rate: res.shortBlasting.rate },
        { title: 'Powder Coating', value: res.powderCoating.amount, qty: res.powderCoating.quantity, unit: 'sq.ft.', rate: res.powderCoating.rate },
        { title: 'Paint Total Value', value: res.paintTotalValue.amount, qty: res.paintTotalValue.quantity, unit: 'sq.ft.', rate: 'NA' },
        { title: 'Primer + Regular', value: res.primerRegular.amount, qty: res.primerRegular.quantity, unit: 'sq.ft.', rate: res.primerRegular.rate },
        { title: 'Finish Paint Regular', value: res.finishPaintRegular.amount, qty: res.finishPaintRegular.quantity, unit: 'sq.ft.', rate: res.finishPaintRegular.rate },
        { title: 'Red Paint Transportation', value: res.redPaintTransportation.amount, qty: res.redPaintTransportation.quantity, unit: 'sq.ft.', rate: res.redPaintTransportation.rate }
      ];
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
      this.controller.showToast('100 records synced successfully')


      console.log('res', res);
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

}
