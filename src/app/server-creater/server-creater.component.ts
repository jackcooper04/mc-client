import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
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
      this.http.post("http://localhost:8081/api/server",obj)
      .subscribe(responseData => {
        console.log(responseData)
      })

    } else {
      this.showError = true;
    }

  }
}
