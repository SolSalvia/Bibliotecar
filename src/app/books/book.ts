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