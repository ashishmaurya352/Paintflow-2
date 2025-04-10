import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FilterModalComponent implements OnInit {
  @Input() page: any;
  @Input() usereRole: any;
  @Input() tab: any;
  @Input() filter: any ={
    StartDate:'',
    EndDate:'',
    SortBy:'',
    Priority:'',
    IsDecsending:false
  }
  sortByName: any
  priorityName: any
  startDate: any = null
  endDate: any = null
  range: number = 0;
  rangeApplied: boolean = false;
  isDescending = false
  constructor(
            private modalController: ModalController,
    
  ) {
  }

  ngOnInit() {
    console.log('filter', this.filter);
    console.log('tab', this.tab);
  
    if (this.filter?.StartDate) {
      this.startDate = this.filter.StartDate;
    }
  
    if (this.filter?.EndDate) {
      this.endDate = this.filter.EndDate;
    }
  
    this.sortByName = this.filter?.SortBy || '';
    this.priorityName = this.filter?.Priority || '';
    this.isDescending = this.filter?.IsDecsending || false
   }


  sortBy(name: string) {
    console.log('sortByName', name);
    this.sortByName = name
  }
  priority(name: string) {
    console.log('sortByName', name);
    this.priorityName = name
  }
  applyRange() {
    // Apply the range logic to calculate days between start and end date
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    this.range = Math.ceil(diffTime / (1000 * 3600 * 24));
    this.rangeApplied = true;
  }
  onStartDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.startDate = selectedDate
    console.log('selectedDate', selectedDate)
  }
  onEndDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.endDate = selectedDate
    console.log('selectedDate', selectedDate)
  }

  resetFilter(){
    if(this.usereRole == 'Inward Manager'){
        let SortBy
      if(this.tab == 'UnAssigned'){
        SortBy = 'CreatedDate'
      }
      else{
        SortBy = 'AssignedDate'
      }
      this.filter = {
        StartDate:'',
        EndDate:'',
        SortBy:SortBy,
        Priority:'',
        IsDecsending:1
      };
      this.startDate = '';
      this.endDate = '';
      this.sortByName = SortBy;
      this.priorityName = '';
      this.isDescending = false
    }
    else{
      this.filter = {
        StartDate:'',
        EndDate:'',
        SortBy:'',
        Priority:'',
        IsDecsending:1
      };

      this.startDate = '';
      this.endDate = '';
      this.sortByName = '';
      this.priorityName = '';
      this.isDescending = false

    }
  }
  

  submit(){
    this.filter = {
      StartDate: this.startDate,
      EndDate: this.endDate,
      SortBy: this.sortByName,
      Priority: this.priorityName,
      IsDecsending: this.isDescending
    };
    this.modalController.dismiss(this.filter); 
  }

  segment(event: any){
    this.isDescending =  event.target.value;
    // this.getPaintDescWiseCostOverview()
  }
  

}
