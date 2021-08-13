import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-server-creator-dialog',
  templateUrl: './server-creator-dialog.component.html',
  styleUrls: ['./server-creator-dialog.component.css']
})
export class ServerCreatorDialogComponent implements OnInit {
  showError = false;
  versionSub:Subscription;
  downloadSub:Subscription;
  isDownloading = false;
  snapshot = false;
  versionStore:any
  form = new FormGroup({
    name: new FormControl(''),
    gamemode: new FormControl('creative'),
    difficulty:new FormControl('peaceful'),
    version:new FormControl('')
  });
  message:string
  cancelButtonText = " Cancel";
  constructor(@Inject (MAT_DIALOG_DATA) public data:any, public dialogRef:MatDialogRef<ServerCreatorDialogComponent>,private http:HttpClient, public serverService:ServerService ) {
    if (data){
      this.message = data.message || this.message;

      if(data.buttonText){
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }
  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
  ngOnInit(): void {
    this.versionSub = this.serverService.getVersionListener().subscribe(data => {
      this.versionStore = data.versions;
    });
    this.downloadSub = this.serverService.getDownloadStatListener().subscribe(data => {
      this.isDownloading = data.isDownloading;
    });
    let root = this;
    let checkForComplete = setInterval(function(){
      root.serverService.getDownloadStatus();
      if (!root.isDownloading){
        console.log('clear')
        clearInterval(checkForComplete)



      };
   }, 1000);
    this.serverService.getVersions(this.snapshot);
  }
  onValueChange(event:any){
    this.serverService.sourceVersion(event);
    let root = this;
    let checkForComplete = setInterval(function(){
      root.serverService.getDownloadStatus();
      if (!root.isDownloading){
        setTimeout(function(){
          root.serverService.getDownloadStatus();
        if (!root.isDownloading){
          console.log('clear')
        clearInterval(checkForComplete)
        }
        }, 2000);


      };
   }, 1000);
    console.log(event)
  }
  changeValue(event:any){
    this.snapshot = event.checked;
    this.serverService.getVersions(this.snapshot);
    console.log(event.checked)
  }
  submit(){
    if (this.form.valid){
      this.showError = false;
      var obj = {
        "name":this.form.value.name,
        "gamemode":this.form.value.gamemode,
        "difficulty":this.form.value.difficulty,
        "version":this.form.value.version,
        "max":20,
        "whitelist":false
      }
      this.serverService.addServer(obj);
      this.dialogRef.close(true)

    } else {
      this.showError = true;
    }

  }

}
