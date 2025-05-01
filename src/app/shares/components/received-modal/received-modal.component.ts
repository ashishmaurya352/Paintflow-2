import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
// import { ReceivedModalComponent } from './received-modal.component';
// ``````typescript
@Component({
  selector: 'app-received-modal',
  templateUrl: './received-modal.component.html',
  styleUrls: ['./received-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReceivedModalComponent  implements OnInit {


  // @Input() isOpen = false;  // Control modal visibility
  @Input() totalQuantity = 0;  // Control modal visibility
  @Input() getquantity:any = 0;  // Control modal visibility
  @Input() itemName:any = 'itemName';  // Control modal visibility
  @Input() teams = []  // Control modal visibility
  @Input() teams2 = []  // Control modal visibility
  @Input() height = false
  @Input() isCompleted :any
  @Input() PaintDescription = []  // Control modal visibility

  
  
  @Output() dismiss = new EventEmitter<void>(); // Close event
  @Output() quantitySubmitted = new EventEmitter<any>(); // Pass quantity value
  quantity = 0;
  selectedTeam: string | null = null
  loginTeam:any
  PaintDescriptionlist: any[][] = [];

  constructor(
    private modalCtrl: ModalController,
  ){}
  ngOnInit() {
    console.log('this.teams',this.teams2)
    console.log('this.PaintDescription',this.PaintDescription)
    this.loginTeam = localStorage.getItem('team')

    this.quantity = this.getquantity == 0 ? this.totalQuantity : this.getquantity;  // Update the quantity based on new input value

  }
  closeModal() {
    if (this.teams.length === 0) {
      // this.quantitySubmitted.emit(0);
      // this.modalCtrl.dismiss();

    }
    this.modalCtrl.dismiss();
  }
  itemPaintDescriptions: { team: string; paintDescriptionId: number }[] = [];
  submitQuantity() {
     this.itemPaintDescriptions = [];

    for (let i = 0; i < Math.min(this.selectList.length, this.selectList2.length); i++) {
      const team = this.selectList[i].selectedOptionLabel;
      const paintDescriptionId = this.selectList2[i].id || 0;
  
      this.itemPaintDescriptions.push({
        team: team || '',
        paintDescriptionId: typeof paintDescriptionId === 'number' ? paintDescriptionId : 0
      });
    }
  
    console.log(this.itemPaintDescriptions);
    const data = {
      quantity: this.quantity,
      // team:this.selectedTeam,
      itemPaintDescriptions: this.itemPaintDescriptions,
    }
    this.modalCtrl.dismiss(data);
    

    // if(this.quantity > this.totalQuantity){
    //   this.quantity = this.totalQuantity
    // }
    // if(this.teams.length > 0 || this.isCompleted){
    // // if(this.teams.length > 0){
     
    //   // this.quantitySubmitted.emit(data);
    // }else{
    //   this.modalCtrl.dismiss(this.quantity);

    //   // this.quantitySubmitted.emit(this.quantity);
    // }
    // this.dismiss.emit();
  }

  selectTeam(team: string) {
    this.selectedTeam = team;
  }

  addSelect() {
    this.selectList.push({
      // value: null,
      selectedOptionLabel: '',
      isPopoverOpen: false,
      popoverEvent: null
    });
  }

  isDropdownOpen = false;

selectedOption: any;
selectedOptionLabel!: string;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}


selectList = [
  { selectedOptionLabel: '', isPopoverOpen: false, popoverEvent: null }
];
selectList2:any = [
  
];

openPopover(ev: any, i: number) {
  this.selectList[i].popoverEvent = ev;
  this.selectList[i].isPopoverOpen = true;
}

selectOption(option: any, i: number) {
  this.selectList[i].selectedOptionLabel = option;
  this.selectList[i].isPopoverOpen = false;

  this.PaintDescriptionlist[i] = this.PaintDescription[option] || [];

  // Assign second list data conditionally
  if (!this.selectList2[i]) {
    this.selectList2[i] = { selectedOptionLabel: '', id:'', isPopoverOpen: false, popoverEvent: null };
  }

  if (this.PaintDescriptionlist.length > 0) {
    this.selectList2[i].isPopoverOpen = true;
  } else {
    this.selectList2[i].isPopoverOpen = false;
  }
}



selectSecondOption(option: any, i: number) {
  this.selectList2[i].selectedOptionLabel = option.name;
  this.selectList2[i].id = option.id;
  this.selectList2[i].isPopoverOpen = false;
}
openSecondPopover(ev: any, i: number) {
  if (!this.selectList2[i]) {
    this.selectList2[i] = { selectedOptionLabel: '', id:'', isPopoverOpen: false, popoverEvent: null };
  }
  this.selectList2[i].popoverEvent = ev;
  this.selectList2[i].isPopoverOpen = true;
}


removeSelect(i: number) {
  this.selectList.splice(i, 1);
  this.selectList2.splice(i, 1);
  this.PaintDescriptionlist.splice(i, 1);
}

}

