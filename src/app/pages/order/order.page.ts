import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { HttpParams } from '@capacitor/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderPage implements OnInit {

  usereRole: any;
  projectData: any;
  isShortView = true
  segmentValue = 'Active'
  unAssignedList: any[] = []
  assignedList: any[] = []
  pageTitles:any = "Shot Blast Orders"
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
  teamsOrders: any[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private controller: ControllerService
  ) {
    // addIcons({exitOutline,arrowBack,funnel,chevronUp,chevronDown,exit});
  }

  async ngOnInit() {
    this.usereRole = await this.getUserRoleFromLocalStorage();
    this.pageTitles = localStorage.getItem('team')

    this.route.queryParams.subscribe(params => {
      console.log('params',params);
      const segmentValueParam = params['segmentValue'];
      
      if (segmentValueParam) {
          // Only try to parse if it's a valid stringified JSON
          this.segmentValue = JSON.parse(segmentValueParam);
      this.getItem()
      }
      if (params['team']) {
        this.teamsOrders = params['team']
        this.pageTitles = this.teamsOrders + " Orders"
        console.log('this.teamsOrders',this.teamsOrders);
        this.segmentValue = 'Active';
      }
    });
    console.log(this.usereRole);
    if (this.usereRole == 'Inward Manager') {
      this.segmentValue = 'UnAssigned'
      this.pageTitles = "Recently Created Requisitions"
      this.getItem()
    }
    else if (this.usereRole == 'Executive' || this.usereRole == 'Admin') {
      this.getRequisitionDetail()
      this.segmentValue = 'Active'
    }
    else {
      this.segmentValue = 'InQueueQA'
      this.pageTitles = "QA Testing"
      this.getRequisitionDetail()

    }

    // this.segmentValue = history.state.segmentValue;
    // 

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
    if (this.usereRole == 'Executive' || this.usereRole == 'QA' || this.usereRole == 'Admin') {
      this.getRequisitionDetail()
    } else {
      this.getItem()
    }
  }

  activityListPage(id: any) {
    this.router.navigate(['/activity-list'], { queryParams: { id: id } });
  }
  requisitionListPage(id: any) {
    this.router.navigate(['/requisition'], { queryParams: { id: id } });
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

    // Set the parameters
    const params = new HttpParams().set('Status', segmentValue);

    // Make the HTTP request
    this.controller.showloader()
    this.httpService.getRequisition(params)
      .subscribe((res: any) => {
        this.controller.hideloader()
        // Handle the response based on user role and segment value
        this.handleRequisitionResponse(res);
      },(error) => {
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
        this.activeList = res;
        console.log('this.activeList',this.activeList);
        break;
      case 'InQueue':
        this.inQueueList = res;
        break;
      default:
        this.completedList = res;
        break;
    }
}

handleOtherRolesRequisition(res: any) {
    switch (this.segmentValue) {
      case 'InQueueQA':
        this.qaCompletedList = res;
        break;
      case 'Rejected':
        this.rejectedList = res;
        break;
      default:
        this.approvedList = res;
        break;
    }
}


  getItem() {
    this.controller.showloader()
    this.httpService.getAssignement(this.segmentValue)
      .subscribe(
        (res: any) => {
          this.controller.hideloader()
          if (this.segmentValue == 'Assigned') {
            this.assignedList = res
          } else {
            this.unAssignedList = res
          }
          console.log(res);
        },(error) => {
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

    // Make the HTTP request
    this.httpService.getItemDetail(parm)
      .subscribe((res: any) => {
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
    const roleSegmentMap:any = {
      'Executive': {
        'Active': this.activeExpandedItems,
        'Completed': this.completedExpandedItems,
        'InQueue': this.inQueueExpandedItems
      },'Admin': {
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
  logout(){
    if(this.usereRole == 'Admin'){
      this.router.navigate(['/dashboard']);
    }else{
      localStorage.clear();
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }
  }


}
