import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-server-creater',
  templateUrl: './server-creater.component.html',
  styleUrls: ['./server-creater.component.css']
})
export class ServerCreaterComponent implements OnInit {
  showError = false;
  form = new FormGroup({
    name: new FormControl(''),
    gamemode: new FormControl('creative'),
    difficulty:new FormControl('peaceful'),
    version:new FormControl('latest_release')
  });
  constructor(private http:HttpClient, public serverService:ServerService) { }

  ngOnInit(): void {
  }
  onValueChange(event:any){
    this.serverService.sourceVersion(event)
    console.log(event)
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
