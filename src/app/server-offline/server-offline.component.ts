import { Component, OnInit } from '@angular/core';
const project = require('../../../package.json')
@Component({
  selector: 'app-server-offline',
  templateUrl: './server-offline.component.html',
  styleUrls: ['./server-offline.component.css']
})
export class ServerOfflineComponent implements OnInit {
  public versionStore: string = project.version;
  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    (<any>window).twttr.widgets.load();
}
}
