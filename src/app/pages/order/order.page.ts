import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { HttpParams } from '@capacitor/core';
import { InfiniteScrollCustomEvent, IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';
import { ChartComponent } from 'src/app/shares/components/chart/chart.component';
import { FilterModalComponent } from 'src/app/shares/components/filter-modal/filter-modal.component';
import { SearchModalComponent } from 'src/app/shares/components/search-modal/search-modal.component';
import { Capacitor } from '@capacitor/core';
import { ReceivedModalComponent } from 'src/app/shares/components/received-modal/received-modal.component';
import { forkJoin, Observable } from 'rxjs';


@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  imports: [CommonModule, IonicModule, ChartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderPage implements OnInit {

  filter: any = {
    PageNumber: 1,
    PageSize: 20,
    StartDate: null,
    EndDate: null,
    Keyword: null,
    Status: null,
  }
  finalPage: boolean = false; // Flag to indicate if it's the last page


  usereRole: any;
  projectData: any;
  isShortView = true
  segmentValue: any
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
  teams: any[] = [];
  PaintDescription: any[] = [];
  routerCount: number = 0;

  activeCount: any
  completedCount: any
  inQueueCount: any
  UnAssignedCount: any
  AssignedCount: any
  rejectedCount: any
  approvedCount: any
  ionSelectObserver: MutationObserver | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private controller: ControllerService,
    private modalController: ModalController
  ) {
  }

  async ngOnInit() {
    this.usereRole = ''
    this.usereRole = await this.getUserRoleFromLocalStorage()
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
      this.addcss()
      if (this.routerCount == 0) {
        this.routerCount++;
        if (params['team']) {
          this.teamsOrders = params['team']
          this.pageTitles = this.teamsOrders + " Orders"
          // this.segmentValue = 'Active';
        }
        const segmentValueParam = params['segmentValue'];
        if (segmentValueParam) {
          this.segmentValue = segmentValueParam
        }

        console.log(this.usereRole);
        if (this.usereRole == 'Inward Manager') {
          if (!this.segmentValue) {
            this.segmentValue = 'UnAssigned'
          }
          this.pageTitles = "Recently Created Requisitions"
          this.getItem()
          this.getTeams()
          this.getPaintDescriptionGet()
        }
        else if (this.usereRole == 'Executive' || this.usereRole == 'Admin') {
          if (!this.segmentValue) {
            this.segmentValue = 'Active'
          }
          this.getRequisitionDetail()
        }
        else {
          if (!this.segmentValue) {
            this.segmentValue = 'InQueueQA'
          }
          this.pageTitles = "QA Testing"
          this.getRequisitionDetail()
        }
        setTimeout(() => {
          this.routerCount = 0; // Reset the counter after processing
        }, 1000);
        console.log('this.segmentValue', this.segmentValue);
      }
    });



  }

  getUserRoleFromLocalStorage(): Promise<string | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localStorage.getItem('role'));
        console.log("User role retrieved from localStorage:", localStorage.getItem('role'));
      }, 100);
    });
  }
  segmentChange(event: any) {
    this.segmentValue = event.detail.value
    this.filter.PageNumber = 1;
    this.finalPage = false;
    this.resetFilter()
    if (this.usereRole == 'Executive' || this.usereRole == 'QA' || this.usereRole == 'Admin') {
      this.getRequisitionDetail()
    } else {
      this.getItem()
    }
  }

  activityListPage(id: any, slipNumber: any) {
    if (this.usereRole == 'Admin' || this.usereRole == 'QA') {
      if (this.usereRole == 'QA') {
        if (this.ionSelectObserver) {
          this.ionSelectObserver.disconnect();
          this.ionSelectObserver = null;
          console.log("🛑 MutationObserver disconnected");
        }
      }
      this.router.navigate(['/activity-list'], { queryParams: { id: id, slipNumber: slipNumber, team: this.teamsOrders } });
    }
    else {
      this.router.navigate(['/activity-list'], { queryParams: { id: id, slipNumber: slipNumber } });
    }
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
    this.getRequisitionGetCountParallel();
    console.log('getRequisitionDetail');
    // Determine the segment value for the QA role
    let segmentValue = (this.segmentValue === 'InQueueQA') ? 'InQueue' : this.segmentValue;
    let params = new HttpParams()
    if (this.usereRole === 'QA' || this.usereRole === 'Admin') {
      const team = this.teamsOrders == 'All' ? '' : this.teamsOrders
      params = params.set('Status', segmentValue).set('Team', team)
    }
    else {
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
    this.collapseAllItems();
    this.httpService.getRequisition(params)
      .subscribe((res: any) => {
        if (res.length < 20) {
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
    this.getAssignmentCountParallel();
    let params = new HttpParams()
      .set('Status', this.segmentValue);

    // Add additional filter parameters if they are not null
    Object.keys(this.filter).forEach(key => {
      if (this.filter[key] !== null) {
        params = params.set(key, this.filter[key]);
      }
    });

    this.controller.showloader()
    this.collapseAllItems();
    this.httpService.getAssignement(params)
      .subscribe(
        (res: any) => {
          if (res.length < 20) {
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
    this.collapseAllItems();
    this.httpService.getItemDetail(parm)
      .subscribe((res: any) => {
        if (res.length < 20) {
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
      // localStorage.clear();
      // this.router.navigate(['/login']).then(() => {
      //   if (Capacitor.getPlatform() === 'android') {
      //         window.location.reload();
      //       }
      // });
      // Clear Capacitor Storage

      // Clear localStorage if you're using it
      localStorage.clear();
      this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
        // Only reload if necessary
        // if (Capacitor.getPlatform() === 'android') {
        setTimeout(() => window.location.reload(), 100); // small delay improves stability
        // }
      });
    }
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    console.log('onIonInfinite')
    this.filter.PageNumber += 1;
    if (this.usereRole == 'Executive' || this.usereRole == 'QA' || this.usereRole == 'Admin') {
      this.getRequisitionDetail()
    } else {
      this.getItem()
    }
    setTimeout(() => {
      event.target.complete();
      console.log('Infinite scroll completed');
    }, 500);
  }

  async openSearch() {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        team: this.teamsOrders,
      },
      cssClass: 'search-modal',
    });
    modal.onDidDismiss().then((dataReturned: any) => {
      if (dataReturned.data) {
        const id = dataReturned.data.id
        const slipNumber = dataReturned.data.slipNumber
        if (this.usereRole == 'Inward Manager') {
          this.requisitionListPage(id, slipNumber)
        } else {

          this.activityListPage(id, slipNumber)
        }
        // this.filter.Keyword = dataReturned.data.keyword
      }
      console.log('search-modal:', dataReturned);
    })
    await modal.present();
  }

  onStatusChange(event: any, id: any) {
    const Status = event.target.value;
    event.stopPropagation();
    event.preventDefault()
    let params = new HttpParams().set('id', id).set('status', Status);
    this.collapseAllItems();
    this.httpService.requisitionUpdatePriorityStatus(params).subscribe((res: any) => {
      console.log('Status updated successfully:', res);
      // this.ItemList[i].priority = Status
    })
    // console.log('Selected option:', this.selectedOption);
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
  async openFilter() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: {
        page: 'challan',
        usereRole: this.usereRole,
        filter: this.filter,
        tab: this.segmentValue
        // id: this.requisitionId,
      },
      cssClass: 'filter_model',
      mode: 'ios'
    });

    modal.onDidDismiss().then((dataReturned: any) => {
      if (dataReturned.data) {
        this.filter.StartDate = dataReturned.data.StartDate,
          this.filter.EndDate = dataReturned.data.EndDate,
          this.filter.SortBy = dataReturned.data.SortBy,
          this.filter.Priority = dataReturned.data.Priority,
          this.filter.IsDecsending = dataReturned.data.IsDecsending
        console.log('this.filter:', this.filter);

        this.filter.PageNumber = 1;
        this.finalPage = false;
        if (this.usereRole == 'Executive' || this.usereRole == 'QA' || this.usereRole == 'Admin') {
          this.getRequisitionDetail()
        } else {
          this.getItem()
        }

      }
      console.log('search-modal:', dataReturned);
    })
    await modal.present();
  }

  resetFilter() {
    this.filter = {
      PageNumber: 1,
      PageSize: 20,
      StartDate: null,
      EndDate: null,
      Keyword: null,
      Status: null,
    }
  }
  rejectOrder(id: any, slipNumber: any) {
    this.router.navigate(['/requisition'], { queryParams: { id: id, slipNumber: slipNumber, isReject: true } });
  }

  addISTOffset(dateStr: string): Date {
    const originalDate = new Date(dateStr);
    const istOffsetMs = 5.5 * 60 * 60 * 1000; // 5 hours 30 mins in ms
    return new Date(originalDate.getTime() + istOffsetMs);
  }

  async showReceivedModal(id: any) {
    const modal = await this.modalController.create({
      component: ReceivedModalComponent,
      componentProps: {
        // 'totalQuantity': totalQuantity,
        // 'getquantity': this.UpdatedItemLists[i].quantity || 0,
        // 'itemName': partDescription,
        'teams2': this.teams,
        'PaintDescription': this.PaintDescription,
        'isSingle': false,
        isInwardManager: this.usereRole === 'Inward Manager' ? true : false,
        isChallan: true,
      },
      cssClass: 'quantity-modal',
    });
    modal.onDidDismiss().then((dataReturned: any) => {
      console.log('Modal data:', dataReturned);
      if (dataReturned.data !== undefined) {
        this.controller.showloader()
        const data = {
          "requisitionId": id,
          "priority": dataReturned.data.selectedChallanPriority,
          "items": [
            {
              "itemId": 0,
              "priority": dataReturned.data.selectedPriority,
              "quantity": 0,
              "color": dataReturned.data.color,
              "itemPaintDescriptions": dataReturned.data.itemPaintDescriptions,
              "images": []
            }
          ]
        }
        this.collapseAllItems();
        this.httpService.assignItemProcess(data)
          .subscribe((res: any) => {
            if (res.success) {
              this.controller.hideloader()
              this.ngOnInit()
            }
            else {
              this.controller.hideloader()
              this.controller.showToast(res.message);

            }
          }, (error) => {
            this.controller.hideloader()
          });
      }

    });
    await modal.present();
  }

  getTeams() {
    // this.controller.showloader()
    this.collapseAllItems();
    this.httpService.getTeams()
      .subscribe(
        (res: any) => {
          // this.controller.hideloader()
          this.teams = res;
          console.log(res);
        }, (error) => {
          // this.controller.hideloader()
        });
  }

  getPaintDescriptionGet() {
    this.collapseAllItems();
    this.httpService.getPaintDescriptionGet().subscribe((res: any) => {
      // console.log('getPaintDescriptionGet', res);
      const paintList = res;

      const groupedByTeam = paintList?.reduce((groups: any, item: any) => {
        if (!groups[item.team]) {
          groups[item.team] = [];
        }
        groups[item.team].push(item);
        return groups;
      }, {} as { [key: string]: any[] });

      // Example: How to access
      this.PaintDescription = groupedByTeam;
      // console.log('Grouped Paint Description:', this.PaintDescription);

    })
  }
  collapseAllItems(): void {
    const roleSegmentMap: any = {
      'Executive': {
        'Active': this.activeExpandedItems,
        'Completed': this.completedExpandedItems,
        'InQueue': this.inQueueExpandedItems
      },
      'Admin': {
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
      (Object.values(roleSegments) as Set<number>[]).forEach((set) => set.clear());
    }
  }

  // getRequisitionGetCount() {
  //   let params = new HttpParams();
  //   params.set('Status', 'Active');
  //   params.set('Status', 'Completed');
  //   params.set('Status', 'InQueue');

  //   this.httpService.getRequisitionGetCount(params)
  //     .subscribe((res: any) => {
  //       console.log('Requisition Get Count:', res);
  //     });
  // }

  getRequisitionGetCountParallel() {
    const inQueue$ = this.getCountByStatus(this.teamsOrders === 'QA Team' ? 'Approved' : 'InQueue');

    let requests = [inQueue$];
    let roles = ['inQueue'];

    if (this.usereRole == 'QA') {
      const rejected$ = this.getCountByStatus('Rejected');
      const approved$ = this.getCountByStatus('Approved');

      requests.push(rejected$, approved$);
      roles.push('rejected', 'approved');
    } else {
      const active$ = this.getCountByStatus(this.teamsOrders === 'QA Team' ? 'InQueue' : 'Active');
      const completed$ = this.getCountByStatus(this.teamsOrders === 'QA Team' ? 'Rejected' : 'Completed');

      requests.push(active$, completed$);
      roles.push('active', 'completed');
    }

    forkJoin(requests).subscribe((results) => {
      results.forEach((res, index) => {
        const role = roles[index];
        switch (role) {
          case 'active':
            this.activeCount = res;
            console.log('Active Count:', res);
            break;
          case 'completed':
            this.completedCount = res;
            console.log('Completed Count:', res);
            break;
          case 'inQueue':
            this.inQueueCount = res;
            console.log('InQueue Count:', res);
            break;
          case 'rejected':
            this.rejectedCount = res;
            console.log('Rejected Count:', res);
            break;
          case 'approved':
            this.approvedCount = res;
            console.log('Approved Count:', res);
            break;
        }
      });
    });
  }


  getCountByStatus(status: string): Observable<any> {
    let params = new HttpParams()
    if (this.teamsOrders) {
      params = params.set('Team', this.teamsOrders);
    }
    params = params.set('Status', status);
    this.collapseAllItems();
    return this.httpService.getRequisitionGetCount(params);
  }

  getAssignmentCountParallel() {
    const UnAssigned$ = this.getAssignmenCountByStatus('UnAssigned');
    const Assigned$ = this.getAssignmenCountByStatus('Assigned');

    forkJoin([UnAssigned$, Assigned$]).subscribe(([UnAssignedRes, AssignedRes]) => {
      this.UnAssignedCount = UnAssignedRes;
      this.AssignedCount = AssignedRes;
      console.log('UnAssigned Count:', UnAssignedRes);
      console.log('Assigned Count:', AssignedRes);
    });
  }

  getAssignmenCountByStatus(status: string): Observable<any> {
    let params = new HttpParams().set('Status', status);
    this.collapseAllItems();
    return this.httpService.getRequisitionGetForAssignmentCount(params);
  }

  ngOnDestroy() {
    if (this.ionSelectObserver) {
      this.ionSelectObserver.disconnect();
      this.ionSelectObserver = null;
      console.log("🛑 MutationObserver disconnected");
    }

    // Optional: Remove the injected styles
    document.querySelectorAll("ion-select").forEach((ionSelect) => {
      if (ionSelect.shadowRoot) {
        const style = ionSelect.shadowRoot.querySelector("style.custom-style");
        if (style) {
          ionSelect.shadowRoot.removeChild(style);
          console.log("❌ Custom style removed from ion-select");
        }
      }
    });
  }


}
