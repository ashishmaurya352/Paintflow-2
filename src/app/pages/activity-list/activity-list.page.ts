import { HttpParams } from '@angular/common/http';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';
import { SwiperComponent } from 'src/app/shares/components/swiper/swiper.component';
import { ReceivedModalComponent } from "../../shares/components/received-modal/received-modal.component";
import { IonHeader } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { ImgModalComponent } from 'src/app/shares/components/img-modal/img-modal.component';
import { tap, catchError, of } from 'rxjs';
import { SearchModalComponent } from 'src/app/shares/components/search-modal/search-modal.component';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.page.html',
  styleUrls: ['./activity-list.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
})
export class ActivityListPage implements OnInit {
  defaultImageUrl = 'assets/img/mountain.png';
  reworkImageUrl = 'assets/img/letter-r.png';
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

  isShortView = true
  segmentValue = 'item-list'
  requisitionId: any
  usereRole: any

  isModalOpen = false;
  itemName = 'CHEQUERED PLATE MTG PLATE';
  maxQuantity = 60;
  receivedQuantity: number | null = null;
  ItemList: any = []
  handoverItemList: any = []
  completed: number = 0
  totalQuantity: number = 0
  selectedItem: any
  typeItem: any
  InQueueList: any = []
  RejectedList: any = []
  ApprovedList: any = []
  pageTitles = 'Challan No.'
  teams: any = []
  teamsData: any
  selectedTeam: any
  itemChecked: any;
  i: any;
  selectedOption: any;
  isSearchbarVisible = false;
  results: string[] = [];
  sortByName = ''
  priorityName = ''
  isAcceptModalOpen = false;

  selectedImage: any;
  selectedIndex: any
  isModalOpen2 = false;
  formData: FormData = new FormData();
  isRemarksModalOpen = false;
  decText: string = ''
  uploadImage: any
  acceptStatus = 'Accepted'
  acceptQuantity = 0
  acceptTemplate: any
  qaRemarks: any
  qaRemarksSelected: any
  slipNumber: any
  selectedItemImage: any = []
  constructor(private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private controller: ControllerService,
    private modalController: ModalController
  ) {
    // addIcons({arrowBack,search,filterOutline,checkmarkOutline,checkmarkDone,alarmOutline,caretForwardCircleOutline,sync,navigate,checkmarkDoneOutline,chatboxEllipsesOutline,closeCircleOutline,addOutline,checkmarkCircle,trashBin,caretDown,close,heart});
  }

