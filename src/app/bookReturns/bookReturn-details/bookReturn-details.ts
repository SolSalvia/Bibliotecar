import { Component, inject, linkedSignal, signal, effect} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BookReturnClient } from '../bookReturn-client';
import { BookReturnForm } from '../bookReturn-form/bookReturn-form';
import { BookReturn } from '../bookReturn';
import { LoanClient } from '../../loans/loan-client';
import { UserClient } from '../../users/user-client';


@Component({
  selector: 'app-bookReturn-details',
  imports: [BookReturnForm],
  templateUrl: './bookReturn-details.html',
  styleUrl: './bookReturn-details.css'
})

export class BookReturnDetails {

  private readonly client = inject(BookReturnClient);
  private readonly loanClient = inject(LoanClient);
  protected readonly bookReturnClient = inject(BookReturnClient);
  private readonly userClient = inject(UserClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly id = this.route.snapshot.paramMap.get('id');

  protected readonly bookReturnSource = toSignal(this.client.getBookReturnById(this.id!));
  protected readonly bookReturn = linkedSignal(() => this.bookReturnSource());
  protected readonly isEditing = signal(false);

  protected readonly userName = signal<string>('');
  protected readonly loanTitle = signal<string>('');  

  constructor() {

    effect(() => {
      const bookReturn = this.bookReturn();
      if (bookReturn) {

        if (bookReturn.loanId) {
          this.loanClient.getLoanById(bookReturn.loanId).subscribe(loan => {
            if (loan) this.loanTitle.set(`${loan.id}`);
          });
        }
      }
    });
  }  

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
  }

  handleEdit(bookReturn: BookReturn) {
    this.bookReturn.set(bookReturn);
    this.toggleEdit();
  }

  /*deleteBookReturn() {
    if (confirm('Desea borrar el préstamo?')) {
      this.client.deleteBookReturn(this.id!).subscribe(() => {
        alert('Préstamo borrado con éxito');
        this.router.navigateByUrl('/prestamos');
      });
    }
  }*/

 deleteBookReturn() {
    const currentBookReturn = this.bookReturn();
    if (!currentBookReturn) return;

    if (confirm('¿Desea borrar la devolución?')) {


      //el préstamo vuelve a "Pendiente de Devolución"
      this.loanClient.getLoanById(currentBookReturn.loanId!).subscribe(loan => {
        if (loan) {
          this.loanClient.updateLoan({ ...loan, isActive: true }, loan.id!).subscribe({
            next: () => console.log(`Préstamo con ID:"${loan.id}" vuelve a estar pendiente de devolución.`),
            error: (err) => console.error('Error al liberar préstamo', err)
          });
        }
      });


      this.client.deleteBookReturn(this.id!).subscribe({
        next: () => {
          alert('¡Devolución borrada con éxito!');
          this.router.navigateByUrl('/devoluciones');
        },
        error: (err) => {
          console.error('Error al borrar devolución:', err);
          alert('No se pudo borrar el devolución');
        }
      });
    }
 }
  
}