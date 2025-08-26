import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
// 
  // private apiUrl = 'https://paintflow.runasp.net/api';
  private apiUrl = 'https://paintflowtest.runasp.net/api';
  // private apiUrl = 'https://srv01108.wipropari.com:5246/api';

  readonly login = `/User/login`;
  readonly register = `/User/register`;
  readonly roles = `/Contant/Roles`;
  readonly teams = `/Contant/Teams`;
  readonly requisition = `/Requisition`;
  readonly assignement = `/Requisition/GetForAssignement`;
  readonly item = `/item`;
  readonly itemProcess = `/ItemProcess/AssignItemProcess`;
  readonly itemDetail = `/Item/GetDetailed`;
  readonly acceptItemProcess = `/ItemProcess/AcceptItemProcess`;
  readonly itemProcessStartWork = `/ItemProcess/StartWork`;
  readonly UpdateItemStatus = `/ItemProcess/UpdateStatus`;
  readonly Approve = `/ItemProcess/Approve`;
  readonly ActiveRequisitionCount = `/Dashboard/ActiveRequisitionCount`;
  readonly CostOverview = `/Dashboard/CostOverview`;
  readonly DocumentsUpload = `/Document/Upload`;
  readonly DocumentsUploadExcel = `/Document/UploadExcel`;
  readonly RequisitionFetch = `/Requisition/Fetch`;
  readonly ItemProcessDetailed = `/ItemProcess/Detailed`;
  readonly GetQADashboard = `/Requisition/GetQADashboard`;
  readonly ItemGetImages = `/Item/GetImages`;
  readonly RestartWork = `/ItemProcess/RestartWork`;
  readonly ItemSearchItem = `/Item/Search`;
  readonly RequisitionSearch = `/Requisition/Search`;
  readonly ItemUpdatePriorityStatus = `/Item/UpdatePriorityStatus`;
  readonly RequisitionUpdatePriorityStatus = `/Requisition/UpdatePriorityStatus`;
  readonly ItemUpdateColor = `/Item/UpdateColor`;
  readonly ItemGetColors = `/Item/GetColors`;
  readonly PaintDescWiseCostOverview = `/Dashboard/PaintDescWiseCostOverview`;
  readonly PaintDescriptionGet2 = `/PaintDescription/GetForRate`;
  readonly PaintDescriptionGet = `/PaintDescription/Get`;
  readonly PaintDescriptionUpdateRate = `/PaintDescription/UpdateRate`;
  readonly GetUsers = `/User/GetUsers`;
  readonly UpdatePassword = `/User/UpdatePassword`;
  readonly ItemReject = `/Item/Reject`;
  readonly ItemGetBySlipNumber = `/Item/GetBySlipNumber`;
  readonly ItemGetSummary = `/Item/GetSummary`;
  readonly ReportGetItems = `/Report/GetItems`;
  readonly ReportGetTeamWiseDelay = `/Report/GetTeamWiseDelay`;
  readonly ReportGetTeamWiseRework = `/Report/GetTeamWiseRework`;
  readonly ItemRevertChanges = `/Item/Revert`; 
  readonly ReportGetDayWiseCostOverview = `/Report/GetDayWiseCostOverview`;
  readonly ReportGetPaintingPlan = `/Report/GetPaintingPlan`;
  readonly RequisitionGetPersons = `/Requisition/GetPersons`;
  readonly RequisitionGetCount = `/Requisition/GetCount`;
  readonly RequisitionGetForAssignementCount = `/Requisition/GetForAssignementCount`;
  readonly ReportGetPaintingPlanReport = `/Report/GetPaintingPlanReport`;
  constructor(
    private httpClient: HttpClient
  ) { }

  getLogin(data: any): Observable<any> {
    let url = `${this.apiUrl + this.login}`;
    return this.httpClient.post(url, data);
  }

  getRegister(data: any): Observable<any> {
    let url = `${this.apiUrl + this.login}`;
    return this.httpClient.post(url, data);
  }

  getRoles(): Observable<any> {
    let url = `${this.apiUrl + this.roles}`;
    return this.httpClient.get(url);
  }

  getTeams(): Observable<any> {
    let url = `${this.apiUrl + this.teams}`;
    return this.httpClient.get(url);
  }

  getRequisition(data: any): Observable<any> {
    let url = `${this.apiUrl + this.requisition}?${data}`;
    return this.httpClient.get(url);
  }

  getAssignement(data: any): Observable<any> {
    let url = `${this.apiUrl + this.assignement}?${data}`;
    return this.httpClient.get(url);
  }

  getItem(data: any): Observable<any> {
    let url = `${this.apiUrl + this.item}?${data}`;
    return this.httpClient.get(url);
  }

  assignItemProcess(data: any): Observable<any> {
    let url = `${this.apiUrl + this.itemProcess}`;
    return this.httpClient.post(url, data);
  }

  getItemDetail(data: any): Observable<any> {
    let url = `${this.apiUrl + this.itemDetail}?${data}`;
    return this.httpClient.get(url);
  }

  acceptItemForProcess(data: any): Observable<any> {
    let url = `${this.apiUrl + this.acceptItemProcess}`;
    return this.httpClient.post(url, data);
  }

  startTask(data: any): Observable<any> {
    let url = `${this.apiUrl + this.itemProcessStartWork}?${data}`;
    return this.httpClient.put(url,'');
  }

  updateItemStatus(data: any): Observable<any> {
    let url = `${this.apiUrl + this.UpdateItemStatus}?${data}`;
    return this.httpClient.put(url, '');
  }

  approve(data: any): Observable<any> {
    let url = `${this.apiUrl + this.Approve}`;
    return this.httpClient.put(url, data);
  }
  getActiveRequisitionCount(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ActiveRequisitionCount}?${data}`;
    return this.httpClient.get(url);
  }
  getCostOverview(data:any): Observable<any> {
    let url = `${this.apiUrl + this.CostOverview}?${data}`;
    return this.httpClient.get(url);
  }
  documentsUpload(data: any) {
    let url = `${this.apiUrl + this.DocumentsUpload}`;
    return this.httpClient.post(url, data);
  }
  documentsUploadExcel(data: any): Observable<any> {
    let url = `${this.apiUrl + this.DocumentsUploadExcel}`;
    return this.httpClient.post(url, data);
  }
  getRequisitionFetch(): Observable<any> {
    let url = `${this.apiUrl + this.RequisitionFetch}`;
    return this.httpClient.get(url);
  }
  getItemProcessDetailed(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ItemProcessDetailed}/${data}`;
    return this.httpClient.get(url);
  }
  getQADashboard(): Observable<any> {
    let url = `${this.apiUrl + this.GetQADashboard}`;
    return this.httpClient.get(url);
  }
  getItemGetImages(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ItemGetImages}/${data}`;
    return this.httpClient.get(url);
  }
  restartWork(data: any): Observable<any> {
    let url = `${this.apiUrl + this.RestartWork}?${data}`;
    return this.httpClient.put(url, '');
  }
  getItemSearchItem(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ItemSearchItem}?${data}`;
    return this.httpClient.get(url);
  }
  getRequisitionSearch(data: any): Observable<any> {
    let url = `${this.apiUrl + this.RequisitionSearch}?${data}`;
    return this.httpClient.get(url);
  }
  itemUpdatePriorityStatus(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ItemUpdatePriorityStatus}?${data}`;
    return this.httpClient.put(url, '');
  }
  requisitionUpdatePriorityStatus(data: any): Observable<any> {
    let url = `${this.apiUrl + this.RequisitionUpdatePriorityStatus}?${data}`;
    return this.httpClient.put(url, '');
  }
  itemUpdateColor(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ItemUpdateColor}?${data}`;
    return this.httpClient.put(url, '');
  }
  getItemGetColors(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ItemGetColors}/${data}`;
    return this.httpClient.get(url);
  }
  getPaintDescWiseCostOverview(data: any): Observable<any> {
    let url = `${this.apiUrl + this.PaintDescWiseCostOverview}?${data}`;
    return this.httpClient.get(url);
  }
  getPaintDescriptionGet(): Observable<any> {
    let url = `${this.apiUrl + this.PaintDescriptionGet}`;
    return this.httpClient.get(url);
  }
  getPaintDescriptionGet2(): Observable<any> {
    let url = `${this.apiUrl + this.PaintDescriptionGet2}`;
    return this.httpClient.get(url);
  }
  
  paintDescriptionUpdateRate(data: any): Observable<any> {
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params = params.set(key, data[key]);
      }
    }
    const url = `${this.apiUrl + this.PaintDescriptionUpdateRate}`;
    return this.httpClient.put(url, '', { params }); // sending as query params
  }
  getUsers(): Observable<any> {
    let url = `${this.apiUrl + this.GetUsers}`;
    return this.httpClient.get(url);
  }
  updatePassword(data: any): Observable<any> {
    let url = `${this.apiUrl + this.UpdatePassword}`;
    return this.httpClient.post(url, data);
  }
  itemReject(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ItemReject}?${data}`;
    return this.httpClient.put(url, '');
  }
  itemGetBySlipNumber(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ItemGetBySlipNumber}?${data}`;
    return this.httpClient.get(url);
  }

  itemGetSummary(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ItemGetSummary}?${data}`;
    return this.httpClient.get(url);
  }
  reportGetItems(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ReportGetItems}?${data}`;
    return this.httpClient.get(url,{responseType: 'text'});
  }
  reportGetTeamWiseDelay(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ReportGetTeamWiseDelay}?${data}`;
    return this.httpClient.get(url);
  }
  reportGetTeamWiseRework(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ReportGetTeamWiseRework}?${data}`;
    return this.httpClient.get(url);
  }
  itemRevertChanges(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ItemRevertChanges}?${data}`;
    return this.httpClient.put(url, '');
  }
  reportGetDayWiseCostOverview(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ReportGetDayWiseCostOverview}?${data}`;
    return this.httpClient.get(url,{responseType: 'text'});
  }
  reportGetPaintingPlan(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ReportGetPaintingPlan}?${data}`;
    return this.httpClient.get(url);
  }
  requisitionGetPersons(): Observable<any> {
    let url = `${this.apiUrl + this.RequisitionGetPersons}`;
    return this.httpClient.get(url);
  }
  getRequisitionGetCount(data: any): Observable<any> {
    let url = `${this.apiUrl + this.RequisitionGetCount}?${data}`;
    return this.httpClient.get(url);
  }
  getRequisitionGetForAssignmentCount(data: any): Observable<any> {
    let url = `${this.apiUrl + this.RequisitionGetForAssignementCount}?${data}`;
    return this.httpClient.get(url);
  }
  getReportGetPaintingPlanReport(data: any): Observable<any> {
    let url = `${this.apiUrl + this.ReportGetPaintingPlanReport}?${data}`;
    return this.httpClient.get(url,{responseType: 'text'});
  }

}
