import Book from '../entities/book';

declare global {
  interface BookList {
    books: Book[];
    total: number;
    count: number;
  }
}
