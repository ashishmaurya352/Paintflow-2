import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonHeader } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // standalone: true,  
})
export class LoginPage implements OnInit {

  
  email: string = '';
  password: string = 'Test@123';
  showPassword: boolean = false;
  rememberPassword: boolean = false;

  emailRequired: boolean = false;
  passwordRequired: boolean = false;
  invalidLogin: boolean = false;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private controller: ControllerService
  ) {
    // addIcons({ mail, eye, eyeOff });
  }

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  login() {
    this.emailRequired = false;
    this.passwordRequired = false;
    this.invalidLogin = false;

    if (!this.email || this.email.trim() === '') {
      this.emailRequired = true
      console.log('this.email',this.email)
      console.error('Email and Password are required');
      return; // Stop execution if either is missing or empty
    }
    if (!this.password || this.password.trim() === '') {
      this.passwordRequired = true
      console.error('Password is required');
      return; // Stop execution if either is missing or empty

    }
    const data = {
      username: this.email,
      password: this.password
    }
    this.controller.showloader()
    this.httpService.getLogin(data)
      .subscribe(
        (res: any) => {
          this.controller.hideloader()
          this.email = '';
          // this.password = '';
          this.controller.showToast('Logged In Successfully')
          localStorage.setItem('authToken', res.token)
          localStorage.setItem('role', res.role)
          localStorage.setItem('team', res.team)

          if (res.role === 'Admin') {
            this.router.navigate(['/dashboard']);
          }else if (res.role === 'QA') {
            this.router.navigate(['/qa-dashboard']);
          }
          else{
            this.router.navigate(['/order']);
          }


          console.log('res', res);

        },
        (error) => {
          this.controller.hideloader()
          this.invalidLogin = true;

          console.error('Error:', error);
        }
      );

  }

  forgotPassword() {
    // Handle "Forgot password" flow here
    console.log('Forgot password clicked');
  }

}
