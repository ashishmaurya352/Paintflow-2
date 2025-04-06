import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SwiperComponent } from '../swiper/swiper.component';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-img-modal',
  templateUrl: './img-modal.component.html',
  styleUrls: ['./img-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImgModalComponent implements OnInit {
  @Input() image:any[] = [];  // Control modal visibility
  @Input() isEdit = false;  // Control modal visibility
  formData: FormData = new FormData();
  uploadImage: any

  constructor(
    private modalController: ModalController,
    private controller: ControllerService,
    private httpService: HttpService,
  ) { }

  ngOnInit() { 
    console.log('ImgModalComponent', this.image)
  }

  closeModal() { 
    this.modalController.dismiss();
  }
  async submit() {
    this.controller.showloader()
 await this.uploadAllImages()
    // this.controller.showToast('Images uploaded successfully', 'success', 'top', 2000);
    this.controller.hideloader()
    this.modalController.dismiss(this.uploadImage);
  }
  // images: any = [
  //   // { file: new File([], 'image1.jpg'), compressedUrl: 'https://ionicframework.com/docs/img/demos/thumbnail.svg' },
  //   // { file: new File([], 'image2.jpg'), compressedUrl: 'https://ionicframework.com/docs/img/demos/thumbnail.svg' },
  //   // { file: new File([], 'image3.jpg'), compressedUrl: 'https://ionicframework.com/docs/img/demos/thumbnail.svg' },
  // ];
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = () => {
          this.image.push({
            file: file, // Store the original File object
            compressedUrl: reader.result as string, // Data URL (can be replaced with actual compression logic)
          });
        };

        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.image.splice(index, 1);
  }
  async openSwiper(data: any) {
    const modal = await this.modalController.create({
      component: SwiperComponent,
      componentProps: {
        Images: data,
      },
    });
    await modal.present();
  }

  async uploadAllImages(): Promise<void> {
    this.formData = new FormData();
    if (this.image.length > 0) {

      try {
        // Ensure all images are added to the FormData
        const uploadPromises = this.image.map((img: { file: File; compressedUrl: string; }) => this.addImageToFormData(img.file, img.compressedUrl));
        await Promise.all(uploadPromises);
        if (!this.formData || !this.formData.has('files')) {
          console.error('No files to upload');
          return;
        }

        // Use an Observable with a Promise-based approach to await completion
        const uploadResponse = await this.uploadImagesAsync();

        // Handle the response once all images are uploaded
        if (uploadResponse) {
          console.log('Images uploaded successfully:', uploadResponse);
          this.uploadImage = uploadResponse.filePaths;
        } else {
          console.error('Upload failed, no response');
        }
      } catch (error) {
        // Handle errors during image processing or HTTP upload
        console.error('Error uploading images:', error);
      }
    }
  }
  addImageToFormData(image: File, compressedImageUrl: string): Promise<void> {
    return fetch(compressedImageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        this.formData.append('files', blob, image.name || 'image.jpg'); // Use default name if missing
      })
      .catch((error) => {
        console.error('Error converting URL to blob:', error);
      });
  }
  private uploadImagesAsync(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.documentsUpload(this.formData).subscribe(
        (response) => resolve(response), // Success case
        (error) => reject(error)         // Error case
      );
    });
  }
}
