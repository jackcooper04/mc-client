import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServerCreatorDialogComponent } from '../server-creator-dialog/server-creator-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private matDialog:MatDialog) { }

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
  }

}
