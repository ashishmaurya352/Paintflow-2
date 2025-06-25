import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportComponent  implements OnInit {
startDate: any = null
  endDate: any = null
  constructor(
    
        private modalController: ModalController,
        private httpService: HttpService,
            private controller: ControllerService,
        private httpClient: HttpClient
  ) { }

  ngOnInit() {}
dismiss(){
    this.modalController.dismiss()
  }
  onStartDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.startDate = selectedDate
    console.log('selectedDate', selectedDate);
    // if (this.startDate && this.endDate) {
    //   const data = {
    //     startDate: this.startDate,
    //     endDate: this.endDate
    //   };
    //   console.log('Report Data:', data);
    //   this.reportGetItems(data);
    // }
}

onEndDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.endDate = selectedDate
    console.log('selectedDate', selectedDate);
    // if (this.startDate && this.endDate) {
    //   const data = {
    //     startDate: this.startDate,
    //     endDate: this.endDate
    //   };
    //   console.log('Report Data:', data);
    //   this.reportGetItems(data);
    // }
}

reportGetItems(data: any) {
  // let parm = new HttpParams()
  //   .set('StartDate', data.startDate)
  //   .set('EndDate', data.endDate);
  //   this.httpService.reportGetItems(parm).subscribe((res: any) => {
  //   this.controller.hideloader();
  //     console.log('Report Get Items:', res);
  //   });
  this.controller.showloader();
  this.httpClient.get('https://paintflow.runasp.net/api/Report/GetItems', {
  params: {
    StartDate: data.startDate,
    EndDate: data.endDate
  },
  responseType: 'text'  // <-- IMPORTANT
}).subscribe({
  next: (res: string) => {
    this.controller.hideloader()
    console.log('Report URL:', res);
    this.modalController.dismiss();
    // You can now use this URL to download or open the file
    window.open(res, '_blank');
  },
  error: (err) => {
    this.controller.hideloader()
    this.controller.showToast('Error fetching report');
    this.modalController.dismiss();
    console.error('Download error:', err);
  }
});

  }
  submitDates() {
    if (this.startDate && this.endDate) {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      console.log('Report Data:', data);
      this.reportGetItems(data);
    } else {
      this.controller.showToast('Please select both start and end dates');
    }
  }
  downloadReport() {

  }
}
