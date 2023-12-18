import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appDuplicateValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: DuplicateValidator,
    multi: true
  }]
})
export class DuplicateValidator implements Validator {
  validate(control: AbstractControl) : {[key: string]: any} | null {
    const formGroup = control.parent;
    if (formGroup) {
      const id = formGroup.get('id')?.value;
      const sCodes = formGroup.get('comparearray')?.value;
      const codes = new String(sCodes).split(',');
      let found = false;
      codes.forEach(code => {
        if (code.toLowerCase() === new String(id).toLowerCase()) {
          found = true;
        }
      });
      return !found ? null : { duplicate: true };
    }
    return null;
  }

}