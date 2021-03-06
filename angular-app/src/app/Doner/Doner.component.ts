/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DonerService } from './Doner.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-doner',
  templateUrl: './Doner.component.html',
  styleUrls: ['./Doner.component.css'],
  providers: [DonerService]
})
export class DonerComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  Fname = new FormControl('', Validators.required);
  Lname = new FormControl('', Validators.required);
  donerId = new FormControl('', Validators.required);
  PhoneNo = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  creditCardNo = new FormControl('', Validators.required);
  sendMoney = new FormControl('', Validators.required);
  projectPledge = new FormControl('', Validators.required);


  constructor(public serviceDoner: DonerService, fb: FormBuilder) {
    this.myForm = fb.group({
      Fname: this.Fname,
      Lname: this.Lname,
      donerId: this.donerId,
      PhoneNo: this.PhoneNo,
      password: this.password,
      creditCardNo: this.creditCardNo,
      sendMoney: this.sendMoney,
      projectPledge: this.projectPledge
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceDoner.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.charity.net.Doner',
      'Fname': this.Fname.value,
      'Lname': this.Lname.value,
      'donerId': this.donerId.value,
      'PhoneNo': this.PhoneNo.value,
      'password': this.password.value,
      'creditCardNo': this.creditCardNo.value,
      'sendMoney': this.sendMoney.value,
      'projectPledge': this.projectPledge.value
    };

    this.myForm.setValue({
      'Fname': null,
      'Lname': null,
      'donerId': null,
      'PhoneNo': null,
      'password': null,
      'creditCardNo': null,
      'sendMoney': null,
      'projectPledge': null
    });

    return this.serviceDoner.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'Fname': null,
        'Lname': null,
        'donerId': null,
        'PhoneNo': null,
        'password': null,
        'creditCardNo': null,
        'sendMoney': null,
        'projectPledge': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.charity.net.Doner',
      'Fname': this.Fname.value,
      'Lname': this.Lname.value,
      'PhoneNo': this.PhoneNo.value,
      'password': this.password.value,
      'creditCardNo': this.creditCardNo.value,
      'sendMoney': this.sendMoney.value,
      'projectPledge': this.projectPledge.value
    };

    return this.serviceDoner.updateParticipant(form.get('donerId').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceDoner.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceDoner.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'Fname': null,
        'Lname': null,
        'donerId': null,
        'PhoneNo': null,
        'password': null,
        'creditCardNo': null,
        'sendMoney': null,
        'projectPledge': null
      };

      if (result.Fname) {
        formObject.Fname = result.Fname;
      } else {
        formObject.Fname = null;
      }

      if (result.Lname) {
        formObject.Lname = result.Lname;
      } else {
        formObject.Lname = null;
      }

      if (result.donerId) {
        formObject.donerId = result.donerId;
      } else {
        formObject.donerId = null;
      }

      if (result.PhoneNo) {
        formObject.PhoneNo = result.PhoneNo;
      } else {
        formObject.PhoneNo = null;
      }

      if (result.password) {
        formObject.password = result.password;
      } else {
        formObject.password = null;
      }

      if (result.creditCardNo) {
        formObject.creditCardNo = result.creditCardNo;
      } else {
        formObject.creditCardNo = null;
      }

      if (result.sendMoney) {
        formObject.sendMoney = result.sendMoney;
      } else {
        formObject.sendMoney = null;
      }

      if (result.projectPledge) {
        formObject.projectPledge = result.projectPledge;
      } else {
        formObject.projectPledge = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'Fname': null,
      'Lname': null,
      'donerId': null,
      'PhoneNo': null,
      'password': null,
      'creditCardNo': null,
      'sendMoney': null,
      'projectPledge': null
    });
  }
}
