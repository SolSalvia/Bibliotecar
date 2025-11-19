import { Component, inject, linkedSignal, signal, effect} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanClient } from '../loan-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoanForm } from '../loan-form/loan-form';
import { Loan } from '../loan';
import { BookClient } from '../../books/book-client';
import { UserClient } from '../../users/user-client';


@Component({
  selector: 'app-loan-details',
  imports: [LoanForm],
  templateUrl: './loan-details.html',
  styleUrl: './loan-details.css'
})

export class LoanDetails {

  private readonly client = inject(LoanClient);
  private readonly bookClient = inject(BookClient);
  private readonly userClient = inject(UserClient);
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

    if (confirm('Desea borrar el préstamo?')) {
      
      //primero liberamos el libro
      this.bookClient.getBookById(currentLoan.bookId!).subscribe(book => {
        if (book) {
          this.bookClient.updateBook({ ...book, available: true }, book.id!).subscribe({
            next: () => console.log(`Libro "${book.title}" vuelve a estar disponible`),
            error: (err) => console.error('Error al liberar libro', err)
          });
        }
      });

      // Luego se elimina el préstamo
      this.client.deleteLoan(this.id!).subscribe({
        next: () => {
          alert('Préstamo borrado con éxito');
          this.router.navigateByUrl('/prestamos');
        },
        error: (err) => {
          console.error('Error al borrar préstamo', err);
          alert('No se pudo borrar el préstamo');
        }
      });
    }
  }    

  
}