import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonSearchbar, ModalController } from '@ionic/angular';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchModalComponent  implements OnInit, AfterViewInit  {
  @ViewChild('searchbar', { static: false }) searchbar!: IonSearchbar;
  @Input() id:any ; 
  @Input() status:any; 
  @Input() team: any; 
  results: any[] = []; 
  notfound = false
  usereRole: any

  constructor(
        private modalController: ModalController,
        private controller: ControllerService,
        private httpService: HttpService,
  ) { }
  ngAfterViewInit() {
     setTimeout(() => {
      if (this.searchbar) {
        this.searchbar.setFocus();
      }
    }, 500);
  }

  async ngOnInit() {
    this.usereRole = await this.getUserRoleFromLocalStorage();
    // this.team =  localStorage.getItem('role')
  }
  getUserRoleFromLocalStorage(): Promise<string | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localStorage.getItem('role'));
      }, 100);
    });
  }

  closeModal() { 
    this.id = null;
    this.modalController.dismiss();
  }
  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    if (!query) {
      this.notfound = false
      this.results = []; // Clear results if the query is empty
      return;
    }
    // if(query.length < 3) {
        this.id?this.getItemSearchItem(query):this.getRequisitionSearch(query)
    // }
  }

  sendItem(item: any) {
    this.id = item.id;
    this.modalController.dismiss(item); 
  }

  getItemSearchItem(query: string) {
    const parm = new HttpParams().set('id', this.id).set('keyword', query);
    this.httpService.getItemSearchItem(parm).subscribe((res: any) => {
      this.results= res
      res.length === 0 ? this.notfound = true : this.notfound = false

    })
  }

  getRequisitionSearch(query: string) {
    let parm: any;
    if(this.usereRole == 'Admin'){
     parm = new HttpParams().set('keyword', query).set('team', this.team);

    }else{
       parm = new HttpParams().set('keyword', query);

    }
    this.httpService.getRequisitionSearch(parm).subscribe((res: any) => {
      this.results= res
      res.length === 0 ? this.notfound = true : this.notfound = false
     
    })
  }


}
