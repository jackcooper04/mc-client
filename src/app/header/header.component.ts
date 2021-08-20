import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ServerCreatorDialogComponent } from '../server-creator-dialog/server-creator-dialog.component';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  servers:any;
  status:any;

  serverSub:Subscription;
  button_icon = "play_arrow";
  statusSub:Subscription;
  downloadSub:Subscription;
  isDownloading = false;
  window = true;
  constructor(private matDialog:MatDialog, public serverService:ServerService) { }

  openDialog(){
    const dialogRef = this.matDialog.open(ServerCreatorDialogComponent, {
      height:"460px",
      width:"300px"
    });
    dialogRef.afterClosed().subscribe(result=>{
     // console.log(result)
    })
  }

  ngOnInit(): void {
    this.serverSub = this.serverService.getServerListener().subscribe(data => {

      this.servers = data.servers;
     // console.log(this.servers)
    });
    this.statusSub = this.serverService.getServerStatusListener().subscribe(data => {
      this.status = data.status;
      if (this.status.online == true){
        let root = this;
        setTimeout(function(){
        //  console.log('hi')
          root.serverService.getStatus();

        }, 2000);
        this.isDownloading = false;
        this.button_icon = "stop";
      } else {
        this.button_icon = "play_arrow"
      };
    //  console.log(this.status);
    });
    this.downloadSub = this.serverService.getDownloadStatListener().subscribe(data => {
      this.isDownloading = data.isDownloading;
      let root = this;

    });
    this.serverService.getDownloadStatus();
    this.serverService.getStatus();
    this.serverService.getServers();
    let root = this;
    setTimeout(function(){




      if (root.isDownloading){
        let checkForComplete = setInterval(function(){
          root.serverService.getDownloadStatus();
          if (!root.isDownloading){
            setTimeout(function(){
              root.serverService.getDownloadStatus();
            if (!root.isDownloading){
           //   console.log('clear')
            clearInterval(checkForComplete)
            }
            }, 2000);


          };
       }, 1000);
      }
   }, 2000)

  }
  triggerServer(name:any){
    this.serverService.activateServer(name,this.window);
    this.isDownloading = true;
    let root = this;
   let checkTilBoot = setInterval(function(){
      root.serverService.getStatus();
    //  console.log('checked')
      if (root.status.online){
      //  console.log('Cleared')
        clearInterval(checkTilBoot);
      };
    }, 2000);
  };
  changeValue(event:any){
    this.window = event.checked;
    //console.log(event.checked)
  }

}
