import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BookService } from '../../core/services/book.service';
import { map, of, switchMap, timer } from 'rxjs';
import { catchError } from 'rxjs/operators'; 


// VALIDADOR AÑO
export function yearRangeValidator(minYear = 1): ValidatorFn { //año minimo 1
  return (control: AbstractControl): ValidationErrors | null => {
    const y = Number(control.value);
    if (!Number.isFinite(y)) return { yearInvalid: true };
    const max = new Date().getFullYear();
    if (y < minYear || y > max) return { yearOutOfRange: { min: minYear, max } };
    return null;
  };
}

// VALIDADOR ISBN
export function isbnValidator(bookSvc: BookService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const raw = (control.value ?? '').toString().trim();
    if (!raw) return of(null);

    // Si el ISBN todavía no tiene 10 o 13 dígitos (sin guiones), NO consultes al server
    const s = raw.replace(/[-\s]/g, '');
    if (!(s.length === 10 || s.length === 13)) return of(null);

    return timer(300).pipe(
      switchMap(() => bookSvc.getByIsbn(s)),
      map(list => (list.length ? { isbnTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}
