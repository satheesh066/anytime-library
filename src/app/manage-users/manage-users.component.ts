import { Component, OnInit } from '@angular/core';

import { UserService } from './../services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  constructor(private userService: UserService) {}

  ngOnInit() {
  }

}
