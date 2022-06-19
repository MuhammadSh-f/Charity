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
import { CharityService } from './Charity.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-charity',
  templateUrl: './Charity.component.html',
  styleUrls: ['./Charity.component.css'],
  providers: [CharityService]
})
export class CharityComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  CharityName = new FormControl('', Validators.required);
  Details = new FormControl('', Validators.required);
  CharityId = new FormControl('', Validators.required);
  projectPledge = new FormControl('', Validators.required);


  constructor(public serviceCharity: CharityService, fb: FormBuilder) {
    this.myForm = fb.group({
      CharityName: this.CharityName,
      Details: this.Details,
      CharityId: this.CharityId,
      projectPledge: this.projectPledge
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCharity.getAll()
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
      $class: 'org.charity.net.Charity',
      'CharityName': this.CharityName.value,
      'Details': this.Details.value,
      'CharityId': this.CharityId.value,
      'projectPledge': this.projectPledge.value
    };

    this.myForm.setValue({
      'CharityName': null,
      'Details': null,
      'CharityId': null,
      'projectPledge': null
    });

    return this.serviceCharity.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'CharityName': null,
        'Details': null,
        'CharityId': null,
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
      $class: 'org.charity.net.Charity',
      'CharityName': this.CharityName.value,
      'Details': this.Details.value,
      'projectPledge': this.projectPledge.value
    };

    return this.serviceCharity.updateParticipant(form.get('CharityId').value, this.participant)
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

    return this.serviceCharity.deleteParticipant(this.currentId)
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

    return this.serviceCharity.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'CharityName': null,
        'Details': null,
        'CharityId': null,
        'projectPledge': null
      };

      if (result.CharityName) {
        formObject.CharityName = result.CharityName;
      } else {
        formObject.CharityName = null;
      }

      if (result.Details) {
        formObject.Details = result.Details;
      } else {
        formObject.Details = null;
      }

      if (result.CharityId) {
        formObject.CharityId = result.CharityId;
      } else {
        formObject.CharityId = null;
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
      'CharityName': null,
      'Details': null,
      'CharityId': null,
      'projectPledge': null
    });
  }
}
