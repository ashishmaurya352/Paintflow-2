import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-qa-dashboard',
  templateUrl: './qa-dashboard.page.html',
  styleUrls: ['./qa-dashboard.page.scss'],
  
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QaDashboardPage implements OnInit {
  teamList: any[] = []

  constructor(private httpService: HttpService,
    private router: Router,
        private controller: ControllerService

  ) { }

  ngOnInit() {
    this.getQADashboard()
  }
  getQADashboard(){
  this.controller.showloader()

    this.httpService.getQADashboard().subscribe((data: any) => {
      this.teamList = data
      console.log('QADashboard', data)
      this.controller.hideloader()

    },(error) => {
      this.controller.hideloader()
    });
  }
  showData(item: any) {
    const team = item.team;
    this.router.navigate(['/order'],{ queryParams: { team: team }})
  }
  logout() {
    localStorage.clear();
      this.router.navigate(['/login']).then(() => {
        if (Capacitor.getPlatform() === 'android') {
              window.location.reload();
            }
      });
  }

}
