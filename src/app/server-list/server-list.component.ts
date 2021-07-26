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
  window = true;
  constructor(public serverService:ServerService) { }

  ngOnInit(): void {
    this.serverSub = this.serverService.getServerListener().subscribe(data => {

      this.servers = data.servers;
      console.log(this.servers)
    });
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
