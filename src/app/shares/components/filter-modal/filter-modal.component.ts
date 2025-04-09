import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FilterModalComponent  implements OnInit {
  sortByName:any
  priorityName:any
  startDate: string;
  endDate: string;
  range: number = 0;
  rangeApplied: boolean = false;
  constructor() { 
    const currentDate = new Date().toISOString();
    this.startDate = currentDate;
    this.endDate = currentDate;
  }

  ngOnInit() {}
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
  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    console.log('selectedDate',selectedDate)
  }

}
