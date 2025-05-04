import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ControllerService } from 'src/app/services/controller.service';
@Component({
  selector: 'app-change-rate',
  templateUrl: './change-rate.page.html',
  styleUrls: ['./change-rate.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChangeRatePage implements OnInit {

  pageTitles = "Change Rate" 
  teamData: any 
  originalData: any
  rate ="EXTR"

  constructor(
            private httpService: HttpService,
                private controller: ControllerService,
            
    
  ) { }

  ngOnInit() {
    this.getPaintDescriptionGet();
  }
  backToDashboardPage() {
    window.history.back();
  }
  getPaintDescriptionGet(){
    this.httpService.getPaintDescriptionGet().subscribe((res: any) => {
      console.log('getPaintDescriptionGet', res);
      const paintList = res.item1; 
      const groupedByTeam = paintList.reduce((groups: any, item: any) => {
        if (!groups[item.team]) {
          groups[item.team] = [];
        }
        groups[item.team].push(item);
        return groups;
      }, {} as { [key: string]: any[] });
      this.teamData = groupedByTeam; // Assign the grouped data to teamData
      console.log('Grouped Data:', groupedByTeam);
      this.teamData = Object.entries(groupedByTeam);
      this.originalData = JSON.parse(JSON.stringify(this.teamData));
    })
  }
  // getGroupedItems(): [string, any[]][] {
  //   return Object.entries(this.teamData);
  // }

  submitChangedRates() {
    const changedItems = [];

    for (const teamName of Object.keys(this.teamData)) {
      const currentItems = this.teamData[teamName];
      const originalItems = this.originalData[teamName];
    
      for (let i = 0; i < currentItems[1].length; i++) {
        const current = currentItems[1][i];
        const original = originalItems?.[1][i];
    
        if (original && current.internalRate !== original.internalRate || current.externalRate !== original.externalRate) {
          changedItems.push({
            id: current.id,
            internalRate: current.internalRate,
            externalRate: current.externalRate
          });
        }
      }
    }
    
    console.log('Changed Items:', changedItems);
    if (changedItems.length > 0) {
      this.paintDescriptionUpdateRate(changedItems);
    } else {
      console.log('No changes to submit');
    }
  }    
  

  segment(event: any){
    this.rate =  event.target.value;
  }

  paintDescriptionUpdateRate(datas: any) {
    this.controller.showloader();

    from(datas).pipe(
      concatMap(data => this.httpService.paintDescriptionUpdateRate(data))
    ).subscribe(
      (res: any) => {
        console.log('Response:', res);
      },
      (error) => {
        console.error('Error occurred:', error);
      },
      () => {
        // This will run after all requests are completed
    this.controller.hideloader();

        this.backToDashboardPage();
      }
    );
  }

}
