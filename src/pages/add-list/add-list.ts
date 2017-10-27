import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DatabaseProvider } from '../../providers/database/database';
import { HomePage } from '../home/home';
import { FileSystemProvider } from '../../providers/file-system/file-system';




/**
 * Generated class for the AddListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-list',
  templateUrl: 'add-list.html',
})
export class AddListPage {
item = [];
image: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
   public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController, 
   public databaseService: DatabaseProvider,public fileService: FileSystemProvider) {
  

  }
 options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.FILE_URI,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE,
  sourceType: this.camera.PictureSourceType.CAMERA,
  correctOrientation: true
}

cameraButton(){
this.camera.getPicture(this.options).then((imageUri) => {
 this.image = imageUri;

}, (err) => {
 
 console.log('take photo error ') + err;
});
}


open_camera_library(){
	var options = {
		sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
		destinationType: this.camera.DestinationType.DATA_URL,
		mediaType: this.camera.MediaType.PICTURE
	};
	this.camera.getPicture(options).then((imageData) =>{
	this.image= 'data:image/jpeg;base64,' + imageData;

	},
	(err) =>{
		console.log('Open photo library error') + err;
	});
}

 presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your photo',
      buttons: [
        {
          icon: 'camera',
          text: 'Take photo',
          role: 'destructive',
          handler: () => {
          	this.cameraButton();
            console.log('Take photo button clicked');
          }
        },{
          icon: 'images',
          text: 'Choose from library',
          handler: () => {
          	this.open_camera_library();
            console.log('Choose from library');
          }
        },{
          icon: 'close',
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }



showConfirm(){
    let confirm = this.alertCtrl.create({
      title: 'Adding item..',
      message: 'Are you sure want to add item?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
          	this.leavePage();
            console.log('Yes clicked');
          }
        }
      ]
    });
    confirm.present();


  }


leavePage(){

this.databaseService.add_item(this.item[0],this.item[1],this.item[2],this.item[3],this.image).then((results) =>{
this.navCtrl.setRoot(HomePage);
});
this.fileService.copyFile(this.image);
this.navCtrl.pop();
this.showAlert();

}

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Done!',
      subTitle: 'Your item has been added!',
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddListPage');
  }


cancel(){
  this.navCtrl.pop();
}


}


