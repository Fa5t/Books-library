document.addEventListener('DOMContentLoaded', function() {
    const uploadBook = document.querySelector('#uploadBook');
    const writeBook = document.querySelector('#writeBook');
    const writeForm = document.querySelector('.main__block-add-books__write');
    const uploadForm = document.querySelector('.main__block-add-books__upload');

    uploadBook.addEventListener('click', function () {        
            uploadForm.style.display = 'flex';
            writeForm.style.display = 'none';             
    });

    writeBook.addEventListener('click', function () {       
            writeForm.style.display = 'flex';
            uploadForm.style.display = 'none';             
    });

    const Books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : [];

    document.querySelector('.main__block-add-books__write-btn').addEventListener('click', function() {
        let name = document.querySelector('.main__block-add-books__write-name').value;
        let text = document.querySelector('.main__block-add-books__write-text').value;

        if(name && text) {
            let book = {
                name, text,
                favorite: false,
                readIt: false,
                date: Date.now()
            };
            Books.push(book);
            localStorage.setItem('books', JSON.stringify(Books));
            console.log( localStorage.getItem('books') );
        } else {
            alert('Введите название и текст книги');
        }
    })

    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const name = document.querySelector('.main__block-add-books__upload-name').value;
        const files = document.querySelector('[type=file]').files[0];
        const formData = new FormData();
        formData.append('login', name);
        formData.append('file', files);

        fetch('https://apiinterns.osora.ru/', {
            method: 'POST',
            body: formData
        })
        .then((response) => response.json())
        .then((text) => {
            let book = {
                name, 
                text: text.text,
                favorite: false,
                readIt: false,
                date: Date.now()
            };
            Books.push(book);
            localStorage.setItem('books', JSON.stringify(Books));
            console.log( localStorage.getItem('books') );
        });
    })

    function uploadBooks() {
        let favBooks = document.querySelector('.main__block__favourite-books__book');
        let listBooks = document.querySelector('.main__block__list-books__book');
        favBooks.innerHTML = '';
        listBooks.innerHTML = '';    
        let arr = sortArr(); 

        for(let i = 0; i < arr.length; i++) {
            let book = document.createElement('div');
            book.classList.add('book')
            book.classList.add(`book${i}`);
            book.setAttribute('data-date', arr[i].date);
            listBooks.appendChild(book);
            book.innerHTML = `
                <div class="book__left">
                            <p class="book__left__text">- ${arr[i].name}</p>
                        </div>
                        <div class="book__right">
                            <button class="btn btn-med btn-med${i}">РЕД.</button>
                            <button class="btn btn-big btn-big${i}">ПРОЧИТАЛ</button>
                            <button class="btn btn-med btn-med${i}">ЧИТАТЬ</button>
                            <button class="btn btn-little btn-little${i}">Х</button>
                        </div>`;

            if(arr[i].favorite === true) {
                favBooks.appendChild(book);
                book.innerHTML = `
                <div class="book__left">
                            <p class="book__left__text">- ${arr[i].name}</p>
                        </div>
                        <div class="book__right">
                            <button class="btn btn-med btn-med${i}">РЕД.</button>
                            <button class="btn btn-big btn-big${i}">ПРОЧИТАЛ</button>
                            <button class="btn btn-med btn-med${i}">ЧИТАТЬ</button>
                            <button class="btn btn-little btn-little${i}">Х</button>
                        </div>`;
            } 
        }

        document.querySelectorAll('.book__right').forEach( event => {
            event.addEventListener('click', e => {

                if(e.target.classList[1] == 'btn-med') {
                    let date = arr[e.target.className.toString().slice(-1)].date;
                    readIt(date);
                }

                if(e.target.classList[1] == 'btn-little') {
                    let date = arr[e.target.className.toString().slice(-1)].date;
                    deleteBook(date);
                }
            })
        })
    }

    function readIt(data) {
        let arr = sortArr();
        let read = arr.find( item => item.date == data);
        const readText = document.querySelector('.main-right__read');
        readText.innerHTML = ''
        let readBook = document.createElement('div');
        readBook.classList.add('main-right__read__book');
        readText.appendChild(readBook);
        console.log(read);
        readBook.innerHTML = read.text;

    }

    function deleteBook(data) {
        let arr = sortArr();
        let deleteArr = arr.find( item => item.date == data);
        let newArr = arr.indexOf(deleteArr);
        arr.splice(newArr, 1);
        localStorage.setItem('books', JSON.stringify(arr));
        uploadBooks();
    }

    function sortArr() {
        let arr = takeArr();
        let unreadArr = [], 
        readArr = [], 
        sortArr = [];

        for (let i = 0; i < arr.length; i++) {
            if(arr[i].readIt === false) {
                unreadArr.push(arr[i]);
            } else {
                readArr.push(arr[i]);
            }
        }
        
        unreadArr.sort((prev, next) => {
            prev.date - next.date;
        });
        readArr.sort((prev, next) => {
            prev.date - next.date;
        });
        sortArr = readArr.concat(unreadArr);
        localStorage.setItem('books', JSON.stringify(sortArr));
        return sortArr;
}

    function takeArr () {
        let newBooks = [];
        localStorage.getItem('books') ? newBooks = JSON.parse(localStorage.getItem('books')) : console.log('error');
        console.log(newBooks);
        return newBooks;
    }
    uploadBooks();
});