import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-swiper-modal',
  templateUrl: './swiper-modal.component.html',
  styleUrls: ['./swiper-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwiperModalComponent implements OnInit {

  @Input() images: string[] = [];
  @Input() isOpen: boolean = false;
  @Input() selectedIndex: number = 0;
  @Output() close = new EventEmitter<void>();

  ngOnInit() { }
  closeModal() {
    this.isOpen = false;
    this.close.emit();
  }

}
