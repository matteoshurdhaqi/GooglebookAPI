"use strict";
function getBooks(booktitle) {
    const { from } = rxjs;
    const { map, switchMap, tap } = rxjs.operators;
    let apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';
    const p = fetch(apiurl + booktitle).then(res => res.json());
    // .then(books => console.log(books))
    from(p).pipe(switchMap((data) => from(data.items)), map((ele) => {
        const book = {
            title: ele.volumeInfo.title,
            categories: ele.volumeInfo.categories,
            authors: ele.volumeInfo.authors,
            description: ele.volumeInfo.description,
            thumbnail: ele.volumeInfo.imageLinks.thumbnail
        };
        return book;
    }))
        .subscribe((book) => displayBook(book));
    //console.log(data.items));
}
function displayBook(book) {
    const bookTpl = `
    <div class="card" style="width: 18rem;">
    <img src="${book.thumbnail}" alt="${book.title}">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">${book.title}</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
    </div>
`;
    const div = document.createElement('div');
    div.setAttribute('class', 'col-md-3 py-3');
    div.innerHTML = bookTpl;
    document.querySelector('#books').appendChild(div);
}
getBooks('Manzoni');
