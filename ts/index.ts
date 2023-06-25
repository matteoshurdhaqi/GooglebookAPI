function getBooks(booktitle: string) {
    let apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';

    const p = fetch(apiurl + booktitle).then(res => res.json())
    .then(books => console.log(books))   
}
getBooks('java');

