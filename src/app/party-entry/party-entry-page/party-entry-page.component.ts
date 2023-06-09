import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CodeInfoService } from 'src/app/backend/partycode-backend/code-info.service';
import { UserService } from 'src/app/services/user.service';
import { CodeServiceService } from '../code-service.service';

/**
 * Typescript file to handle events and enter users into specified party
 * @file party-entry-page.component.ts
 * @author Ian Jackson
 * @author Nathan Mullins
 * @date Mar 20, 2023
 */

@Component({
  selector: 'app-party-entry-page',
  templateUrl: './party-entry-page.component.html',
  styleUrls: ['./party-entry-page.component.css']
})
export class PartyEntryPageComponent implements OnInit, OnDestroy {
  // party code the user entered
  partyCode: string = '';

  /* boolean values to handle input errors */
  isValid: boolean = false;
  showError: boolean = false;

  // array to hold the party codes taken
  validPartyCodes: string[] = [];

  // subscription instance to communicate with backend
  subscription: Subscription | any;

  constructor(private router: Router, private codeService: CodeServiceService, private http: HttpClient, private CodeInfoService: CodeInfoService, private userService: UserService) {

  }

  /**
   * Runs on initialization, grabs party code from Service
   * Sets the value from the service to the input
   */
  ngOnInit(): void {
    // get partyCode from service
    this.subscription = this.codeService.currentCode.subscribe(code => {
      this.partyCode = code
      console.log(this.partyCode);
    });
    
    // set input element to the party code sent to service
    (<HTMLInputElement>document.getElementById("partyCode")).setAttribute("value", this.partyCode);

    // gets the list of used party codes from the backend
    this.http.get<{ [key: string]: any }>('https://got-next-app-default-rtdb.firebaseio.com/Party.json').subscribe(data => {
      this.validPartyCodes = Object.keys(data);
    });
  } 

  /**
   * Cleans up memory, prevent data leaks
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Runs on the submit button
   * Grabs the value of the input field ans passes to validate function
   */
  getPartyCode() {
    // set party code to value in input field 
    this.partyCode = (<HTMLInputElement>document.getElementById("partyCode")).value
    
    // Check if party code is valid
    this.validatePartyCode(this.partyCode)
  }

  /**
   * Validates the party code, cross references with Realtime Database
   * @param partyCode party code to be checked
   */
  validatePartyCode(partyCode: string) {
    // reset validity
    this.isValid = false;

    // check inputted code with each element in array
    for (let code of this.validPartyCodes) {
      // if inputted code matches a valid code
      if (partyCode === code) {
        this.isValid = true;
        break;
      }
    }
    
    if (this.isValid) {
      // set code = party code so it can be used to sort users
      this.CodeInfoService.code = partyCode;

      this.userService.updatePartyCode(this.partyCode);

      this.showError = false;
      this.router.navigate(['/userlogin']);
    } else {
      this.showError = true;
    }

  }
}

