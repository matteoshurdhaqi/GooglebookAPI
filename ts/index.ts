

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
    return from(p)
    .pipe(
        tap((data:GoogleBook) => showTotal(data.items.length)),
        switchMap((data:GoogleBook) => from(data.items || [])),
        
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
    function showTotal(total : number){
        const found = document.querySelector('#found');
        if(found){
            found.textContent = ''+total;
        }
    }
}
function displayBook(book : Book){
    const bookTpl = `
    <div class="card h-100">
        <img class="card-img-top card-thumbnail" src="${book.thumbnail}" alt="${book.title}"">
        <h5 class="card-title py-2">${book.title}</h5>
        <div class="card-body">
            
            <p class="card-text overflow-auto">${book.description || " "}</p>
            
        </div>
        <button class="btn btn-primary py-2">Vai al libro</button>
    </div>
`;
const div = document.createElement('div');
div.setAttribute('class','col-sm-6 col-md-4 col-lg-3');
div.innerHTML = bookTpl;
const books = document.querySelector('#books');
if(books){
    books.appendChild(div);
}

}
function cleanBooks(){
    const books = document.querySelector('#books');
    if(books){
        books.innerHTML = '';
    }
}
function searchBooks(){
const searchEle = document.querySelector('#search');
const {fromEvent, debounceTime} = rxjs;
const{filter, map, switchMap, tap} = rxjs.operators;
if(searchEle){
    fromEvent(searchEle, 'keyup')
        .pipe(
            map((ele:any) => ele.target.value),
            filter( (ele: string) => ele.length >2),
            debounceTime(1200),
            tap(() => cleanBooks()),
            switchMap((ele: string) => getBooks(ele) )
        ).subscribe((book:Book) => displayBook(book))
    //getBooks('php');
}

}
searchBooks();
function searchButtonClick(){
    const books:any = document.querySelector('#search');
    if(books){
        getBooks(books.value).subscribe((book : Book)=>displayBook(book))
    }
}


