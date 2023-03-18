import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url=environment.apiUrl;
  constructor(private httpClient:HttpClient) {
   }
   signup(data:any) {
    return this.httpClient.post(this.url+'/user/signup',data,{
      headers:new HttpHeaders().set("content-type",'application/json')
    })
   }

   forgotPassword(data:any){
    return this.httpClient.post(this.url+'/user/forgotPassword',data,{
      headers:new HttpHeaders().set("content-type",'application/json')
    })
   }

   login(data:any){
    return this.httpClient.post(this.url+'/user/login',data,{
      headers:new HttpHeaders().set("content-type",'application/json')
    })
   }

    checkToken(){
      return this.httpClient.get(this.url+'/user/checkToken')
    }

    changePassword(data:any){
      return this.httpClient.post(this.url+'/user/changePassword',data,{
        headers:new HttpHeaders().set("content-type",'application/json')
      })
     }

     getUser(){
      return this.httpClient.get(this.url+'/user/get');
     }

     updateUserStatus(data:any){
      return this.httpClient.patch(this.url+'/user/update',data,{
        headers:new HttpHeaders().set('content-type','application/json')
      })
     }
}
