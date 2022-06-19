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
import { ProjectPledgeService } from './ProjectPledge.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-projectpledge',
  templateUrl: './ProjectPledge.component.html',
  styleUrls: ['./ProjectPledge.component.css'],
  providers: [ProjectPledgeService]
})
export class ProjectPledgeComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  pledgeId = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  needDonation = new FormControl('', Validators.required);
  fundsRequired = new FormControl('', Validators.required);
  fundsReceived = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  progress = new FormControl('', Validators.required);
  CharityId = new FormControl('', Validators.required);
  sendMoney = new FormControl('', Validators.required);

  constructor(public serviceProjectPledge: ProjectPledgeService, fb: FormBuilder) {
    this.myForm = fb.group({
      pledgeId: this.pledgeId,
      name: this.name,
      description: this.description,
      needDonation: this.needDonation,
      fundsRequired: this.fundsRequired,
      fundsReceived: this.fundsReceived,
      status: this.status,
      progress: this.progress,
      CharityId: this.CharityId,
      sendMoney: this.sendMoney
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceProjectPledge.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.charity.net.ProjectPledge',
      'pledgeId': this.pledgeId.value,
      'name': this.name.value,
      'description': this.description.value,
      'needDonation': this.needDonation.value,
      'fundsRequired': this.fundsRequired.value,
      'fundsReceived': this.fundsReceived.value,
      'status': this.status.value,
      'progress': this.progress.value,
      'CharityId': this.CharityId.value,
      'sendMoney': this.sendMoney.value
    };

    this.myForm.setValue({
      'pledgeId': null,
      'name': null,
      'description': null,
      'needDonation': null,
      'fundsRequired': null,
      'fundsReceived': null,
      'status': null,
      'progress': null,
      'CharityId': null,
      'sendMoney': null
    });

    return this.serviceProjectPledge.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'pledgeId': null,
        'name': null,
        'description': null,
        'needDonation': null,
        'fundsRequired': null,
        'fundsReceived': null,
        'status': null,
        'progress': null,
        'CharityId': null,
        'sendMoney': null
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


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.charity.net.ProjectPledge',
      'name': this.name.value,
      'description': this.description.value,
      'needDonation': this.needDonation.value,
      'fundsRequired': this.fundsRequired.value,
      'fundsReceived': this.fundsReceived.value,
      'status': this.status.value,
      'progress': this.progress.value,
      'CharityId': this.CharityId.value,
      'sendMoney': this.sendMoney.value
    };

    return this.serviceProjectPledge.updateAsset(form.get('pledgeId').value, this.asset)
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


  deleteAsset(): Promise<any> {

    return this.serviceProjectPledge.deleteAsset(this.currentId)
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

    return this.serviceProjectPledge.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'pledgeId': null,
        'name': null,
        'description': null,
        'needDonation': null,
        'fundsRequired': null,
        'fundsReceived': null,
        'status': null,
        'progress': null,
        'CharityId': null,
        'sendMoney': null
      };

      if (result.pledgeId) {
        formObject.pledgeId = result.pledgeId;
      } else {
        formObject.pledgeId = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
      }

      if (result.description) {
        formObject.description = result.description;
      } else {
        formObject.description = null;
      }

      if (result.needDonation) {
        formObject.needDonation = result.needDonation;
      } else {
        formObject.needDonation = null;
      }

      if (result.fundsRequired) {
        formObject.fundsRequired = result.fundsRequired;
      } else {
        formObject.fundsRequired = null;
      }

      if (result.fundsReceived) {
        formObject.fundsReceived = result.fundsReceived;
      } else {
        formObject.fundsReceived = null;
      }

      if (result.status) {
        formObject.status = result.status;
      } else {
        formObject.status = null;
      }

      if (result.progress) {
        formObject.progress = result.progress;
      } else {
        formObject.progress = null;
      }

      if (result.CharityId) {
        formObject.CharityId = result.CharityId;
      } else {
        formObject.CharityId = null;
      }

      if (result.sendMoney) {
        formObject.sendMoney = result.sendMoney;
      } else {
        formObject.sendMoney = null;
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
      'pledgeId': null,
      'name': null,
      'description': null,
      'needDonation': null,
      'fundsRequired': null,
      'fundsReceived': null,
      'status': null,
      'progress': null,
      'CharityId': null,
      'sendMoney': null
      });
  }

}
