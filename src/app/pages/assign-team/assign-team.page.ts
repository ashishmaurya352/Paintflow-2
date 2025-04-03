import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-assign-team',
  templateUrl: './assign-team.page.html',
  styleUrls: ['./assign-team.page.scss'],
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AssignTeamPage implements OnInit {
  pageTitles = "Priority & Assign Team"
  teams: any[] = []
  selectedTeam: string | null = null;
  itemList: any;
  requisitionId: any;
  priority: string = 'Low'; // Default priority value

  constructor(
    private router: Router,
    private route: ActivatedRoute,
        private httpService: HttpService,
        private controller: ControllerService
  ) { 
    // addIcons({arrowBack,exit,funnel});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['items']) {
        this.itemList = JSON.parse(params['items']); // Parse the items array
      }
      if (params['id']) {
        this.requisitionId = params['id']; // Get the requisition ID
      }
    });
    this.getTeams()
  }

  getTeams(){
    // this.controller.showloader()
    this.httpService.getTeams()
    .subscribe(
      (res: any) => {
        // this.controller.hideloader()
        this.teams = res;
        console.log(res);
      },(error) => {
        // this.controller.hideloader()
      });
  }
  selectTeam(team: string) {
    this.selectedTeam = team === this.selectedTeam ? null : team;
  }

  assignTeam(){
    if (!this.selectedTeam) {
      console.log('No team selected');
      return;
    }
    const data = {
      "requisitionId": this.requisitionId,
      "team": this.selectedTeam,
      "priority": this.priority,
      "items": this.itemList
  }
  this.controller.showloader()
  this.httpService.assignItemProcess(data)
    .subscribe((res:any)=>{
      this.controller.hideloader()
      console.log(res);
      console.log('res');
      const segmentValue = 'queue';
      this.router.navigate(['/order'], { state: { segmentValue } });
    },(error) => {
      this.controller.hideloader()
    });
    // this.router.navigate
  }

  backToRequisitionPage(){
    this.router.navigate(['/requisition'], { queryParams: { id: this.requisitionId } });
  }

  onStatusChange(event: any) {
    this.priority = event.detail.value;}


}
