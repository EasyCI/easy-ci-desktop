import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';


import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {UserService} from './service/user.service';
import {LoginComponent} from './login/login.component';
import {ExceptionService} from './service/exception.service';
import {CommonService} from './service/common.service';
import {SettingComponent} from './setting/setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FlowService } from './service/flow.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    SettingComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [UserService, ExceptionService, CommonService, FlowService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