  async ngOnInit() {
    this.usereRole = await this.getUserRoleFromLocalStorage();
    this.getTeams()
    if (this.usereRole == 'QA') {
      this.segmentValue = 'InQueue'
    }
    else if (this.usereRole == 'Admin') {
      this.addcss()
      this.segmentValue = 'Admin'
    }
    this.route.queryParams.subscribe(params => {
      this.requisitionId = params['id'];
      this.slipNumber = params['slipNumber'];
      this.getRequisitionItem(this.requisitionId)
    });
  }
  toUpperCase(value: string): string {
    return value ? value.toUpperCase() : '';
  }
  getUserRoleFromLocalStorage(): Promise<string | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localStorage.getItem('role'));
      }, 100);
    });
  }
  segmentChange(event: any) {
    this.segmentValue = event.detail.value
    this.isShortView = true
    this.teams = []
    this.filter.PageNumber = 1;
    this.finalPage = false;
    if (this.segmentValue == 'handover') {
      this.teams = this.teamsData
    }
    this.getRequisitionItem(this.requisitionId)
  }
  // openModal(item: any, type: any) {
  //   if(type =='Approval' && this.isHandoverDisabled(item)){
  //     return
  //   }
  //   if(type =='Update' && this.isUpdateDisabled(item)){
  //     return
  //   }
  //   this.isModalOpen = true;
  //   this.selectedItem = item
  //   this.typeItem = type
  //   if (this.typeItem == 'Update') {
  //     this.totalQuantity = this.selectedItem?.receivedQuantity - this.selectedItem?.completedQuantity
  //   }
  //   else if (this.typeItem == 'AcceptOrder') {
  //     this.totalQuantity = item.receivedQuantity
  //   } else if (this.typeItem == 'SendForHandover') {
  //     this.totalQuantity = item.qcApprovedQuantity
  //   }
  //   else {
  //     this.totalQuantity = item.completedQuantity
  //   }
  // }

  // (quantitySubmitted)="handleQuantitySubmitted($event)"
  async openModal(item: any, type: any) {
    this.typeItem = type
    this.selectedItem = item

    if (type == 'Approval' && this.isHandoverDisabled(item)) {
      return
    }
    if (type == 'Update' && this.isUpdateDisabled(item)) {
      return
    }
    let cssClass = 'quantity-modal';
    if (this.segmentValue == 'handover') {
      cssClass = 'quantity-team-modal';

    } else {
      cssClass = 'quantity-modal';
    }
    if (this.typeItem == 'Update') {
      this.totalQuantity = this.selectedItem?.receivedQuantity - this.selectedItem?.completedQuantity
    }else if( this.typeItem == 'Approval') {
      this.totalQuantity = Math.abs(this.selectedItem?.receivedQuantity - (this.selectedItem?.qcApprovalPendingQuantity + this.selectedItem?.qcApprovedQuantity));
    }
    else if (this.typeItem == 'AcceptOrder') {
      this.totalQuantity = item.receivedQuantity
    } else if (this.typeItem == 'SendForHandover') {
      this.totalQuantity = item.qcApprovedQuantity
    }
    else {
      this.totalQuantity = item.completedQuantity
    }

    this.selectedItem = item
    const modal = await this.modalController.create({
      component: ReceivedModalComponent,
      componentProps: {
        totalQuantity: this.totalQuantity,
        getquantity: this.selectedItem?.receivedQuantity - this.selectedItem?.completedQuantity,
        itemName: this.selectedItem?.partDesciption,
        teams: this.teams,
        height: true
      },
      cssClass: cssClass,
    });
    modal.onDidDismiss().then((dataReturned: any) => {
      console.log('Modal data:', dataReturned);

      if (dataReturned.data !== undefined) {
        if (this.segmentValue == 'handover') {
          this.completed = dataReturned.data.quantity
          this.selectedTeam = dataReturned.data.team
        }
        else {
          this.completed = dataReturned.data
        }
        if (this.typeItem == 'Update') {
          this.updateItemStatus(this.selectedItem, 'CompleteStatus');
        }
        else if (this.typeItem == 'AcceptOrder') {
          this.approve()
        } else if (this.typeItem == 'SendForHandover') {
          this.updateItemStatus(this.selectedItem, 'SendForHandover')
        }
        else {
          this.updateItemStatus(this.selectedItem, 'SendForApproval');
        }
      }
      else {
        console.log('No data returned from modal');
        // this.itemChecked[i] = false;
      }
    });
    await modal.present();
    // this.modalFab.dismiss()
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submit() {
    if (this.receivedQuantity !== null && this.receivedQuantity <= this.maxQuantity) {
      console.log('Received Quantity:', this.receivedQuantity);
      this.closeModal();
    } else {
      alert('Please enter a valid quantity.');
    }
  }

  backToOrderPage() {
    this.router.navigate(['/order']);
  }

  handleQuantitySubmitted(quantity: any) {
    if (this.segmentValue == 'handover') {
      this.completed = quantity.quantity
      this.selectedTeam = quantity.team
    }
    else {
      this.completed = quantity
    }
    if (this.typeItem == 'Update') {
      this.updateItemStatus(this.selectedItem, 'CompleteStatus');
    }
    else if (this.typeItem == 'AcceptOrder') {
      this.approve()
    } else if (this.typeItem == 'SendForHandover') {
      this.updateItemStatus(this.selectedItem, 'SendForHandover')
    }
    else {
      this.updateItemStatus(this.selectedItem, 'SendForApproval');
    }

  }

  getRequisitionItem(id: any) {
    const parm = this.buildParams(id);

    this.controller.showloader();

    this.httpService.getItemDetail(parm)
      .subscribe(
        (res: any) => {
          if (res.length < 20) {
            this.finalPage = true; // Set finalPage to true if no items are returned
          }
          this.controller.hideloader()
          console.log(res);
          this.processRequisitionItem(res);

        }, (error) => {
          this.controller.hideloader()
        });
  }

  buildParams(id: any): HttpParams {
    let parm = new HttpParams().set('RequisitionId', id);

    if (this.usereRole === 'QA') {
      parm = parm.set('Status', this.segmentValue);
    } else if (this.usereRole === 'Admin') {
      // parm = parm.set('Status', 'Handover');
    } else if (this.segmentValue === 'handover') {
      parm = parm.set('Status', 'Handover');
    } else if (this.segmentValue === 'rejected') {
      parm = parm.set('Status', 'Rejected');
    }
    else if (this.segmentValue === 'item-list') {
      parm = parm.set('Status', 'Active');
    }

    Object.keys(this.filter).forEach(key => {
      if (this.filter[key] !== null) {
        parm = parm.set(key, this.filter[key]);
      }
    });


    return parm;
  }

  processRequisitionItem(res: any) {
    if (this.usereRole === 'QA') {
      this.handleQARequisitionItem(res);
    } else {
      this.handleOtherRequisitionItem(res);
    }
  }

  handleQARequisitionItem(res: any) {
    switch (this.segmentValue) {
      case 'InQueue':
        this.InQueueList = res;
        break;
      case 'Rejected':
        this.RejectedList = res;
        break;
      default:
        this.ApprovedList = res;
    }
  }

  handleOtherRequisitionItem(res: any) {
    if (this.segmentValue === 'handover') {
      this.handoverItemList = res;
    } else {
      this.ItemList = res;
    }
  }

  startTask(item: any) {
    console.log(item);
    const parm = new HttpParams().set('id', item.currentProcess_Id);
    this.controller.showloader()
    this.httpService.startTask(parm)
      .subscribe(
        (res: any) => {
          this.controller.hideloader()
          console.log(res);
          this.getRequisitionItem(this.requisitionId)
        }, (error) => {
          this.controller.hideloader()
        });
  }

  updateItemStatus(item: any, type: any) {
    if (this.completed <= 0) {
      console.log('completed', this.completed);
      return
    }
    console.log('completed', this.completed);

    let parm
    if (type == 'CompleteStatus') {
      parm = new HttpParams().set('id', item.currentProcess_Id).set('quantity', this.completed).set('type', 'CompleteStatus');

    } else if (type == 'SendForApproval') {
      parm = new HttpParams().set('id', item.currentProcess_Id).set('quantity', this.completed).set('type', 'SendForApproval').set('team', this.selectedTeam);
    }
    else {
      parm = new HttpParams().set('id', item.currentProcess_Id).set('quantity', this.completed).set('type', 'SendForHandover').set('team', this.selectedTeam);
    }
    this.httpService.updateItemStatus(parm)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.getRequisitionItem(this.requisitionId)
        });
  }

  isUpdateDisabled(item: any): boolean {
    return (
      (item?.curretProcess?.statusId == null) || (item?.receivedQuantity <= item?.completedQuantity)
    );
  }

  isHandoverDisabled(item: any): boolean {
    return (item?.curretProcess?.statusId !== null && item.qcApprovedQuantity + item.qcApprovalPendingQuantity >= item.completedQuantity || item?.curretProcess?.statusId == null)
    // return (item?.curretProcess?.statusId !== null  && 0 + 0 <= item.completedQuantity )
  }

  async approve() {
    this.controller.showloader()

    if (this.images.length > 0) {
      await this.uploadAllImages()
    }
    const data = {
      id: this.selectedItem?.currentProcess_Id,
      quantity: this.acceptQuantity,
      status: this.acceptStatus,
      templateName: this.acceptTemplate,
      remark: this.decText,
      images: this.uploadImage
    }
    console.log('approve', data);
    // const parm = new HttpParams().set('id', this.selectedItem?.currentProcess_Id).set('quantity', this.acceptQuantity)
    // .set('status', this.acceptStatus).set('templateName', this.acceptTemplate).set('remark', this.decText);

    this.controller.showloader()
    this.httpService.approve(data).subscribe((res: any) => {
      console.log('approve', res)
      this.controller.hideloader()
      this.isAcceptModalOpen = false
      this.getRequisitionItem(this.requisitionId)
    }, (error) => {
      this.controller.hideloader()
      this.isAcceptModalOpen = false

    });
  }
  getTeams() {
    this.httpService.getTeams().subscribe((res: any) => {
      this.teamsData = res
      console.log(res)
    })
  }
  addcss() {
    const observer = new MutationObserver(() => {
      document.querySelectorAll("ion-select").forEach((ionSelect) => {
        if (ionSelect.shadowRoot && !ionSelect.shadowRoot.querySelector("style.custom-style")) {
          console.log("✅ Styling dynamically added ion-select");
          const style = document.createElement("style");
          style.classList.add("custom-style"); // Prevent duplicate styles
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
          ionSelect.shadowRoot.appendChild(style);
        }
      });
    });

    // Observe the entire document for new elements
    observer.observe(document.body, { childList: true, subtree: true });
  }
  toggleSearch() {
    this.isSearchbarVisible = !this.isSearchbarVisible;
  }
  handleInput(event: any) {
    const query = event.target.value.toLowerCase();

    // Simulate a search operation
    this.results = query ? ['Apple', 'Banana', 'Orange'].filter(item => item.toLowerCase().includes(query)) : [];
  }
  sortBy(name: string) {
    console.log('sortByName', name);
    this.sortByName = name
  }
  priority(name: string) {
    console.log('sortByName', name);
    this.priorityName = name
  }
  closeModalPop() {
    this.modalController.dismiss();  // This will close the modal
  }
  acceptOrder(item: any) {
    console.log('acceptOrder', item);
    this.selectedItem = item
    this.acceptQuantity = this.selectedItem.curretProcess.quantity
    this.isAcceptModalOpen = true;
  }

  images: any = [
    // { file: new File([], 'image1.jpg'), compressedUrl: 'https://ionicframework.com/docs/img/demos/thumbnail.svg' },
    // { file: new File([], 'image2.jpg'), compressedUrl: 'https://ionicframework.com/docs/img/demos/thumbnail.svg' },
    // { file: new File([], 'image3.jpg'), compressedUrl: 'https://ionicframework.com/docs/img/demos/thumbnail.svg' },
  ];
  // removeImage(index: number) {
  //   this.images.splice(index, 1); // Removes the image at the given index
  // }
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = () => {
          this.images.push({
            file: file, // Store the original File object
            compressedUrl: reader.result as string, // Data URL (can be replaced with actual compression logic)
          });
        };

        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }
  openSlider(index: number) {
    console.log('openSlider', index);
    this.selectedIndex = index;
    this.isModalOpen2 = true;
  }

  closeSlider() {
    this.isModalOpen2 = false;
  }
  async openSwiper(data: any) {
    const modal = await this.modalController.create({
      component: SwiperComponent,
      componentProps: {
        Images: data,
      },
    });
    await modal.present();
  }


  //image up;oade
  addImageToFormData(image: File, compressedImageUrl: string): Promise<void> {
    return fetch(compressedImageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        this.formData.append('files', blob, image.name || 'image.jpg'); // Use default name if missing
      })
      .catch((error) => {
        console.error('Error converting URL to blob:', error);
      });
  }


  async uploadAllImages(): Promise<void> {
    this.formData = new FormData();
    if (this.images.length > 0) {

      try {
        // Ensure all images are added to the FormData
        const uploadPromises = this.images.map((img: { file: File; compressedUrl: string; }) => this.addImageToFormData(img.file, img.compressedUrl));
        await Promise.all(uploadPromises);
        if (!this.formData || !this.formData.has('files')) {
          console.error('No files to upload');
          return;
        }

        // Use an Observable with a Promise-based approach to await completion
        const uploadResponse = await this.uploadImagesAsync();

        // Handle the response once all images are uploaded
        if (uploadResponse) {
          console.log('Images uploaded successfully:', uploadResponse);
          this.uploadImage = uploadResponse.filePaths;
          this.isAcceptModalOpen = false;
        } else {
          console.error('Upload failed, no response');
          this.isAcceptModalOpen = false;
        }

      } catch (error) {
        // Handle errors during image processing or HTTP upload
        console.error('Error uploading images:', error);
        this.isAcceptModalOpen = false;
      }
    }
  }

  // Utility function to wrap the Observable in a Promise
  private uploadImagesAsync(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.documentsUpload(this.formData).subscribe(
        (response) => resolve(response), // Success case
        (error) => reject(error)         // Error case
      );
    });
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async openRemarksModal(item: any,type='') {
    if(type == 'QARemarks'){
      this.getItemProcessDetailed(item)
      
    }else{

      const response = await this.getImageUrl(item).toPromise();
    }
    console.log('openRemarksModal', item);
    this.isRemarksModalOpen = true;
  }
  onSelectReason(event: any) {
    const reason = event.target.value;
    this.acceptTemplate = reason
    console.log('Selected reason:', reason);
    switch (reason) {
      case 'Approval template 1':
        this.decText = 'Approved as its done properly';
        break;
      case 'Rejected template 1':
        this.decText = 'Rejected as its not done';
        break;
      case 'Rejected template 2':
        this.decText = 'Rejected as partially work done';
        break;
      case 'Rejected template 3':
        this.decText = 'There are issues with item';
        break;
      default:
        this.decText = '';  // Default case if needed
    }
  }
  onInput(event: any) {
    this.acceptQuantity = event.target.value;
    console.log('acceptQuantity', this.acceptQuantity);
    console.log('this.selectedItem?.receivedQuantity', this.selectedItem?.receivedQuantity);
    if (this.acceptQuantity > this.selectedItem?.receivedQuantity) {
      this.acceptQuantity = this.selectedItem?.receivedQuantity
      console.log('acceptQuantity', this.acceptQuantity);
    }
    console.log('decText', this.decText);
  }
  acceptStatusChange(event: any) {
    this.acceptStatus = event.target.value;
    console.log('acceptStatus', this.acceptStatus);
  }

  getItemProcessDetailed(item: any,type='QARemarks') {
    // const parm = new HttpParams().set('id', item.currentProcess_Id);
    this.qaRemarksSelected = item
    console.log('getItemProcessDetailed', item);
    const parm = new HttpParams().set('id', item.currentProcess_Id);
    this.controller.showloader()
    this.httpService.getItemProcessDetailed(item.currentProcess_Id)
      .subscribe(
        (res: any) => {
          this.controller.hideloader()
          console.log(res);
          this.qaRemarks = res
          // this.openModalPop(res)
        }, (error) => {
          this.controller.hideloader()
        });
        
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

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.filter.PageNumber += 1;
    this.getRequisitionItem(this.requisitionId)
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async openImgModal(item: any, index: number) {
    const response = await this.getImageUrl(item).toPromise();
    const modal = await this.modalController.create({
      component: SwiperComponent,
      componentProps: {
        Images: this.selectedItemImage,
      },
      cssClass: 'img-modal',
    });
    await modal.present();
  }

  getImageSrc(item: any): string {
    const images = item.imageUrl;
    return images ? images : this.defaultImageUrl;
  }
  restartTask(item: any) {
    const parm = new HttpParams().set('id', item.currentProcess_Id);
    this.controller.showloader()
    this.httpService.restartWork(parm)
      .subscribe(
        (res: any) => {
          this.controller.hideloader()
          console.log(res);
          this.getRequisitionItem(this.requisitionId)
        }, (error) => {
          this.controller.hideloader()
        });
  }
  async openSearch(){
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        id: this.requisitionId,
        status: this.segmentValue,
        // Images: data,
      },
      cssClass: 'search-modal',
    });
    await modal.present();
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
}
