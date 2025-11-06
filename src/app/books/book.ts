export interface Book {
    id?: string, //Opcional porque lo completa json server
    ISBN: string,
    title: string,
    author: string,
    category: string,
    publicationYear: string,
    synopsis: string,
    available: boolean
}

/*
readonly categories: string[] = [
  'Novela',
  'Ciencia Ficción',
  'Fantasía',
  'Informática',
  'Historia',
  'Biografía',
  'Infantil',
  'Educativo',
  'Autoayuda',
  'Tecnología'
];*/