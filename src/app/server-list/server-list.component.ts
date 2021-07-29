import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.css']
})
export class ServerListComponent implements OnInit {
  servers:any;
  serverSub:Subscription;
  downloadSub:Subscription;
  isDownloading = false;
  window = true;
  constructor(public serverService:ServerService) { }

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
