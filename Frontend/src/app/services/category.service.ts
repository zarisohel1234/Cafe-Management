import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
url=environment.apiUrl;
category:any
  constructor(private httpClient:HttpClient) { }

  addData(data:any){
    return this.httpClient.post(this.url+'/category/add',data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  updateData(data:any){
    return this.httpClient.patch(this.url+'/category/update',data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  getCategorys(){
    return this.httpClient.get(this.url+'/category/get')
  }
}
