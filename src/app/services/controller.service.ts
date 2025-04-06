import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  loader: any;
  userData: any;
  isLoading = false;

  loadingCounter = 0;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
  }

  async showloader(msg = 'Please wait') {
    this.loadingController.getTop().then(async (hasLoading) => {
      if (!hasLoading) {
        this.isLoading = true;
        await this.loadingController
          .create({
            message: msg,
            keyboardClose: true,
            translucent: true,
            backdropDismiss: true,
            cssClass: 'loader-modal',
          })
          .then((a) => {
            a.present().then(() => {
              if (!this.isLoading) {
                a.dismiss();
              }
            });
          });
      }
    });
  }

  async hideloader() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => {
      })
      .catch(() => console.log('dismissed error'));
  }

  async showToast(msg: any, position: any = 'bottom', duration: number = 2000) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      position: position,
    });
    toast.present();
  }
}
