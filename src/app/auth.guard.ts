import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      console.log('Token:', token);
      console.log('Role:', role);
      console.log('Expected Role:', route.data['expectedRole']);
  
      if (token) {
        const expectedRole = route.data['expectedRole'];
        if (role === expectedRole) {
          return true;
        } else {
          console.log('Role mismatch, redirecting to landing...');
          this.router.navigate(['/landing']);
          return false;
        }
      } else {
        console.log('No token found, redirecting to landing...');
        this.router.navigate(['/landing']);
        return false;
      }
    } else {
      console.log('Not running in browser, redirecting to landing...');
      this.router.navigate(['/landing']);
      return false;
    }
  }
  
}
