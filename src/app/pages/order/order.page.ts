import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { HttpParams } from '@capacitor/core';
import { InfiniteScrollCustomEvent, IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';
import { SearchModalComponent } from 'src/app/shares/components/search-modal/search-modal.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderPage implements OnInit {

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


  usereRole: any;
  projectData: any;
  isShortView = true
  segmentValue :any
  unAssignedList: any[] = []
  assignedList: any[] = []
  pageTitles: any = "Shot Blast Orders"
  RequisitionItemLists: any[] = []
  unAssignedRequisitionItemLists: any[] = []
  expandedItems: Set<number> = new Set<number>();
  unAssignedExpandedItems: Set<number> = new Set<number>();
  activeList: any[] = []
  activeListItems: any[] = []
  activeExpandedItems: Set<number> = new Set<number>();
  completedList: any[] = []
  completedListItems: any[] = []
  completedExpandedItems: Set<number> = new Set<number>();
  inQueueList: any[] = []
  inQueueListItems: any[] = []
  inQueueExpandedItems: Set<number> = new Set<number>();
  qaCompletedList: any[] = []
  qaCompletedListItems: any[] = []
  qaCompletedExpandedItems: Set<number> = new Set<number>();
  rejectedList: any[] = []
  rejectedListItems: any[] = []
  rejectedExpandedItems: Set<number> = new Set<number>();
  approvedList: any[] = []
  approvedListItems: any[] = []
  approvedExpandedItems: Set<number> = new Set<number>();
  teamsOrders: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private controller: ControllerService,
        private modalController: ModalController
    
  ) {
  }

  async ngOnInit() {
    this.usereRole = await this.getUserRoleFromLocalStorage();
    this.pageTitles = localStorage.getItem('team')

    // if (this.usereRole == 'Inward Manager') {
    //   this.segmentValue = 'UnAssigned'
    //   this.pageTitles = "Recently Created Requisitions"
    // }
    // else if (this.usereRole == 'Executive' || this.usereRole == 'Admin') {
    //   this.segmentValue = 'Active'
    // }
    // else {
    //   this.segmentValue = 'InQueueQA'
    //   this.pageTitles = "QA Testing"

    // }

    this.route.queryParams.subscribe(params => {

      if (params['team']) {
        this.teamsOrders = params['team']
        this.pageTitles = this.teamsOrders + " Orders"
        console.log('this.teamsOrders', this.teamsOrders);
        // this.segmentValue = 'Active';
      }
      const segmentValueParam = params['segmentValue'];
      if (segmentValueParam) {
        this.segmentValue = segmentValueParam
      }

        console.log(this.usereRole);
        if (this.usereRole == 'Inward Manager') {
          if(!this.segmentValue){
            this.segmentValue = 'UnAssigned'
          }
          this.pageTitles = "Recently Created Requisitions"
          this.getItem()
        }
        else if (this.usereRole == 'Executive' || this.usereRole == 'Admin') {
          if(!this.segmentValue){
            this.segmentValue = 'Active'
          }
          this.getRequisitionDetail()
        }
        else {
          if(!this.segmentValue){
            this.segmentValue = 'InQueueQA'
          }
          this.pageTitles = "QA Testing"
          this.getRequisitionDetail()
        }
        console.log('this.segmentValue', this.segmentValue);
    });

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
    this.filter.PageNumber = 1;
    this.finalPage = false; 
    if (this.usereRole == 'Executive' || this.usereRole == 'QA' || this.usereRole == 'Admin') {
      this.getRequisitionDetail()
    } else {
      this.getItem()
    }
  }

  activityListPage(id: any, slipNumber: any) {
    this.router.navigate(['/activity-list'], { queryParams: { id: id, slipNumber: slipNumber } });
  }
  requisitionListPage(id: any, slipNumber: any) {
    this.router.navigate(['/requisition'], { queryParams: { id: id, slipNumber: slipNumber } });
  }

  detailView(event: any, id?: any) {
    event.stopPropagation();
    if (id) {
      // this.getRequisitionItem(id)
    }
    this.isShortView = !this.isShortView
  }

  getRequisitionDetail() {
    console.log('getRequisitionDetail');
    // Determine the segment value for the QA role
    let segmentValue = (this.segmentValue === 'InQueueQA') ? 'InQueue' : this.segmentValue;
    let params = new HttpParams()
    if(this.usereRole === 'QA') {
      params = params.set('Status', segmentValue).set('Team', this.teamsOrders)
    }
    else{
      params = params.set('Status', segmentValue);
    }
    Object.keys(this.filter).forEach(key => {
      if (this.filter[key] !== null) {
        params = params.set(key, this.filter[key]);
      }
    });
    // Set the parameters

    // Make the HTTP request
    this.controller.showloader()
    this.httpService.getRequisition(params)
      .subscribe((res: any) => {
        if(res.length < 20) {
          this.finalPage = true; // Set finalPage to true if no items are returned
        }
        this.controller.hideloader()
        // Handle the response based on user role and segment value
        this.handleRequisitionResponse(res);
      }, (error) => {
        this.controller.hideloader()
      });
  }

  handleRequisitionResponse(res: any) {
    switch (this.usereRole) {
      case 'Executive':
      case 'Admin':
        this.handleExecutiveRequisition(res);
        break;
      default:
        this.handleOtherRolesRequisition(res);
        break;
    }
  }

  handleExecutiveRequisition(res: any) {
    switch (this.segmentValue) {
      case 'Active':
        if (this.filter.PageNumber === 1) {
          this.activeList = res;
        } else {
          this.activeList = [...this.activeList, ...res];
        }
        console.log('this.activeList', this.activeList);
        break;
      case 'InQueue':
        if (this.filter.PageNumber === 1) {
          this.inQueueList = res;
        } else {
          this.inQueueList = [...this.inQueueList, ...res];
        }
        break;
      default:
        if (this.filter.PageNumber === 1) {
          this.completedList = res;
        } else {
          this.completedList = [...this.completedList, ...res];
        }
        break;
    }
  }

  handleOtherRolesRequisition(res: any) {
    switch (this.segmentValue) {
      case 'InQueueQA':
        if (this.filter.PageNumber === 1) {
          this.qaCompletedList = res;
        } else {
          this.completedList = [...this.qaCompletedList, ...res];
        }
        this.qaCompletedList = res;
        break;
      case 'Rejected':
        if (this.filter.PageNumber === 1) {
          this.rejectedList = res;
        } else {
          this.rejectedList = [...this.rejectedList, ...res];
        }
        this.rejectedList = res;
        break;
      default:
        if (this.filter.PageNumber === 1) {
          this.approvedList = res;
        } else {
          this.approvedList = [...this.approvedList, ...res];
        }
        this.approvedList = res;
        break;
    }
  }


  getItem() {
    let params = new HttpParams()
      .set('Status', this.segmentValue);
  
    // Add additional filter parameters if they are not null
    Object.keys(this.filter).forEach(key => {
      if (this.filter[key] !== null) {
        params = params.set(key, this.filter[key]);
      }
    });
    
    this.controller.showloader()
    this.httpService.getAssignement(params)
      .subscribe(
        (res: any) => {
          if(res.length < 20) {
            this.finalPage = true; // Set finalPage to true if no items are returned
          }
          this.controller.hideloader()
          if (this.segmentValue == 'Assigned') {
            if (this.filter.PageNumber === 1) {
              this.assignedList = res;
            } else {
              this.assignedList = [...this.assignedList, ...res];
            }
          } else {
            if (this.filter.PageNumber === 1) {
              this.unAssignedList = res;
            } else {
              this.unAssignedList = [...this.unAssignedList, ...res];
            }
          }
          console.log(res);
        }, (error) => {
          this.controller.hideloader()
        });
  }

  getRequisitionColor(completedPercent: number): string {
    if (completedPercent < 35) {
      return 'low-completion'; // Yellow
    } else if (completedPercent < 60) {
      return 'medium-completion'; // Red
    } else if (completedPercent > 60) {
      return 'high-completion'; // Green
    } else {
      return ''; // Default case if you don't want any additional styling
    }
  }
  getRequisitionItem(index: number, id: any, team: string) {
    console.log(id);

    // Helper function to construct HttpParams
    const createHttpParams = (id: any, team?: string, status?: string) => {
      let params = new HttpParams().set('RequisitionId', id);
      if (team) params = params.set('Team', team);
      if (status) params = params.set('Status', status);
      return params;
    };

    // Determine the segment value based on user role
    let segmentValue: string = this.segmentValue;

    // For 'QA' role, modify segmentValue as per the segment value logic
    if (this.usereRole === 'QA' && this.segmentValue === 'InQueueQA') {
      segmentValue = 'InQueue';
    }

    // Create the HTTP parameters based on the user role and segment value
    let parm: HttpParams;

    switch (this.usereRole) {
      case 'Executive':
      case 'Admin':
        parm = createHttpParams(id, team, this.segmentValue);
        break;
      case 'QA':
        parm = createHttpParams(id, undefined, segmentValue);
        break;
      case 'Inward Manager':
        parm = createHttpParams(id, undefined, this.segmentValue);
        break;
      default:
        parm = createHttpParams(id, team);
        break;
    }
    parm = parm.set('PageSize', 20)

    // Object.keys(this.filter).forEach(key => {
    //   if (this.filter[key] !== null) {
    //     parm = parm.set(key, this.filter[key]);
    //   }
    // });

    // Make the HTTP request
    this.httpService.getItemDetail(parm)
      .subscribe((res: any) => {
        if(res.length < 20) {
          this.finalPage = true; // Set finalPage to true if no items are returned
        }
        // Handle the response based on user role and segment value
        switch (this.usereRole) {
          case 'Executive':
          case 'Admin':
            this.handleExecutiveResponse(res, index);
            break;
          case 'Inward Manager':
            this.handleInwardManagerResponse(res, index);
            break;
          case 'QA':
            this.handleQAResponse(res, index);
            break;
          default:
            console.log('Unknown role or request type');
        }
        console.log(res);
      });
  }

  handleExecutiveResponse(res: any, index: number) {
    if (this.segmentValue === 'Active') {
      this.activeListItems[index] = res;
    } else if (this.segmentValue === 'Completed') {
      this.completedListItems[index] = res;
    } else {
      this.inQueueListItems[index] = res;
    }
  }

  handleInwardManagerResponse(res: any, index: number) {
    if (this.segmentValue === 'Assigned') {
      this.RequisitionItemLists[index] = res;
    } else {
      this.unAssignedRequisitionItemLists[index] = res;
    }
  }

  handleQAResponse(res: any, index: number) {
    if (this.segmentValue === 'InQueueQA') {
      this.qaCompletedListItems[index] = res;
    } else if (this.segmentValue === 'Rejected') {
      this.rejectedListItems[index] = res;
    } else {
      this.approvedListItems[index] = res;
    }
  }


  toggleItemView(event: any, index: number, id?: any, team?: any) {
    event.stopPropagation();

    if (id) {
      this.getRequisitionItem(index, id, team);
    }

    const getExpandedSet = (role: string, segment: string) => {
      if (role === 'Executive' || role === 'Admin') {
        if (segment === 'Active') return this.activeExpandedItems;
        else if (segment === 'Completed') return this.completedExpandedItems;
        else return this.inQueueExpandedItems;
      } else if (role === 'Inward Manager') {
        if (segment === 'Assigned') return this.expandedItems;
        else return this.unAssignedExpandedItems;
      } else if (role === 'QA') {
        if (segment === 'InQueueQA') return this.qaCompletedExpandedItems;
        else if (segment === 'Rejected') return this.rejectedExpandedItems;
        else return this.approvedExpandedItems;
      }
      return null; // Default return value if no match
    }

    const expandedSet = getExpandedSet(this.usereRole, this.segmentValue);

    if (expandedSet) {
      // If the clicked item is already expanded, collapse it
      if (expandedSet.has(index)) {
        expandedSet.delete(index);
      } else {
        // If the clicked item is not expanded, collapse all others and expand the clicked item
        expandedSet.clear();  // This clears all expanded items in the current set
        expandedSet.add(index); // Add the clicked item to the expanded set
      }
    }
  }


  isItemExpanded(index: number): boolean {
    const roleSegmentMap: any = {
      'Executive': {
        'Active': this.activeExpandedItems,
        'Completed': this.completedExpandedItems,
        'InQueue': this.inQueueExpandedItems
      }, 'Admin': {
        'Active': this.activeExpandedItems,
        'Completed': this.completedExpandedItems,
        'InQueue': this.inQueueExpandedItems
      },
      'Inward Manager': {
        'Assigned': this.expandedItems,
        'UnAssigned': this.unAssignedExpandedItems
      },
      'QA': {
        'InQueueQA': this.qaCompletedExpandedItems,
        'Rejected': this.rejectedExpandedItems,
        'Approved': this.approvedExpandedItems
      }
    };

    const roleSegments = roleSegmentMap[this.usereRole];
    if (roleSegments) {
      const expandedSet = roleSegments[this.segmentValue];
      return expandedSet ? expandedSet.has(index) : false;
    }

    return false; // Default return value if no match
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
  logout() {
    if (this.usereRole == 'Admin') {
      this.router.navigate(['/dashboard']);
    }
    else if (this.usereRole == 'QA') {
      this.router.navigate(['/qa-dashboard']);
    }
    else {
      localStorage.clear();
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
      this.filter.PageNumber += 1;
      this.getItem();
      setTimeout(() => {
        event.target.complete();
      }, 500);
    }

    async openSearch(){
        const modal = await this.modalController.create({
          component: SearchModalComponent,
          cssClass: 'search-modal',
        });
        modal.onDidDismiss().then((dataReturned: any) => {
          console.log('search-modal:', dataReturned);
        })
        await modal.present();
      }


}
