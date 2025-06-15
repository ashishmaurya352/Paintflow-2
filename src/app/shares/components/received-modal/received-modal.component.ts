import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { Colors } from 'chart.js';
import { ControllerService } from 'src/app/services/controller.service';
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
export class ReceivedModalComponent implements OnInit {


  // @Input() isOpen = false;  
  @Input() totalQuantity = 0;
  @Input() getquantity: any = 0;
  @Input() itemName: any = 'itemName';
  @Input() teams2 = []
  @Input() height = false
  @Input() isCompleted: any
  @Input() PaintDescription = []
  @Input() isInwardManager = false
  @Input() isSingle = true


  @Output() dismiss = new EventEmitter<void>(); // Close event
  quantity = 0;
  selectedTeam: string | null = null
  loginTeam: any
  PaintDescriptionlist: any[][] = [];
  paintDescriptionColors: any[][] = [];
  color: any
  selectedPriority: any = 'Low'; // Default priority
  prioritys = ['High', 'Medium', 'Low'];
  constructor(
    private modalCtrl: ModalController,
        private controller: ControllerService

  ) { }
  ngOnInit() {
    // console.log('this.teams', this.teams2)
    // console.log('this.PaintDescription', this.PaintDescription)
    this.loginTeam = localStorage.getItem('team')

    this.quantity = this.getquantity == 0 ? this.totalQuantity : this.getquantity;  // Update the quantity based on new input value

  }
  closeModal() {
    // if (this.teams.length === 0) {
    //   // this.quantitySubmitted.emit(0);
    //   // this.modalCtrl.dismiss();

    // }
    this.modalCtrl.dismiss();
  }
  itemPaintDescriptions: { team: string; paintDescriptionId: number }[] = [];
  submitQuantity() {
    console.log('this.quantity', this.quantity)
    if (this.quantity >= 0) {
      console.error('Quantity must be greater than 0');
      if (this.isInwardManager) {
        if (this.selectList[0].selectedOptionLabel === '') {
          this.controller.showToast('Please Select Team');
          return
        }
        this.itemPaintDescriptions = [];

        const length = Math.max(this.selectList?.length || 0, this.selectList2?.length || 0, this.selectList3?.length || 0);

        for (let i = 0; i < length; i++) {
          const team = this.selectList?.[i]?.selectedOptionLabel || '';
          const paintDescriptionId = this.selectList2?.[i]?.id ?? 0;
          const color = this.selectList3?.[i]?.selectedColor || '';

          this.color = color;

          console.log('team', team, 'paintDescriptionId', paintDescriptionId, 'color', color);

          this.itemPaintDescriptions.push({
            team,
            paintDescriptionId: typeof paintDescriptionId === 'number' ? paintDescriptionId : 0,
          });

          console.log('this.itemPaintDescriptions', this.itemPaintDescriptions);
        }


        console.log(this.itemPaintDescriptions);
        if (!this.isSingle) {
          this.quantity = this.totalQuantity
        }
        const data = {
          quantity: this.quantity,
          color: this.color,
          selectedPriority: this.selectedPriority,
          // team:this.selectedTeam,
          itemPaintDescriptions: this.itemPaintDescriptions,
        }
        this.modalCtrl.dismiss(data);
      }
      else {
        this.modalCtrl.dismiss({ quantity: this.quantity });
      }
    }


  }

  selectTeam(team: string) {
    this.selectedTeam = team;
  }

  addSelect() {
    this.selectList.push({
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
  selectList2: any = [];
  selectList3: any = [];

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
      this.selectList2[i] = { selectedOptionLabel: '', id: '', isPopoverOpen: false, popoverEvent: null };
    }

    if (this.PaintDescriptionlist.length > 0) {
      this.selectList2[i].isPopoverOpen = true;
    } else {
      this.selectList2[i].isPopoverOpen = false;
    }
    console.log('this.selectList', this.selectList);
  }



  selectSecondOption(option: any, i: number) {
    this.selectList2[i].selectedOptionLabel = option.name;
    this.selectList2[i].id = option.id;
    this.selectList2[i].isPopoverOpen = false;

    if (!this.selectList3[i]) {
      this.selectList3[i] = { selectedColor: '', isPopoverOpen: false, popoverEvent: null };
    }

    if (option.paintDescriptionColors.length > 0) {
      this.selectList3[i].isPopoverOpen = true;
    } else {
      this.selectList3[i].isPopoverOpen = false;
    }
    this.paintDescriptionColors[i] = option.paintDescriptionColors || [];
  }

  openThirdPopover(ev: any, i: number) {
    if (!this.selectList3[i]) {
      this.selectList3[i] = { selectedColor: '', isPopoverOpen: false, popoverEvent: null };
    }
    this.selectList3[i].popoverEvent = ev;
    this.selectList3[i].isPopoverOpen = true;
  }

  selectSecondThirdOption(option: any, i: number) {
    this.selectList3[i].selectedColor = option;
    this.selectList3[i].isPopoverOpen = false;
  }

  openSecondPopover(ev: any, i: number) {
    if (!this.selectList2[i]) {
      this.selectList2[i] = { selectedOptionLabel: '', id: '', isPopoverOpen: false, popoverEvent: null };
    }
    this.selectList2[i].popoverEvent = ev;
    this.selectList2[i].isPopoverOpen = true;
  }


  removeSelect(i: number) {
    this.selectList.splice(i, 1);
    this.selectList2.splice(i, 1);
    this.selectList3.splice(i, 1);
    this.PaintDescriptionlist.splice(i, 1);
  }
  onQuantityChange() {
    if (this.quantity > this.totalQuantity) {
      this.quantity = this.totalQuantity;
    }
  }
  selectpriority(priority: any) {
    this.selectedPriority = priority.detail?.value || priority;
  }

}

