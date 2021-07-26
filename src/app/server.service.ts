import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private servers = [];
  private serversUpdated = new Subject<{servers:any[]}>();

  constructor(private http:HttpClient) { }

  getServers(){

    this.http.get<{servers:any}>('http://localhost:8081/api/server')
    .subscribe(responseData => {
      this.servers = responseData.servers;
      console.log(this.servers)
      this.serversUpdated.next({servers:[...this.servers]});
    });
  };
  getServerListener(){
    return this.serversUpdated.asObservable();
  };
  addServer(data:any){
    this.http.post("http://localhost:8081/api/server",data)
    .subscribe(responseData => {
      this.getServers();
    })
  };
  sourceVersion(version:any){
    this.http.get<{message:string}>("http://localhost:8081/api/server/source/"+version)
    .subscribe(responseData => {
      console.log(responseData)
    })
  }
  sendRcon(command:any){
    this.http.get<{message:string}>("http://localhost:8081/api/server/rcon/"+command)
    .subscribe(responseData => {
      console.log(responseData)
    })
  }
  activateServer(name:string,window:boolean){
    this.http.get<{message:string}>("http://localhost:8081/api/server/trigger/"+name+"?window="+window)
    .subscribe(responseData => {
      console.log(responseData)
    })
  }
}
