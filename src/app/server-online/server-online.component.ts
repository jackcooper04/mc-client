import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-server-online',
  templateUrl: './server-online.component.html',
  styleUrls: ['./server-online.component.css']
})

export class ServerOnlineComponent implements OnInit {
  playersOnline:any;
  previousNumber = 0;
  banned:any;
  statusSub:Subscription;
  bannedSub:Subscription;
  status:any;
  constructor(public serverService:ServerService) { }

  ngOnInit(): void {
    this.statusSub = this.serverService.getServerStatusListener().subscribe(data => {
      this.status = data.status;
      //console.log(this.status);
      let livePlayersOnline = [];
      let storedPlatersOnline = [];
      for (let storedIdx in this.playersOnline){
        storedPlatersOnline.push(this.playersOnline[storedIdx].name);
      };
      for (let liveIdx in this.status.players){
        livePlayersOnline.push(this.status.players[liveIdx].name);
      };
      if (storedPlatersOnline.length == 0){
        this.playersOnline = this.status.players;
      };
      let number = 0;
      for (let checkIdx in storedPlatersOnline){
        if (livePlayersOnline.includes(storedPlatersOnline[checkIdx])){
          number = number + 1;
        };
      };
     // console.log('Array Length '+this.status.players.length);
//console.log('Number '+number)
      if (number != this.status.players.length || this.previousNumber != this.status.players.length){

        this.playersOnline = this.status.players;
      };
      this.previousNumber = number;

    });
    this.bannedSub = this.serverService.getBannedListener().subscribe(data => {


      if (JSON.stringify(this.banned) != JSON.stringify(data.banned)){
        console.log('changed')
        this.banned = data.banned;
      };


    });
  }

}
