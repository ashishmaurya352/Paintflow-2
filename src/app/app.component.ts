import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { Capacitor } from '@capacitor/core';
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
  ) { }
  async ngOnInit(): Promise<void> {


    SplashScreen.show();
    this.platform.ready().then(async () => {
      if (Capacitor.getPlatform() === 'android') {
        await EdgeToEdge.enable();
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: false });
        // StatusBar.hide();
      }
    }).catch((error) => {
      console.error('Error when platform is ready:', error);
    });
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
    this.checkAuthStatus();
  }
  checkAuthStatus(): void {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('role');

    if (authToken) {
      if (userRole === 'Admin') {
        this.router.navigate(['/dashboard']);
      }
      else if (userRole === 'Customer') {
        this.router.navigate(['/customer-dashboard']);
      } else {
        this.router.navigate(['/order']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
