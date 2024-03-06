import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMissionDialogComponent } from '../delete-mission-dialog/delete-mission-dialog.component';
import { DialogService } from 'src/app/services/dialog-service.service';
import { NewMissionDialogComponent } from '../new-mission-dialog/new-mission-dialog.component';
import { ChangeSortieIdDialogComponent } from '../change-sortie-id-dialog/change-sortie-id-dialog.component';
import { IMission, Mission } from 'src/app/models/interfaces/mission';
import { AuthService } from 'src/app/services/auth.service';
import { MissionService } from 'src/app/services/mission.service';
import { Communication, Dcgs, IExploitation, IPlatform } from 'src/app/models/systems';
import { UpdateMission } from 'src/app/models/web/missions';
import { IMissionSensor } from 'src/app/models/interfaces/missionSensor';

@Component({
  selector: 'app-missions-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class MissionsHomeComponent {
  missionForm: FormGroup;
  showPME3: boolean = false;
  showPME4: boolean = false;
  showIMINT: boolean = false;
  missionSensors: IMissionSensor[] = [];
  mission?: IMission;
  missionid: string = "";
  exploit: string = "Primary";
  platform: string = "";
  showMission: boolean = false;
  editColor: string = "accent";
  editTooltip: string = "Permit Editing of Key Fields";
  sortieList: string[] = [];
  communicationList: string[] = [];
  dcgsList: string[] = [];

  constructor(
    public authService: AuthService, 
    public missionService: MissionService,
    protected dialogService: DialogService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    const expired = this.authService.getExpiredDate();
    if (expired.getTime() < (new Date()).getTime()) {
      this.authService.logout();
    }
    let msndate: Date | string = '';
    let platform = '';
    let sortie: string | number = '';
    if (this.missionService.selectedMission) {
      msndate = new Date(this.missionService.selectedMission.missionDate);
      platform = this.missionService.selectedMission.platformID;
      sortie = this.missionService.selectedMission.sortieID;
    }
    this.missionForm = this.formBuilder.group({
      msndate: [msndate, [Validators.required]],
      platform: [platform, [Validators.required ]],
      sortie: [sortie, [Validators.required, Validators.pattern("^[0-9]+$")]],
      exploitation: ['', [Validators.required]],
      tailnumber: '',
      communications: ['', [Validators.required]],
      dcgs: '',
      overlap: ['0:00', [Validators.pattern("^[0-9]{0,2}:[0-9]{2}$")]],
      comments: '',
      isExecuted: 'none',
      imintsensor: '',
    });
    this.sortieList.push("new");
    this.setMission();
  }

  getPlatforms(): IPlatform[] {
    if (this.missionService.systemInfo && this.missionService.systemInfo.platforms) {
      return this.missionService.systemInfo.platforms;
    }
    return [];
  }

  clearMission() {
    this.missionService.selectedMission = undefined;
    this.missionForm.reset();
    this.showIMINT = false;
    this.showPME3 = false;
    this.showPME4 = false;
    this.setMission();
  }

  getSorties() {
    const msnDate = this.missionForm.value.msndate;
    const platform = this.missionForm.value.platform;
    this.sortieList = [];
    this.sortieList.push("new");

    if (msnDate.getTime() > 0 && platform !== '' ) {
      this.dialogService.showSpinner();
      this.missionService.getMissions(platform, msnDate)
        .subscribe({
          next: resp => {
            this.dialogService.closeSpinner();
            if (resp.headers.get('token') !== null) {
              this.authService.setToken(resp.headers.get('token') as string);
            }
            this.missionForm.controls["sortie"].setValue('');
            const data = resp.body;
            if (data !== null && data.missions && data.missions.length > 0) {
              data.missions.forEach((msn: IMission) => {
                this.sortieList.push(`${msn.sortieID}`);
              });
            }
            this.missionService.selectedMission = new Mission();
            this.setMission();
          },
          error: err => {
            this.dialogService.closeSpinner();
            console.log(err);
          }
        });
    }
  }

  getSortie(field: string) {
    const msnDate = this.missionForm.value.msndate;
    const platform = this.missionForm.value.platform;
    let sortieID = this.missionForm.value.sortie;
    const regexp = new RegExp('^[0-9]*$')
    if (field.toLowerCase() === 'msndate' || field.toLowerCase() === 'platform') {
      this.getSorties();
    } else if (msnDate.getTime() !== 0 && platform !== '' && sortieID === 'new') {
      // show the new sortie dialog to get the new sortie id then create the
      // new sortie
      const dialogRef = this.dialog.open(NewMissionDialogComponent, {
        data: { sortieID: '' },
      });
      dialogRef.afterClosed().subscribe(result => {
        sortieID = result;
        if (sortieID && sortieID !== '' && sortieID !== '0') {
          this.dialogService.showSpinner();
          this.missionService.createMission(platform, msnDate, Number(sortieID))
            .subscribe({
              next: (resp) => {
                this.dialogService.closeSpinner();
                if (resp.headers.get('token') !== null) {
                  this.authService.setToken(resp.headers.get('token') as string);
                }
                const data = resp.body;
                if (data && data !== null) {
                  if ((!data.id || data.id === '') && data._id) {
                    data.id = data._id;
                  }
                  this.sortieList.push(`${data.sortieID}`);
                  this.missionService.selectedMission = data;
                  this.mission = data;
                  this.missionService.missions.push(data)
                } else {
                  this.missionService.selectedMission = undefined;
                  this.mission = undefined;
                }
                this.setMission();
              },
              error: (err) => {
                this.dialogService.closeSpinner();
                console.log(err);
              },
          });
        }
      });
    } else {
      if (msnDate.getTime() > 0 && platform !== '' && sortieID !== '' 
        && regexp.test(sortieID)) {
        let mDate = new Date(Date.UTC(msnDate.getFullYear(), msnDate.getMonth(), 
          msnDate.getDate()));
        let found = false;
        if (this.missionService.missions.length > 0) {
          this.missionService.missions.forEach(m => {
            const msn = new Mission(m);
            if (msn.missionDate.getTime() === mDate.getTime()
              && msn.platformID.toLowerCase() === platform.toLowerCase()
              && msn.sortieID === Number(sortieID)) {
                this.missionService.selectedMission = msn;
                this.setMission();
                found = true;
              }
          })
        }
        if (!found) {
          this.missionService.selectedMission = undefined;
          this.dialogService.showSpinner();
          this.missionService.getMission(platform, msnDate, Number(sortieID))
            .subscribe({
              next: resp => {
                this.dialogService.closeSpinner();
              if (resp.headers.get('token') !== null) {
                this.authService.setToken(resp.headers.get('token') as string);
              }
              const data = resp.body;
              if (data && data !== null) {
                this.missionService.selectedMission = data;
                this.mission = data;
              } else {
                this.missionService.selectedMission = undefined;
                this.mission = undefined;
              }
              this.setMission();
            },
            error: err => {
              this.dialogService.closeSpinner();
              console.log(err);
            }
          });
        }
      }
    }
  }

  changeSortieID(): void {
    let sortie = '0';
    if (this.missionService.selectedMission) {
      let update: UpdateMission = {
        id: this.missionService.selectedMission.id as string,
        field: 'sortie',
        value: ''
      };
      const msn = this.missionService.selectedMission;
      if (msn) {
        sortie = `${msn.sortieID}`;
      }
      const dialogRef = this.dialog.open(ChangeSortieIdDialogComponent, {
        data: { sortieID: sortie },
      });

      const oldSorties: string[] = []
      this.sortieList.forEach(id => {
        if (id !== 'new' && id !== sortie) {
          oldSorties.push(id);
        }
      })

      dialogRef.afterClosed().subscribe(result => {
        const sortieID = result;
        if (sortieID && sortieID !== '' && sortieID !== '0') {
          update.value = sortieID;
          this.dialogService.showSpinner();
          this.missionService.updateMission(update)
            .subscribe({
              next: (resp) => {
                this.dialogService.closeSpinner();
                if (resp.headers.get('token') !== null) {
                  this.authService.setToken(resp.headers.get('token') as string);
                }
                const data = resp.body;
                if (data && data !== null) {
                  if ((!data.id || data.id === '') && data._id) {
                    data.id = data._id;
                  }
                  oldSorties.push(`${data.sortieID}`);
                  oldSorties.sort((a,b) => (a < b) ? -1 : 1);
                  this.sortieList = [];
                  this.sortieList.push('new');
                  oldSorties.forEach(id => {
                    this.sortieList.push(id);
                  });
                  this.missionService.selectedMission = data;
                  this.mission = data;
                  this.missionService.missions.push(data)
                } else {
                  this.missionService.selectedMission = undefined;
                  this.mission = undefined;
                }
                this.setMission();
              },
              error: (err) => {
                this.dialogService.closeSpinner();
                console.log(err);
              },
          });
        }
      });
    }
  }

  showSensor(sensorID: string): boolean {
    let answer = false;
    const platform = this.missionForm.value.platform;
    const exploit = this.missionForm.value.exploitation;

    if (this.missionService.systemInfo && this.missionService.systemInfo.platforms) {
      this.missionService.systemInfo.platforms.forEach(plat => {
        if (plat.id === platform) {
          plat.sensors.forEach(sen => {
            if (sen.id === sensorID) {
              sen.exploitations.forEach(exp => {
                if (exp.exploitation.toLowerCase().indexOf(
                  exploit.toLowerCase()) >= 0) {
                  answer = true;
                }
              })
            }
          });
        }
      });
    }
    return answer;
  }

  showMissionSensor(): string {
    let answer = '';
    let exploit = this.missionForm.value.exploitation.toLowerCase();
    if (this.missionService.selectedMission 
      && this.missionService.selectedMission.missionData) {
      this.missionService.selectedMission.missionData.sensors.forEach(sen => {
        this.missionService.systemInfo?.platforms.forEach(plat => {
          plat.sensors.forEach(pSen => {
            if (pSen.id === sen.sensorID) {
              pSen.exploitations.forEach(exp => {
                if (exp.exploitation.toLowerCase().indexOf(exploit) >= 0
                  && exp.showOnGEOINT) {
                    answer = sen.sensorID
                  }
              });
            }
          })
        });
      });
    }
    return answer;
  }

  convertOverlapToString(minutes: number): string {
    let hours = Math.floor(minutes/60);
    let remaining = minutes - (hours * 60);
    if (remaining < 10) {
      return `${hours}:0${remaining}`;
    } else {
      return `${hours}:${remaining}`;
    }
  }

  convertOverlapStringToMinutes(overlap: string): number {
    let times = overlap.split(":");
    const minutes = (Number(times[0]) * 60) + Number(times[1]);
    return minutes;
  }

  setMission() {
    const data = this.missionService.selectedMission;
    if (data) {
      if (data.missionData) {
        this.missionForm.controls["sortie"].setValue(`${data.sortieID}`);
        this.missionForm.controls["exploitation"].setValue(data.missionData.exploitation);
        this.missionForm.controls["exploitation"].enable();
        this.setCommunications();
        this.setDCGSs();
        this.missionForm.controls["tailnumber"].setValue(data.missionData.tailNumber);
        this.missionForm.controls["tailnumber"].enable();
        this.missionForm.controls["communications"].setValue(data.missionData.communications);
        this.missionForm.controls["communications"].enable();
        this.missionForm.controls["dcgs"].setValue(data.missionData.primaryDCGS);
        this.missionForm.controls["dcgs"].enable();
        this.missionForm.controls["overlap"].setValue(
          this.convertOverlapToString(data.missionData.missionOverlap));
          this.missionForm.controls["overlap"].enable();
        this.missionForm.controls["comments"].setValue(data.missionData.comments);
        this.missionForm.controls["comments"].enable();
        this.missionForm.controls['isExecuted'].setValue('none');
        if (data.missionData.executed) {
          this.missionForm.controls['isExecuted'].setValue('executed');
        } else if (data.missionData.cancelled) {
          this.missionForm.controls['isExecuted'].setValue('cancelled');
        } else if (data.missionData.aborted) {
          this.missionForm.controls['isExecuted'].setValue('aborted');
        } else if (data.missionData.indefDelay) {
          this.missionForm.controls['isExecuted'].setValue('indefdelay');
        }
        this.missionForm.controls["isExecuted"].enable();
        this.missionForm.controls["imintsensor"].setValue(this.showMissionSensor());
        this.showIMINT = this.showSensor("IMINT");
        this.showPME3 = this.showSensor("PME3");
        this.showPME4 = this.showSensor("PME4");
        this.missionForm.controls["imintsensor"].enable();
        this.missionSensors = data.missionData.sensors;
        this.mission = data;
        this.missionid = (data.id) ? data.id : "";
        this.exploit = this.missionForm.value.exploitation;
        this.platform = this.missionForm.value.platform;
        this.showMission = true;
      }
    } else {
      this.missionForm.controls["sortie"].setValue('');
      this.missionForm.controls["exploitation"].setValue('');
      this.missionForm.controls["exploitation"].disable();
      this.setCommunications();
      this.setDCGSs();
      this.missionForm.controls["tailnumber"].setValue('');
      this.missionForm.controls["tailnumber"].disable();
      this.missionForm.controls["communications"].setValue('');
      this.missionForm.controls["communications"].disable();
      this.missionForm.controls["dcgs"].setValue('');
      this.missionForm.controls["dcgs"].disable();
      this.missionForm.controls["overlap"].setValue('0:00');
      this.missionForm.controls["overlap"].disable();
      this.missionForm.controls["comments"].setValue('');
      this.missionForm.controls["comments"].disable();
      this.missionForm.controls['isExecuted'].setValue('none');
      this.missionForm.controls["isExecuted"].disable();
      this.missionForm.controls["imintsensor"].setValue('');
      this.missionForm.controls["imintsensor"].disable();
      this.showIMINT = false;
      this.showPME3 = false;
      this.showPME4 = false;
      this.missionSensors = [];
      this.mission = undefined;
      this.missionid = '';
      this.exploit = "";
      this.platform = "";
      this.showMission = false;
    }

  }

  getMissionID(): string {
    return (this.mission) ? this.mission.id as string : '';
  }

  getExploitations(): IExploitation[] {
    if (this.missionService.systemInfo && this.missionService.systemInfo.exploitations) {
      return this.missionService.systemInfo.exploitations;
    }
    return [];
  }

  updateMission(field: string) {
    if (this.missionService.selectedMission) {
      let update: UpdateMission = {
        id: this.missionService.selectedMission.id as string,
        field: field,
        value: ''
      };
      switch (field.toLowerCase()) {
        case "exploitation":
          update.value = this.missionForm.value.exploitation;
          this.setCommunications();
          this.setDCGSs();
          break;
        case "tailnumber":
          update.value = this.missionForm.value.tailnumber;
          break;
        case "communications":
          update.value = this.missionForm.value.communications;
          break;
        case "dcgs":
          update.value = this.missionForm.value.dcgs;
          break;
        case "overlap":
          update.value = String(this.convertOverlapStringToMinutes(
            this.missionForm.value.overlap));
          break;
        case "comments":
          update.value = this.missionForm.value.comments;
          break;
        case "isexecuted":
          update.value = this.missionForm.value.isExecuted;
          break;
        case "imintsensor":
          update.value = this.missionForm.value.imintsensor;
          break;
      }
      this.dialogService.showSpinner();
      this.missionService.updateMission(update)
        .subscribe({
          next: (resp) => {
            this.dialogService.closeSpinner();
            if (resp.headers.get('token') !== null) {
              this.authService.setToken(resp.headers.get('token') as string);
            }
            const data = resp.body;
            if (data && data !== null) {
              this.missionService.selectedMission = data;
              let found = false;
              for (let i=0; i < this.missionService.missions.length && !found; i++) {
                if (this.missionService.missions[i].id === data.id) {
                  this.missionService.missions[i] = data;
                  found = true;
                }
              }
              if (!found) {
                this.missionService.missions.push(data);
              }
            } else {
              this.missionService.selectedMission = undefined;
            }
            this.setMission();
          },
          error: (err) => {
            this.dialogService.closeSpinner();
            console.log(err);
          },
      });
    }
  }

  setMissionExploitation() {
  }

  showTailNumber(): boolean {
    let answer = false;
    if (this.missionService.selectedMission && this.missionService.systemInfo 
      && this.missionService.systemInfo.platforms) {
      this.missionService.systemInfo.platforms.forEach(plat => {
        if (plat.id === this.missionService.selectedMission?.platformID) {
          plat.sensors.forEach(sen => {
            if (sen.showTailNumber) {
              answer = true;
            }
          })
        }
      })
    }
    return answer
  }

  setCommunications() {
    this.communicationList = [];
    const exp = this.missionForm.value.exploitation;
    if (this.missionService.systemInfo 
      && this.missionService.systemInfo.communications) {
      this.missionService.systemInfo.communications.forEach(iComm => {
        const comm = new Communication(iComm);
        if (comm.hasExploitation(exp)) {
          this.communicationList.push(comm.id);
        }
      });
    }
  }

  setDCGSs() {
    this.dcgsList = [];
    const exp = this.missionForm.value.exploitation;
    if (this.missionService.systemInfo && this.missionService.systemInfo.dCGSs) {
      this.missionService.systemInfo.dCGSs.forEach(iDcgs => {
        const dcgs = new Dcgs(iDcgs);
        if (dcgs.hasExploitation(exp)) {
          this.dcgsList.push(dcgs.id);
        }
      });
    }
  }

  getSensors(): IMissionSensor[] {
    if (this.missionService.selectedMission 
      && this.missionService.selectedMission.missionData) {
        return this.missionService.selectedMission.missionData.sensors;
      }
    return [];
  }

  showDeleteButton(): boolean {
    if (this.missionService.selectedMission) {
      return true;
    }
    return false;
  }

  verifyDeletion(): void {
    const dialogRef = this.dialog.open(DeleteMissionDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.toLowerCase() === 'yes') {
        this.dialogService.showSpinner();
        this.missionService.deleteMission()
          .subscribe({
            next: (resp) => {
              this.dialogService.closeSpinner();
              if (resp.headers.get('token') !== null) {
                this.authService.setToken(resp.headers.get('token') as string);
              }
              this.missionService.selectedMission = undefined;
              this.clearMission();
            },
            error: (err) => {
              this.dialogService.closeSpinner();
              console.log(err);
            }
          })
      }
    });
  }
}
