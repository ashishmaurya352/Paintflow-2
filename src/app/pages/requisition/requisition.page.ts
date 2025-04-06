import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ModalController } from '@ionic/angular';
import { tap, catchError, of } from 'rxjs';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';
import { ImgModalComponent } from 'src/app/shares/components/img-modal/img-modal.component';
import { ReceivedModalComponent } from 'src/app/shares/components/received-modal/received-modal.component';
import { SwiperComponent } from 'src/app/shares/components/swiper/swiper.component';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.page.html',
  styleUrls: ['./requisition.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RequisitionPage implements OnInit {

  defaultImageUrl = 'assets/img/mountain.png';

  filter: any = {
    PageNumber: 1,
    PageSize: 20,
    StartDate: null,
    EndDate: null,
    // SortBy
    Keyword: null,
    Status: null,
  }
  finalPage: boolean = false; // Flag to indicate if it's the last page

  requisitionId: any
  RequisitionItemLists: any[] = []
  usereRole: any;
  pageTitles = "Challan No. "
  isModalOpen = false;
  index: number = 0
  UpdatedItemLists: any[] = [];
  itemChecked: boolean[] = []
  selectedItem: any = []
  selectedOption: string = 'Medium';
  isSearchbarVisible = false;
  results: string[] = [];
  slipNumber: any;
  selectedItemImage: any = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private controller: ControllerService,
    private modalController: ModalController,
    // private alertController: AlertController
  ) {
    // addIcons({arrowBack,search,filterOutline,ellipsisVertical,close,exit});

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      
      console.log('params', params)
      this.requisitionId = params['id'];
      this.slipNumber = params['slipNumber'];
    });

    this.usereRole = localStorage.getItem('role');

    if (this.usereRole === 'Inward Manager') {
      // this.pageTitles = "Recently Created Requisitions"
    }

    this.getItem();
    

  }

  backToOrderPage() {
    let segmentValue = 'InQueue';
    if (this.usereRole === 'Inward Manager') {
     segmentValue = 'UnAssigned';
      this.router.navigate(['/order'], { queryParams: { segmentValue } });
      return;
    }
    this.router.navigate(['/order'], { queryParams: { segmentValue } });
  }

  // openModal(i: number, item: any) {
  //   console.log('openModal')
  //   this.isModalOpen = true;
  //   this.index = i;
  //   this.quantity = this.UpdatedItemLists[i].quantity;
  //   this.totalQuantity = item.quantity;
  //   this.partDesciption = item.partDesciption;

  // }

  //  [index]="index" [itemName]="partDesciption"
  //   [getquantity]="quantity" (dismiss)="isModalOpen = false" (quantitySubmitted)="handleQuantitySubmitted($event)">
  async openModal(i: number, item: any) {
    // this.index = i;
    let totalQuantity
    if(this.usereRole === 'Inward Manager'){
      totalQuantity = item.quantity;
    }else{
      totalQuantity = item.curretProcess.quantity;
    }
    const modal = await this.modalController.create({
      component: ReceivedModalComponent,
      componentProps: {
        'totalQuantity': totalQuantity,
        'getquantity': this.UpdatedItemLists[i].quantity,
        itemName: item.partDesciption,
      },
      cssClass: 'quantity-modal',
    });
    modal.onDidDismiss().then((dataReturned: any) => {
      console.log('Modal data:', dataReturned);
      if (dataReturned.data !== undefined) {
        this.UpdatedItemLists[i].quantity = dataReturned.data;
        this.itemChecked[i] = dataReturned.data > 0;
      }
      else {
        console.log('No data returned from modal');
        this.itemChecked[i] = false;
      }
    });
    await modal.present();
    // this.modalFab.dismiss()
  }

  // handleQuantitySubmitted(quantity: any) {

  // }

  getItem() {
    let params = new HttpParams()
      .set('RequisitionId', this.requisitionId)
      .set('Status', 'InQueue');
  
    // Add additional filter parameters if they are not null
    Object.keys(this.filter).forEach(key => {
      if (this.filter[key] !== null) {
        params = params.set(key, this.filter[key]);
      }
    });
  
    // Show loader
    this.controller.showloader();
  
    // Make HTTP call
    this.httpService.getItem(params).subscribe(
      (res: any) => {
        this.addcss();
        if(res.length < 20) {
          this.finalPage = true; // Set finalPage to true if no items are returned
        }
        // Hide loader after response
        this.controller.hideloader();
  
        // If it's the first page, replace the list, otherwise append to it
        if (this.filter.PageNumber === 1) {
          this.RequisitionItemLists = res;
        } else {
          this.RequisitionItemLists = [...this.RequisitionItemLists, ...res];
        }
        // Set checkboxes for each item
        this.itemChecked = [...this.itemChecked, ...res.map(() => false)];
        // Handle user roles and map the updated item list accordingly
        if (this.usereRole === 'Executive') {
          if (this.filter.PageNumber === 1) {
            this.UpdatedItemLists = res.map((item: any) => ({
              itemProcessId: item.currentProcess_Id,
              quantity: 0,
            }));
          } else {
            this.UpdatedItemLists = [...this.UpdatedItemLists, ...res.map((item: any) => ({
              itemProcessId: item.currentProcess_Id,
              quantity: 0,
            }))];
          }
        } else if (this.usereRole === 'Inward Manager') {
          if (this.filter.PageNumber === 1) {
            console.log('this.filter.PageNumber', this.filter.PageNumber)
            this.UpdatedItemLists = res.map((item: any) => ({
              itemId: item.id,
              quantity: 0,
              priority: 'Low',
            }));
          } else {
            console.log('this.filter.PageNumber ', this.filter.PageNumber)

            this.UpdatedItemLists = [...this.UpdatedItemLists, ...res.map((item: any) => ({
              itemId: item.id,
              quantity: 0,
              priority: 'Low',
            }))];
          }
        }
      },
      (error) => {
        // Hide loader in case of error
        this.controller.hideloader();
  
        // Optionally, log the error or display a user-friendly message
        console.error('Error fetching items:', error);
      }
    );
  }
  
  acceptItems() {
    const items = this.UpdatedItemLists.filter((item, i) => this.itemChecked[i]);

    if (this.usereRole === 'Executive') {
      const data = {
        requisitionId: this.requisitionId,
        items: items
      };
      this.controller.showloader()
      // const segmentValue = 'Active';
      // this.router.navigate(['/order'], { queryParams: { segmentValue } });

      this.httpService.acceptItemForProcess(data).subscribe(() => {
        this.controller.hideloader()
        const segmentValue = 'Active'
        // const segmentValue = 'Active';
        this.router.navigate(['/order'], { queryParams: { segmentValue } });
      }, (error) => {
        this.controller.hideloader()
      });
    } else if (this.usereRole === 'Inward Manager') {
      this.router.navigate(['/assign-team'], { queryParams: { items: JSON.stringify(items), id: this.requisitionId } });
    }
  }

  addcss() {
    // Check if we're on the requisition page
    const isRequisitionPage = window.location.pathname === '/requisition' && window.location.search.startsWith('?id=');

    if (!isRequisitionPage) {
      return; // Exit the function if not on the requisition page
    }
    const observer = new MutationObserver(() => {
      document.querySelectorAll("ion-select").forEach((ionSelect) => {
        // Ensure ion-select has shadowRoot and check for existing styles
        if (ionSelect.shadowRoot && !ionSelect.shadowRoot.querySelector("style.custom-style")) {
          try {
            console.log("✅ Styling dynamically added ion-select");

            // Create style element and add the styles
            const style = document.createElement("style");
            style.classList.add("custom-style");
            style.textContent = `
              .select-outline-container {
                height: 32px !important;
                left: 20px !important;
                width: 80% !important;
              }
              .select-wrapper-inner {
                display: block !important;
              }
            `;

            // Append to shadow DOM
            ionSelect.shadowRoot.appendChild(style);
          } catch (error) {
            console.error("Error while adding custom styles to ion-select:", error);
          }
        }
      });
    });

    // Observe the entire document for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      console.log("Stopping the observer");
      observer.disconnect(); // Stop observing
    }, 2000);
  }




  toggleSearch() {
    this.isSearchbarVisible = !this.isSearchbarVisible;
  }
  handleInput(event: any) {
    const query = event.target.value.toLowerCase();

    // Simulate a search operation
    this.results = query ? ['Apple', 'Banana', 'Orange'].filter(item => item.toLowerCase().includes(query)) : [];
  }

  onStatusChange(event: any, index: number): void {
    const newStatus = event.detail.value;

    this.UpdatedItemLists[index].priority = newStatus;
  }

  getBadgeColor(priority: string): string {
    switch (priority) {
      case 'High':
        return '#EC4949'; // Red
      case 'Low':
        return '#A5A5A5'; // Gray
      case 'Medium':
        return '#E8B500'; // Yellow
      default:
        return '#4e6e7c'; // Default color
    }
  }
  disabledAcceptItems() {
    const items = this.UpdatedItemLists.filter((item, i) => this.itemChecked[i]);
    return items.length === 0;
  }

  // onImageSelected(event: any, index: number) {

  //   const file = event.target.files[0]; // Get the first selected file
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       // Update the item's image source with the selected image
  //       this.UpdatedItemLists[index].images = reader.result as string;
  //       console.log('Image selected:', this.UpdatedItemLists);
  //     };
  //     reader.readAsDataURL(file); // Read the image file as a data URL
  //   }
  // }
  onImageSelected(event: any, index: number) {
    const files = event.target.files; // Get all selected files
    if (files && files.length > 0) {
      const fileReaders: Promise<any>[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        // Read each file and push the promises into the fileReaders array
        const fileReaderPromise = new Promise<any>((resolve, reject) => {
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        fileReaders.push(fileReaderPromise);
      }

      // Once all images are read, update the item's imageSrc array with the results
      Promise.all(fileReaders).then((results: any[]) => {
        this.UpdatedItemLists[index].images = results; // Store an array of images for the item
        console.log('Image selected:', this.UpdatedItemLists);

      }).catch((error) => {
        console.error('Error reading files:', error);
      });
    }
  }

  getImageSrc(index: number) {
    // Ensure that images exists and has at least one element
    let images
     if(this.usereRole === 'Inward Manager'){
       images = this.UpdatedItemLists[index].images;
    return images  ? images[0] : this.defaultImageUrl;

      } else if(this.usereRole === 'Executive'){
        images = this.RequisitionItemLists[index]?.imageUrl;
    return images  ? images : this.defaultImageUrl;

      }else{
        return images  ? images : this.defaultImageUrl;

      }
    // return images  ? images[0] : this.defaultImageUrl;
  }

  async openImgModal(item:any, index: number) {
    if(this.usereRole == 'Executive'){
      // response = await this.getItemProcessDetailed(item).toPromise();
      const response = await this.getImageUrl(item).toPromise();
      this.openSwiper()
      return
    }
    // else if(this.usereRole === 'Inward Manager'){
    //   response = this.UpdatedItemLists[index].images;

    // }
    // this.selectedItemImage = [];
    const modal = await this.modalController.create({
      component: ImgModalComponent,
      componentProps: {
        'image': this.UpdatedItemLists[index].images?this.UpdatedItemLists[index].images:this.selectedItemImage,
        'isEdit': this.usereRole === 'Inward Manager'? true : false,
      },
      cssClass: 'img-modal',
    });
    modal.onDidDismiss().then((dataReturned: any) => {
      console.log('Modal data:', dataReturned);
    this.selectedItemImage = [];

      if (dataReturned.data !== undefined) {
        this.UpdatedItemLists[index].images = dataReturned.data;
        console.log('dataReturned.data', dataReturned.data)
        console.log('this.UpdatedItemLists[index].images', this.UpdatedItemLists[index].images)
      }
      else {
        console.log('No data returned from modal');
      }
    });
    await modal.present();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.filter.PageNumber += 1;
    this.getItem();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  getItemProcessDetailed(item: any) {
    const parm = new HttpParams().set('id', item.currentProcess_Id);
    this.controller.showloader()
    return this.httpService.getItemProcessDetailed(item.currentProcess_Id)
    .pipe(
      tap((res: any) => {
        this.controller.hideloader();
        this.selectedItemImage = res.itemProcessImages;
        // openModalPop here if needed
      }),
      catchError((error) => {
        this.controller.hideloader();
        console.error(error);
        return of(null); // Return null if you want to handle it silently
      })
    );
  }

  getImageUrl(item: any) {
    console.log('getItemProcessDetailed', item);
    this.controller.showloader()
    return this.httpService.getItemGetImages(item.id)
      .pipe(
        tap((res: any) => {
          this.controller.hideloader();
          this.selectedItemImage = res;
          console.log('getItemProcessDetailed', this.selectedItemImage);
          // openModalPop here if needed
        }),
        catchError((error) => {
          this.controller.hideloader();
          console.error(error);
          return of(null); // Return null if you want to handle it silently
        })
      );
}
 async openSwiper() {
    const modal = await this.modalController.create({
      component: SwiperComponent,
      componentProps: {
        Images: this.selectedItemImage,
      },
    });
    await modal.present();
  }

}
