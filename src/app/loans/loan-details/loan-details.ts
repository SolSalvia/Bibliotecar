import { Component, inject, linkedSignal, signal, effect} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanClient } from '../loan-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoanForm } from '../loan-form/loan-form';
import { Loan } from '../loan';
import { BookClient } from '../../books/book-client';
import { UserClient } from '../../users/user-client';
import { BookReturnClient } from '../../bookReturns/bookReturn-client';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-loan-details',
  imports: [LoanForm, DatePipe],
  templateUrl: './loan-details.html',
  styleUrl: './loan-details.css'
})

export class LoanDetails {

  private readonly client = inject(LoanClient);
  private readonly bookClient = inject(BookClient);
  private readonly userClient = inject(UserClient);
  private readonly bookReturnClient = inject(BookReturnClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly id = this.route.snapshot.paramMap.get('id');

  protected readonly loanSource = toSignal(this.client.getLoanById(this.id!));
  protected readonly loan = linkedSignal(() => this.loanSource());
  protected readonly isEditing = signal(false);

  protected readonly userName = signal<string>('');
  protected readonly bookTitle = signal<string>('');  

  constructor() {

    effect(() => {
      const loan = this.loan();
      if (loan) {

        if (loan.userId) {
          this.userClient.getUserById(loan.userId).subscribe(user => {
            if (user) this.userName.set(`${user.username} (ID: ${user.id})`);
          });
        }


        if (loan.bookId) {
          this.bookClient.getBookById(loan.bookId).subscribe(book => {
            if (book) this.bookTitle.set(`${book.title} (ID: ${book.id})`);
          });
        }
      }
    });
  }  

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
  }

  handleEdit(loan: Loan) {
    this.loan.set(loan);
    this.toggleEdit();
  }

  /*deleteLoan() {
    if (confirm('Desea borrar el préstamo?')) {
      this.client.deleteLoan(this.id!).subscribe(() => {
        alert('Préstamo borrado con éxito');
        this.router.navigateByUrl('/prestamos');
      });
    }
  }*/

 
  deleteLoan() {
    const currentLoan = this.loan();
    if (!currentLoan) return;

    // PRIMERA VERIFICACIÓN buscamos devoluciones asociadas a este préstamo
    this.bookReturnClient.getBookReturns().subscribe(bookReturns => {
      const hasReturn = bookReturns.some(br => br.loanId === currentLoan.id);

      if (hasReturn) {
        alert('❌ No se puede eliminar un préstamo que tiene una devolución asociada.\n\nPrimero debe eliminar la devolución.');
        return; // Cortamos acá. No borramos nada.
      }

      //Si NO hay devolución, seguimos con el proceso normal
      if (confirm('⚠️ ¿Desea borrar el préstamo?')) {

        // 1) Liberar el libro
        this.bookClient.getBookById(currentLoan.bookId!).subscribe(book => {
          if (book) {
            this.bookClient.updateBook({ ...book, available: true }, book.id!).subscribe();
          }
        });

        // 2) Eliminar el préstamo
        this.client.deleteLoan(this.id!).subscribe(() => {
          alert('✅ ¡Préstamo borrado con éxito! ');
          this.router.navigateByUrl('/prestamos');
        });
      }

    });
  }    

  
}