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
  readonly PaintDescriptionGet = `/PaintDescription/Get`;
  readonly PaintDescriptionUpdateRate = `/PaintDescription/UpdateRate`;
  
  
  
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
}
