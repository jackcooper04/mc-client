import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'mc-client/resources/app/node_modules/rxjs';

import { ServerService } from '../server.service';

@Component({
  selector: 'app-server-creater',
  templateUrl: './server-creater.component.html',
  styleUrls: ['./server-creater.component.css']
})
export class ServerCreaterComponent implements OnInit {
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
  constructor(private http:HttpClient, public serverService:ServerService) { }

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

    } else {
      this.showError = true;
    }

  }
}
