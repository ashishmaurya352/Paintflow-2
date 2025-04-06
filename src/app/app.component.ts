import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private router: Router,
    private platform: Platform
  ) {}
  ngOnInit(): void {
    StatusBar.setOverlaysWebView({ overlay: false });

    SplashScreen.show();
    this.platform.ready().then(() => {
    StatusBar.hide();
      }).catch((error) => {
          console.error('Error when platform is ready:', error);
        });
        setTimeout(() => {
          SplashScreen.hide();
        }, 4000);
        this.checkAuthStatus();
  }
  checkAuthStatus(): void {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('role');

    if (authToken) {
      if (userRole === 'Admin') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/order']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
