import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './material-module';
import { HeaderComponent } from './header/header.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServerListComponent } from './server-list/server-list.component';
import { ServerCreatorDialogComponent } from './server-creator-dialog/server-creator-dialog.component';
import { ServerOnlineComponent } from './server-online/server-online.component';
import { ServerOfflineComponent } from './server-offline/server-offline.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,

    ServerListComponent,
    ServerCreatorDialogComponent,
    ServerOnlineComponent,
    ServerOfflineComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
