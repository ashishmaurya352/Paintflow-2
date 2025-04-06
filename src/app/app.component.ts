import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private router: Router
  ) {}
  ngOnInit(): void {
    this.checkAuthStatus();
  }
  checkAuthStatus(): void {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('role');

    if (authToken) {
      // If user is logged in, redirect based on role
      if (userRole === 'Admin') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/order']);
      }
    } else {
      // If no token is found, redirect to login page
      this.router.navigate(['/login']);
    }
  }
}
