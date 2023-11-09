import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ILeaveDay, LeaveDay } from 'src/app/models/employees/leave';
import { Workcode } from 'src/app/models/teams/workcode';

@Component({
  selector: 'app-employee-leave-request-day',
  templateUrl: './employee-leave-request-day.component.html',
  styleUrls: ['./employee-leave-request-day.component.scss']
})
export class EmployeeLeaveRequestDayComponent {
  private _leave: LeaveDay | undefined;
  private _show: boolean = true;
  private _codes: Workcode[] = [];
  @Input()
  public set leave(lv: ILeaveDay) {
    this._leave = new LeaveDay(lv);
    this.setLeave()
  }
  get leave(): LeaveDay {
    if (this._leave) {
      return this._leave;
    }
    return new LeaveDay();
  }
  @Input()
  public set leaveCodes(cds: Workcode[]) {
    this._codes = cds;
    this.setLeave();
  }
  get leaveCodes(): Workcode[] {
    return this._codes;
  }
  @Input() 
  public set showdate(show: boolean){
    this._show = show;
    this.setLeave()
  }
  get showdate(): boolean {
    return this._show;
  }
  @Output() changed = new EventEmitter<string>();

  dayForm: FormGroup;
  dayStyle: string = 'background-color: black; color: black;';
  fontStyle: string = 'background-color: white !important;'
    + 'color: #000000 !important;';

  constructor(
    private fb: FormBuilder,
  ) {
    this.dayForm = this.fb.group({
      code: '',
      hours: 0,
    });
  }

  setLeave() {
    if (this._leave && this._codes.length > 0) {
      this.dayForm.controls["code"].setValue(this.leave.code);
      if (this.leave.code !== '') {
        this.dayForm.controls["hours"].setValue(this.leave.hours);
      } else {
        this.dayForm.controls["hours"].setValue('');
      }
      if (this.showdate) {
        if (this.leave.code !== '') {
          this.leaveCodes.forEach(wc => {
            if (wc.id.toLowerCase() == this.leave.code.toLowerCase()) {
              this.dayStyle = `background-color: #${wc.backcolor};color: #${wc.textcolor};`;
              this.fontStyle = `color: #${wc.textcolor} !important;`;
            }
          });
        } else {
          this.dayStyle = 'background-color: white;color: black;';
          this.fontStyle = `color: #FFFFFF !important;`;
        }
      } else {
        this.dayStyle = `background-color: black;color: black;`;
        this.fontStyle = `color: #000000 !important;`;
      }
    }
  }

  changeCode() {
    this.leave.code = this.dayForm.value.code;
    this.leave.hours = Number(this.dayForm.value.hours);
    let data: string = `${this.leave.leavedate.getFullYear()}-`
      + ((this.leave.leavedate.getMonth() < 9) ? '0' : '') 
      + `${this.leave.leavedate.getMonth() + 1}-`
      + ((this.leave.leavedate.getDate() < 10) ? '0' : '') 
      + `${this.leave.leavedate.getDate()}`
      + `|${this.leave.code}|${this.leave.hours}`;
    this.changed.emit(data);
    this.setLeave();
  }
}
