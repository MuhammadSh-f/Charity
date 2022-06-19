import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.charity.net{
   export enum ProjectStatus {
      INITIALSTATE,
      GOVERNMENTREVIEW,
      READYFORDONATION,
   }
   export enum Progress {
      UNCOMPLETED,
      COMPLETED,
   }
   export class SendMoney extends Asset {
      MId: string;
      Amount: number;
      donerId: Doner;
      pledgeId: ProjectPledge;
   }
   export class ProjectPledge extends Asset {
      pledgeId: string;
      name: string;
      description: string;
      needDonation: boolean;
      fundsRequired: number;
      fundsReceived: number;
      status: ProjectStatus;
      progress: Progress;
      CharityId: Charity;
      sendMoney: SendMoney[];
   }
   export abstract class User extends Participant {
      projectPledge: ProjectPledge[];
   }
   export class Doner extends User {
      Fname: string;
      Lname: string;
      donerId: string;
      PhoneNo: string;
      password: string;
      creditCardNo: string;
      sendMoney: SendMoney[];
   }
   export class Charity extends User {
      CharityName: string;
      Details: string;
      CharityId: string;
   }
   export class Governement extends Participant {
      goverID: string;
      projectPledge: ProjectPledge[];
   }
   export class CreateProjectPledge extends Transaction {
      pledgeId: string;
      name: string;
      description: string;
      fundsRequired: number;
      CharityId: Charity;
   }
   export class SendPledgeToGovernement extends Transaction {
      goverID: Governement;
      pledgeId: ProjectPledge;
   }
   export class ApprovePledgeFromGovernement extends Transaction {
      goverID: Governement;
      pledgeId: ProjectPledge;
   }
   export class CreateSendMoney extends Transaction {
      MId: string;
      Amount: number;
      donerId: Doner;
      pledgeId: ProjectPledge;
   }
// }
