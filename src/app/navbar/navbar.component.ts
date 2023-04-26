import { Component } from '@angular/core';
import { FloatingUserInfoService } from '../backend/floatinguser-backend/floatinguser-info.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private floatingUserInfoService: FloatingUserInfoService, private authService: AuthService,
    private router: Router) {

  }

  name = this.floatingUserInfoService.FloatingUser;

  signOut() {
    // TODO: remove user from backend once leave
    //this.authService.deleteUser();
    this.router.navigate(['/']);
  }
}
