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
  serverSub:Subscription;
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
      console.log(result)
    })
  }

  ngOnInit(): void {
    this.serverSub = this.serverService.getServerListener().subscribe(data => {

      this.servers = data.servers;
      console.log(this.servers)
    });
    this.downloadSub = this.serverService.getDownloadStatListener().subscribe(data => {
      this.isDownloading = data.isDownloading;
    });
    this.serverService.getDownloadStatus();
    this.serverService.getServers();
  }
  triggerServer(name:any){
    this.serverService.activateServer(name,this.window);
  };
  changeValue(event:any){
    this.window = event.checked;
    console.log(event.checked)
  }

}
