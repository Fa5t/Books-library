document.addEventListener('DOMContentLoaded', function() {
    const uploadBook = document.querySelector('#uploadBook');
    const writeBook = document.querySelector('#writeBook');
    const writeForm = document.querySelector('.main__block-add-books__write');

    const Books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : [];

    document.querySelector('.main__block-add-books__write-btn').addEventListener('click', function() {
        let name = document.querySelector('.main__block-add-books__write-name').value;
        let text = document.querySelector('.main__block-add-books__write-text').value;

        if(name && text) {
            let book = {
                name, text,
                favorite: false
            };
            Books.push(book);
            localStorage.setItem('books', JSON.stringify(Books));
            console.log( localStorage.getItem('books') );
        } else {
            alert('Введите название и текст книги');
        }

    })

});