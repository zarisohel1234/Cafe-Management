import jwt_decode from 'jwt-decode';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from 'src/app/shared/menu-items';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  token: any;
  tokenPayload: any;
  menus:any=[]
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
  ) {
    this.token=localStorage.getItem('token')
    this.tokenPayload = jwt_decode(this.token)
    console.log(this.tokenPayload);
    this.getMenu()
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  getMenu(){
    this.menus=this.menuItems.getMenuItem();
    console.log(this.menus);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
