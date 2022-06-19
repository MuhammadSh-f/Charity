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
import { SendMoneyService } from './SendMoney.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-sendmoney',
  templateUrl: './SendMoney.component.html',
  styleUrls: ['./SendMoney.component.css'],
  providers: [SendMoneyService]
})
export class SendMoneyComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  MId = new FormControl('', Validators.required);
  Amount = new FormControl('', Validators.required);
  donerId = new FormControl('', Validators.required);
  pledgeId = new FormControl('', Validators.required);

  constructor(public serviceSendMoney: SendMoneyService, fb: FormBuilder) {
    this.myForm = fb.group({
      MId: this.MId,
      Amount: this.Amount,
      donerId: this.donerId,
      pledgeId: this.pledgeId
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceSendMoney.getAll()
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
      $class: 'org.charity.net.SendMoney',
      'MId': this.MId.value,
      'Amount': this.Amount.value,
      'donerId': this.donerId.value,
      'pledgeId': this.pledgeId.value
    };

    this.myForm.setValue({
      'MId': null,
      'Amount': null,
      'donerId': null,
      'pledgeId': null
    });

    return this.serviceSendMoney.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'MId': null,
        'Amount': null,
        'donerId': null,
        'pledgeId': null
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
      $class: 'org.charity.net.SendMoney',
      'Amount': this.Amount.value,
      'donerId': this.donerId.value,
      'pledgeId': this.pledgeId.value
    };

    return this.serviceSendMoney.updateAsset(form.get('MId').value, this.asset)
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

    return this.serviceSendMoney.deleteAsset(this.currentId)
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

    return this.serviceSendMoney.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'MId': null,
        'Amount': null,
        'donerId': null,
        'pledgeId': null
      };

      if (result.MId) {
        formObject.MId = result.MId;
      } else {
        formObject.MId = null;
      }

      if (result.Amount) {
        formObject.Amount = result.Amount;
      } else {
        formObject.Amount = null;
      }

      if (result.donerId) {
        formObject.donerId = result.donerId;
      } else {
        formObject.donerId = null;
      }

      if (result.pledgeId) {
        formObject.pledgeId = result.pledgeId;
      } else {
        formObject.pledgeId = null;
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
      'MId': null,
      'Amount': null,
      'donerId': null,
      'pledgeId': null
      });
  }

}
