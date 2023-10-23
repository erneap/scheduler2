import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactType } from 'src/app/models/teams/contacttype';

@Component({
  selector: 'app-team-contact-item',
  templateUrl: './team-contact-item.component.html',
  styleUrls: ['./team-contact-item.component.scss']
})
export class TeamContactItemComponent {
  private _contactType: ContactType = new ContactType();
 @Input() showMoveDown: boolean = false;
 @Input() showMoveUp: boolean = false;
 @Input() 
 public set contactType(cType: ContactType) {
  this._contactType = new ContactType(cType);
  this.setContactType();
 }
 get contactType(): ContactType {
  return this._contactType;
 }
 @Output() updated = new EventEmitter<string>();
 contactForm: FormGroup

 constructor(
  private fb: FormBuilder
 ) {
  this.contactForm = this.fb.group({
    name: ['', [Validators.required]],
  });
 }

 setContactType() {
  this.contactForm.controls['name'].setValue(this.contactType.name);
 }

 updateType() {
  const update = `${this.contactType.id}|${this.contactForm.value.name}`;
  this.updated.emit(update);
 }

 updateSort(direction: string) {
  const update = `${this.contactType.id}|sort|${direction}`;
  this.updated.emit(update);
 }

 deleteType() {
  const update = `${this.contactType.id}|delete|`;
  this.updated.emit(update);
 }
}
