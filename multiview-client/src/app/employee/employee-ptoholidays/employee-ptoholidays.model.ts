import { ILeaveDay, LeaveDay } from "src/app/models/employees/leave";


export class LeaveGroup {
  leaves: LeaveDay[];

  constructor(gp?: LeaveGroup) {
    this.leaves = [];
    if (gp) {
      gp.leaves.forEach(lv => {
        this.leaves.push(new LeaveDay(lv));
      });
      this.leaves.sort((a,b) => a.compareTo(b))
    }
  }

  getCode(): string {
    if (this.leaves.length > 0) {
      return this.leaves[0].code;
    }
    return "";
  }

  getLastDate(): number {
    if (this.leaves.length > 0) {
      return this.leaves[this.leaves.length - 1].leavedate.getDate();
    }
    return 0;
  }

  getFirstDate(): number {
    if (this.leaves.length > 0) {
      return this.leaves[0].leavedate.getDate();
    }
    return 0;
  }

  addLeave(lv: ILeaveDay) {
    this.leaves.push(new LeaveDay(lv));
  }

  compareTo(other?: LeaveGroup): number {
    if (other) {
      if (this.getFirstDate() !== 0 && other.getFirstDate() !== 0) {
        return (this.getFirstDate() < other.getFirstDate()) ? -1 : 1;
      } else if (this.getFirstDate() === 0) {
        return 1;
      } else {
        return -1;
      }
    }
    return -1;
  }
}

export class LeaveMonth {
  month: Date;
  active: Boolean;
  leaveGroups: LeaveGroup[];

  constructor(lm?: LeaveMonth) {
    this.month = (lm) ? new Date(lm.month) : new Date(0);
    this.active = (lm) ? lm.active : true;
    this.leaveGroups = [];
    if (lm && lm.leaveGroups.length > 0) {
      lm.leaveGroups.forEach(lg => {
        this.leaveGroups.push(lg);
      });
      this.leaveGroups.sort((a,b) => a.compareTo(b));
    }
  }

  compareTo(other?: LeaveMonth): number {
    if (other) {
      return (this.month.getTime() < other.month.getTime()) ? -1 : 1;
    }
    return -1;
  }
}