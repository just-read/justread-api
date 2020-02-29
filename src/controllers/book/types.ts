import Book from '../../entities/book';

export interface IBookList {
  books: Book[];
  total: number;
  count: number;
}
