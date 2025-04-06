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
  @Input() height = false
  @Output() dismiss = new EventEmitter<void>(); // Close event
  @Output() quantitySubmitted = new EventEmitter<any>(); // Pass quantity value
  quantity = 0;
  selectedTeam: string | null = null
  constructor(
    private modalCtrl: ModalController,
  ){}
  ngOnInit() {
    this.quantity = this.getquantity == 0 ? this.totalQuantity : this.getquantity;  // Update the quantity based on new input value

  }
  
  // ngOnChanges(changes: SimpleChanges) {
  //   // Detect changes for the 'getquantity' input property
  //   if (changes['getquantity']) {
  //     // const currentQuantity = changes['getquantity'].currentValue;
  //     // // console.log('Detected getquantity change:', currentQuantity);
  //     // this.quantity = currentQuantity;  // Update the quantity based on new input value
  //   }
  //   console.log('this.teams',this.teams)

  //   this.quantity = this.totalQuantity;  // Update the quantity based on new input value
  // }

  closeModal() {
    if (this.teams.length === 0) {
      // this.quantitySubmitted.emit(0);
      // this.modalCtrl.dismiss();

    }
    // this.dismiss.emit();
    this.modalCtrl.dismiss();
  }
  submitQuantity() {
    if(this.quantity > this.totalQuantity){
      this.quantity = this.totalQuantity
    }
    if(this.teams.length > 0){
      const data = {
        quantity: this.quantity,
        team:this.selectedTeam
      }
      this.modalCtrl.dismiss(data);
      
      // this.quantitySubmitted.emit(data);
    }else{
      this.modalCtrl.dismiss(this.quantity);

      // this.quantitySubmitted.emit(this.quantity);
    }
    // this.dismiss.emit();
  }

  selectTeam(team: string) {
    this.selectedTeam = team;
  }

}
