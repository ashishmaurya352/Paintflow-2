import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
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
export class SearchModalComponent  implements OnInit {
  @Input() id:any ; 
  @Input() status:any; 
  results: any[] = []; // Array to store search results
  constructor(
        private modalController: ModalController,
        private controller: ControllerService,
        private httpService: HttpService,
  ) { }

  ngOnInit() {}

  closeModal() { 
    this.modalController.dismiss();
  }
  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
      const parm = new HttpParams().set('id', this.id).set('status', this.status).set('keyword', query);

    this.httpService.getItemSearchItem(parm).subscribe((res: any) => {
      console.log('Search results:', res);
      this.results= res
      // Handle the search results here
      // this.results = response; // Assuming response contains the search results
    })
    // Simulate a search operation
    // this.results = query ? ['Apple', 'Banana', 'Orange'].filter(item => item.toLowerCase().includes(query)) : [];
  }

}
