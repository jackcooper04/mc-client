import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private servers = [];
  private isDownloading = false;
  private status = {};
  private versions = [];
  private serversUpdated = new Subject<{servers:any[]}>();
  private statusUpdated =  new Subject<{status:any}>();
  private versionsUpdated = new Subject<{versions:any[]}>();
  private downloadStatUpdated = new Subject<{isDownloading:boolean}>();

  constructor(private http:HttpClient) { }

  getServers(){

    this.http.get<{servers:any}>('http://localhost:8081/api/server')
    .subscribe(responseData => {
      this.servers = responseData.servers;
      console.log(this.servers)
      this.serversUpdated.next({servers:[...this.servers]});
    });
  };
  getStatus(){

    this.http.get<{status:any}>('http://localhost:8081/api/server/status')
    .subscribe(responseData => {
      this.status = responseData.status;

      this.statusUpdated.next({status:this.status});
    });
  };
  getDownloadStatus(){
    this.http.get<{isDownloading:boolean}>('http://localhost:8081/api/server/isDownload')
    .subscribe(responseData => {
      this.isDownloading = responseData.isDownloading;

      this.downloadStatUpdated.next({isDownloading:this.isDownloading});
    });
  };
  getVersions(snapshot:boolean){
    this.http.get<{versions:any}>('http://localhost:8081/api/server/versionList?snapshot='+snapshot)
    .subscribe(responseData => {
      this.versions = responseData.versions;

      this.versionsUpdated.next({versions:this.versions});
    });
  };

  getServerListener(){
    return this.serversUpdated.asObservable();
  };
  getVersionListener(){
   return this.versionsUpdated.asObservable();
  }
  getDownloadStatListener(){
    return this.downloadStatUpdated.asObservable();
  };
  getServerStatusListener(){
    return this.statusUpdated.asObservable();
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
