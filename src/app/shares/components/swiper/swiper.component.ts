import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import Swiper from 'swiper';
import{register} from 'swiper/element/bundle'
register()

// Import Swiper styles
import 'swiper';

// SwiperCore.use([Pagination, Zoom]);

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule],
})
export class SwiperComponent  {
  @Input() Images:any
  @ViewChild('swiper')
  swiperRef:any;
  swiper?:Swiper
  initialSlideIndex = 2

  constructor(
    private modalCtrl: ModalController,
  ) { }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  swiperSlideChanged(e:any){
    console.log('change: ', e)
  }
  swiperReady(){
    this.swiper = this.swiperRef?.nativeElement.swiper
  }
}
