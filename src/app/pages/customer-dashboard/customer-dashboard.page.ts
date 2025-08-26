import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { IonicModule } from '@ionic/angular';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';
import { HttpParams } from '@angular/common/http';
import { ChartComponent } from 'src/app/shares/components/chart/chart.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.page.html',
  styleUrls: ['./customer-dashboard.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, ChartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerDashboardPage implements OnInit {
  challanNO: string = '';
   itemList:any[] = []
  searchTerm: string = '';
filteredItems = [...this.itemList];

  constructor(private httpService: HttpService,
    private router: Router,
        private controller: ControllerService) { }

  ngOnInit() {
  }

  logout() {
      localStorage.clear();
        this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
          // Only reload if necessary
          // if (Capacitor.getPlatform() === 'android') {
            setTimeout(() => window.location.reload(), 100); // small delay improves stability
          // }
        });
    }

    toggleItem(index: number) {
  this.filteredItems = this.filteredItems.map((item, i) => ({
    ...item,
    expanded: i === index ? !item.expanded : false
  }));
}

filterItems() {
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.itemList
      .filter(item => item.partNumber.toLowerCase().includes(term))
      .map(item => ({ ...item, expanded: false }));
  }

  // getChallan() {
  //   const data = {
  //     keyword: this.challanNO.trim()
  //   };
  //   let parm = new HttpParams().set('keyword', this.challanNO.trim());
    
  //   this.httpService.itemGetBySlipNumber(parm).subscribe(response => {
  //     this.itemList = response;
  //     this.filteredItems = [...this.itemList];

  //     console.log('Item details:', response);
  //   });
  // }
  getChallan(): void {
  const challan = this.challanNO?.trim();

  if (!challan) {
    console.warn('Challan number is empty.');
    return;
  }

  const params = new HttpParams().set('keyword', challan);

      this.controller.showloader();


  this.httpService.itemGetBySlipNumber(params)
    .pipe(finalize(() => this.controller.hideloader()))
    .subscribe({
      next: (response) => {
        this.itemList = response;
        this.filteredItems = [...this.itemList];

        console.log('Item details:', response);
      },
      error: async (error) => {
        if (error.status === 404) {
          console.warn('Challan not found.');
          this.itemList = [];
          this.filteredItems = [];

          // Optional: show a toast/snackbar/dialog
          await this.controller.showToast('No items found for this Challan number.', 'bottom', 3000);
        } else {
          console.error('API error:', error);
          await this.controller.showToast('An unexpected error occurred.', 'bottom', 3000);
        }
      }
    });
}


details:any

  itemGetSummary(id:any) {
    this.details = []
    let parm = new HttpParams().set('id', id);

    console.log('Item ID:', id);
    this.httpService.itemGetSummary(parm).subscribe(response => {
      this.details = response;
      console.log('Item summary:', response);
    });
  }


}
