import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { IonToolbar, IonHeader, IonTitle, IonContent } from "@ionic/angular/standalone";
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';
import { ImgModalComponent } from 'src/app/shares/components/img-modal/img-modal.component';
import { ReceivedModalComponent } from 'src/app/shares/components/received-modal/received-modal.component';
import { SwiperComponent } from 'src/app/shares/components/swiper/swiper.component';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.page.html',
  styleUrls: ['./requisition.page.scss'],
  imports: [CommonModule, IonicModule,FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RequisitionPage implements OnInit {

  // defaultImageUrl = 'src/assets/img/mountain.png';
  defaultImageUrl: string = 'https://ionicframework.com/docs/img/demos/thumbnail.svg';


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
      this.requisitionId = params['id'];
      this.slipNumber = params['slipNumber'];
    });

    this.usereRole = localStorage.getItem('role');

    if (this.usereRole === 'Inward Manager') {
      // this.pageTitles = "Recently Created Requisitions"
    }

    this.getItem();
    this.addcss();

  }

  backToOrderPage() {
    const segmentValue = 'accept';
    this.router.navigate(['/order'], { state: { segmentValue } });
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
    const modal = await this.modalController.create({
      component: ReceivedModalComponent,
      componentProps: {
        'totalQuantity': item.quantity,
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
    console.log('dataReturned.data',dataReturned.data)
    console.log('this.itemChecked[i]',this.itemChecked[i])
        // this.filter.PageNumber = 1;
        // this.getProjectProfileV1(this.allProjects[0].Id);
      }
      else{
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
    const params = new HttpParams()
      .set('RequisitionId', this.requisitionId)
      .set('Status', 'InQueue');
    this.controller.showloader()
    this.httpService.getItem(params).subscribe((res: any) => {
      this.controller.hideloader()
      this.RequisitionItemLists = res;
      this.itemChecked = res.map(() => false);

      if (this.usereRole === 'Executive') {
        this.UpdatedItemLists = res.map((item: any) => ({
          itemProcessId: item.currentProcess_Id,
          quantity: 0,
        }));
      } else if (this.usereRole === 'Inward Manager') {
        this.UpdatedItemLists = res.map((item: any) => ({
          itemId: item.id,
          quantity: 0,
          priority: 'Low'
        }));
      }

    }, (error) => {
      this.controller.hideloader()
    });
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

  // addcss() {
  //   const observer = new MutationObserver(() => {
  //     document.querySelectorAll("ion-select").forEach((ionSelect) => {
  //       // Ensure ion-select has shadowRoot and check for existing styles
  //       if (ionSelect.shadowRoot && !ionSelect.shadowRoot.querySelector("style.custom-style")) {
  //         try {
  //           console.log("✅ Styling dynamically added ion-select");

  //           // Create style element and add the styles
  //           const style = document.createElement("style");
  //           style.classList.add("custom-style");
  //           style.textContent = `
  //             .select-outline-container {
  //               height: 32px !important;
  //               left: 20px !important;
  //               width: 80% !important;
  //             }
  //             .select-wrapper-inner {
  //               display: block !important;
  //             }
  //           `;

  //           // Append to shadow DOM
  //           ionSelect.shadowRoot.appendChild(style);
  //         } catch (error) {
  //           console.error("Error while adding custom styles to ion-select:", error);
  //         }
  //       }
  //     });
  //   });

  //   // Observe the entire document for added nodes
  //   observer.observe(document.body, { childList: true, subtree: true });
  // };

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
  disabledAcceptItems(){
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

  getImageSrc(index: number): string {
    // Ensure that images exists and has at least one element
    const images = this.UpdatedItemLists[index]?.images;
    return images && images.length > 0 ? images[0] : this.defaultImageUrl;
  }

  async openImgModal(index: number) {
    // this.index = i;
    const modal = await this.modalController.create({
      component: ImgModalComponent,
      componentProps: {
        'image': this.UpdatedItemLists[index].images,
        'isEdit': true,
      },
      cssClass: 'img-modal',
    });
    modal.onDidDismiss().then((dataReturned: any) => {
      console.log('Modal data:', dataReturned);
      
      if (dataReturned.data !== undefined) {
        this.UpdatedItemLists[index].images = dataReturned.data;
        console.log('dataReturned.data',dataReturned.data)
        console.log('this.UpdatedItemLists[index].images',this.UpdatedItemLists[index].images)
      }
      else{
        console.log('No data returned from modal');
      }
    });
    await modal.present();
  }


}
