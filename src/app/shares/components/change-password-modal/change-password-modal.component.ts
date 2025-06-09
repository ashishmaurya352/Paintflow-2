import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { IonLabel, IonInput, IonHeader } from "@ionic/angular/standalone";
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChangePasswordModalComponent  implements OnInit {
  @Input() userList:any = [];
newPassword: string = '';
  confirmPassword: string = '';
selectedUser: any = null;
  constructor(
    private modalController: ModalController,
    private httpService: HttpService,
        private controller: ControllerService,
    
  ) { }

  ngOnInit() {}
   model = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  submitted = false;
  mismatch = false;

  onSubmit() {
    this.submitted = true;
    const data = {
      id: this.selectedUser?.id,
      newPassword: this.newPassword.trim(),
    }
    console.log('Password Change Data:', data);
    if (this.newPassword.trim() === this.confirmPassword.trim() && this.newPassword.trim().length > 6) {
      this.submitted = false;
      this.mismatch = false;
      // Call API here
      this.controller.showloader()
      this.httpService.updatePassword(data).subscribe(
        (response: any) => {
          this.controller.hideloader()
          console.log('Password changed successfully:', response);
          this.modalController.dismiss({ success: true });
          this.controller.showToast('Password changed successfully')
        }
      );
    } else {
      this.mismatch = this.newPassword !== this.confirmPassword;
    }
  }
  onStatusChange(event: any,) {
    console.log('Status changed for user:', event.detail.value);
    // console.log('Status changed for user:'', event.detail.value);
    // Handle status change logic here
  }
  dismiss(){
    this.modalController.dismiss()
  }

}
