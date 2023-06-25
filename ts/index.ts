

declare const rxjs: any;

interface GoogleBook{
    totalItems: number
    kind: string
    items: []
}



interface BookThumbnails{
    smallThumbnail: string
    thumbnail: string
}
interface VolumeInfo{
    thumbnails: string;
    authors: []
    description: string
    imageLinks: BookThumbnails
    infoLink: string
    language: string
    previewLink: string
    title: string
     categories: []
}
interface Book{
    title: string 
    description: string
    authors: []
    categories:[]
    thumbnail : string
}
interface BookItem{
    volumeInfo: VolumeInfo
    id: string
}


function getBooks(booktitle: string) {
    const {from} = rxjs;
    const {map, switchMap, tap} = rxjs.operators;
    let apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';

    const p = fetch(apiurl + booktitle).then(res => res.json());
    // .then(books => console.log(books))
    from(p).pipe(
        switchMap((data:GoogleBook) => from(data.items)),
        
        map((ele:BookItem)=>{
            const book:Book = {
                title : ele.volumeInfo.title,
                categories: ele.volumeInfo.categories,
                authors: ele.volumeInfo.authors,
                description: ele.volumeInfo.description,
                thumbnail: ele.volumeInfo.imageLinks.thumbnail
            };
            return book;
        }
        ),
        //tap( (book:Book) => console.log(book)),
    )
    .subscribe( (book:Book) => displayBook(book))
    //console.log(data.items));
}
function displayBook(book : Book){
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
div.setAttribute('class','col-md-4 py-3');
div.innerHTML = bookTpl;
document.querySelector('#books').appendChild(div)

}
getBooks('google');

