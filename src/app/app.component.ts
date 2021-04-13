import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authentication/authorization.service';
// import { AdalService } from 'adal-angular4';
// import { AuthSecretService } from './authentication/auth-secret.service.';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'anytime-library';
  constructor(private authService: AuthorizationService){
  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
