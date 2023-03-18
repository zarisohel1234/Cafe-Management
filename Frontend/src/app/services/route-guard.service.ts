import { GlobalConstants } from './../shared/global-constants';
import { SnackbarService } from './snackbar.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private auth:AuthService,
    private router:Router,
    private snackbarService:SnackbarService) { }

    canActivate(router:ActivatedRouteSnapshot):boolean{
      let expectedRoleArray=router.data;
      expectedRoleArray=expectedRoleArray.expectedRole;

      const token:any=localStorage.getItem('token')
      var tokenPayload:any
      try{
        tokenPayload=jwt_decode(token)
      }catch(err){
        localStorage.clear();
        this.router.navigate(['/']);
      }

      let checkRole=false;
      for(let i=0;i<expectedRoleArray.length;i++){
        if(expectedRoleArray[i]==tokenPayload.role){
          checkRole=true
        }
      }

      if(tokenPayload.role=='admin' || tokenPayload.role=='user'){
        if(this.auth.isAuthenticated() && checkRole){
          return true;
        }
        this.snackbarService.openSnackBar(GlobalConstants.unauthorized,GlobalConstants.error)
        this.router.navigate(['/cafe/dashboard']);
        return false;
      }
      else{
        localStorage.clear();
        this.router.navigate(['/']);
        return false;
      }
    }
}
