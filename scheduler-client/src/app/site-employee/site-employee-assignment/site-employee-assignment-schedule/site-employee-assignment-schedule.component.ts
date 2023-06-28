import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { ISchedule, Schedule } from 'src/app/models/employees/assignments';
import { ISite, Site } from 'src/app/models/sites/site';
import { ChangeAssignmentRequest } from 'src/app/models/web/employeeWeb';
import { WorkWeek } from 'src/app/models/web/internalWeb';

@Component({
  selector: 'app-site-employee-assignment-schedule',
  templateUrl: './site-employee-assignment-schedule.component.html',
  styleUrls: ['./site-employee-assignment-schedule.component.scss']
})
export class SiteEmployeeAssignmentScheduleComponent {
  private _schedule: Schedule = new Schedule();
  @Input()
  public set schedule(sch: ISchedule) {
    this._schedule = new Schedule(sch);
    this.setSchedule();
  }
  get schedule(): Schedule {
    return this._schedule;
  }
  private _site: Site = new Site();
  @Input()
  public set site(iSite: ISite) {
    this._site = new Site(iSite);
  }
  get site(): Site {
    return this._site;
  }
  @Output() change = new EventEmitter<string>();

  days: string[] = [];
  scheduleForm: FormGroup;
  workweeks: WorkWeek[] = [];
  label: string = 'SCHEDULE 0';
  deletable: boolean;
  
  constructor(
    private fb: FormBuilder,
    protected dialog: MatDialog
  ) {
    this.days = []
    for (let i = 7; i < 30; i += 7) {
      this.days.push(`${i}`);
    }
    this.scheduleForm = this.fb.group({
      days: '7',
    });
    this.deletable = true;
  }

  setSchedule() {
    this.label = `SCHEDULE ${this.schedule.id}`;
    this.deletable = (this.schedule.id > 0);
    this.scheduleForm.controls['days'].setValue(`${this.schedule.workdays.length}`)
    this.workweeks = [];
    this.schedule.workdays.sort((a,b) => a.compareTo(b));
    var workweek: WorkWeek | undefined;
    let count = -1;
    for (let i=0; i < this.schedule.workdays.length; i++) {
      if (!workweek || (i % 7) === 0) {
        count++;
        workweek = new WorkWeek(count);
        this.workweeks.push(workweek);
      }
      let date = new Date(2023, 0, i + 1);
      workweek.setWorkday(this.schedule.workdays[i], date);
    }
    this.workweeks.sort((a,b) => a.compareTo(b));
  }

  updateDate(data: string) {
    data = `workday|${this.schedule.id}|${data}`;
    this.change.emit(data);
  }

  removeSchedule() {
    const data = `schedule|${this.schedule.id}|0|removeschedule|`;
    this.change.emit(data);
  }

  changeDays() {
    const data = `schedule|${this.schedule.id}|0|changeschedule|`
      + `${this.scheduleForm.value.days}`;
    this.change.emit(data)
  }

  deleteSchedule() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Schedule Deletion', 
      message: 'Are you sure you want to delete this schedule?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'yes') {
        this.removeSchedule();
      }
    })
  }
}
