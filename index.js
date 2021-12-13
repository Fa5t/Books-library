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

    let Books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : [];

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
            uploadBooks();
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
            uploadBooks();
        });
    })

    function uploadBooks() {
        let favBooks = document.querySelector('.main__block__favourite-books__book');
        let listBooks = document.querySelector('.main__block__list-books__book');
        const dragNdrop = document.querySelectorAll('.dragNdrop');
        favBooks.innerHTML = '';
        listBooks.innerHTML = '';    
        let arr = sortArr();

        for(let i = 0; i < arr.length; i++) {
            let book = document.createElement('div');
            book.classList.add('book')
            book.classList.add(`book${i}`);
            book.setAttribute('data-date', arr[i].date);
            listBooks.appendChild(book);
            book.setAttribute('draggable', 'true');

            arr[i].readIt ? book.style.backgroundColor = 'grey' : book.style.backgroundColor = 'white';

            book.innerHTML = `
                <div class="book__left">
                            <p class="book__left__text">- ${arr[i].name}</p>
                        </div>
                        <div class="book__right">
                            <button class="btn btn-red btn-red${i}">РЕД.</button>
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
                            <button class="btn btn-red btn-red${i}">РЕД.</button>
                            <button class="btn btn-big btn-big${i}">ПРОЧИТАЛ</button>
                            <button class="btn btn-med btn-med${i}">ЧИТАТЬ</button>
                            <button class="btn btn-little btn-little${i}">Х</button>
                        </div>`;
            } 
        }
        document.querySelectorAll('.book__right').forEach( event => {
            event.addEventListener('click', e => {
                let date = arr[e.target.className.toString().slice(-1)].date;
    
                if(e.target.classList[1] == 'btn-med') {
                    readIt(date);
                }
    
                if(e.target.classList[1] == 'btn-little') {
                    deleteBook(date);
                }
    
                if(e.target.classList[1] == 'btn-red') {
                    editBook(date);
                }
    
                if(e.target.classList[1] == 'btn-big') {
                    changeReadit(date);
                }
            })
        })  
    }

    document.querySelectorAll('.book__right').forEach( event => {
        event.addEventListener('click', e => {
            let date = arr[e.target.className.toString().slice(-1)].date;

            if(e.target.classList[1] == 'btn-med') {
                readIt(date);
            }

            if(e.target.classList[1] == 'btn-little') {
                deleteBook(date);
            }

            if(e.target.classList[1] == 'btn-red') {
                editBook(date);
                console.log(e.target);
            }

            if(e.target.classList[1] == 'btn-big') {
                changeReadit(date);
                console.log(e.target);
            }
        })
    })

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
        let num = arr.indexOf(deleteArr);
        arr.splice(num, 1);
        localStorage.setItem('books', JSON.stringify(arr));
        location.reload();
    }

    function editBook(data) {
        let arr = sortArr();
        let read = arr.find( item => item.date == data);
        const readText = document.querySelector('.main-right__read');
        readText.innerHTML = ''
        let readBook = document.createElement('div');
        readBook.classList.add('main-right__read__book');
        readText.appendChild(readBook);
        let form = document.createElement('form');
        let newText = document.createElement('textarea');
        newText.innerHTML = read.text;
        let btn = document.createElement('input');
        readBook.appendChild(form);
        form.appendChild(newText);
        form.appendChild(btn);
        btn.setAttribute('type', 'button');
        btn.setAttribute('value', 'Save');
        btn.addEventListener('click', () => {
            arr[arr.indexOf(read)].text = newText.value;
            localStorage.setItem('books', JSON.stringify(arr));
        })
    }

    function changeReadit(data) {
        let arr = sortArr();
        let changeArr = arr.find( item => item.date == data);
        let num = arr.indexOf(changeArr);
        let color = '';
        console.log(arr[num].readIt);
        arr[num].readIt = !arr[num].readIt
        localStorage.setItem('books', JSON.stringify(arr));
        location.reload();
    }

    function drag() {
        const listBooks = document.querySelectorAll('.main__block__list-books__book');
        const favBooks = document.querySelectorAll('.main__block__favourite-books__book');
        const books = document.querySelectorAll('.book');
        const dropFav = document.querySelector('.main__block__favourite-books__drag-n-drop-area');
        const listDrop = document.querySelector('.main__block__list-books__drag-n-drop-area');

        books.forEach(book => {
            book.addEventListener('dragstart', e => {
                e.target.classList.add('selected');
                //console.log(e.target);
                console.log('start');
            })
        })

        books.forEach(book => {
            book.addEventListener('dragend', e => {
                e.target.classList.remove('selected');
                //console.log(e.target);
                console.log('end');
            })
        })

        dropFav.addEventListener('dragover', e => {
            e.preventDefault();
        })

        listDrop.addEventListener('dragover', e => {
            e.preventDefault();
        })

        dropFav.addEventListener('drop', e => {
            e.preventDefault();
            books.forEach( book => {
                if(book.classList[2] === 'selected') { 
                    let date = book.getAttribute('data-date');
                    let arr = JSON.parse(localStorage.getItem('books'));
                    let newNum = arr.find(item => item.date == date);
                    let num = arr.indexOf(newNum);
                    arr[num].favorite = true;
                    localStorage.setItem('books', JSON.stringify(arr));
                    location.reload();
                } else
                {
                    console.log('error');
                }
            })
        })

        listDrop.addEventListener('drop', e => {
            e.preventDefault();
            books.forEach( book => {
                if(book.classList[2] === 'selected') { 
                    let date = book.getAttribute('data-date');
                    let arr = JSON.parse(localStorage.getItem('books'));
                    let newNum = arr.find(item => item.date == date);
                    let num = arr.indexOf(newNum);
                    arr[num].favorite = false;
                    localStorage.setItem('books', JSON.stringify(arr));
                    location.reload();
                } else
                {
                    console.log('error');
                }
            })
        })
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
    drag();
});