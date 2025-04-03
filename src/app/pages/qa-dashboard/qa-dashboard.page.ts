import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-qa-dashboard',
  templateUrl: './qa-dashboard.page.html',
  styleUrls: ['./qa-dashboard.page.scss'],
  
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QaDashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
