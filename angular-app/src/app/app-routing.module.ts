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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { SendMoneyComponent } from './SendMoney/SendMoney.component';
import { ProjectPledgeComponent } from './ProjectPledge/ProjectPledge.component';

import { DonerComponent } from './Doner/Doner.component';
import { CharityComponent } from './Charity/Charity.component';
import { GovernementComponent } from './Governement/Governement.component';

import { CreateProjectPledgeComponent } from './CreateProjectPledge/CreateProjectPledge.component';
import { SendPledgeToGovernementComponent } from './SendPledgeToGovernement/SendPledgeToGovernement.component';
import { ApprovePledgeFromGovernementComponent } from './ApprovePledgeFromGovernement/ApprovePledgeFromGovernement.component';
import { CreateSendMoneyComponent } from './CreateSendMoney/CreateSendMoney.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'SendMoney', component: SendMoneyComponent },
  { path: 'ProjectPledge', component: ProjectPledgeComponent },
  { path: 'Doner', component: DonerComponent },
  { path: 'Charity', component: CharityComponent },
  { path: 'Governement', component: GovernementComponent },
  { path: 'CreateProjectPledge', component: CreateProjectPledgeComponent },
  { path: 'SendPledgeToGovernement', component: SendPledgeToGovernementComponent },
  { path: 'ApprovePledgeFromGovernement', component: ApprovePledgeFromGovernementComponent },
  { path: 'CreateSendMoney', component: CreateSendMoneyComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
