function Book(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}


Book.prototype.toggleRead = function(){
    this.read = !this.read;
}


const rawData = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", pages: 180, read: true },
    { title: "1984", author: "George Orwell", pages: 328, read: false },
    { title: "The Hobbit", author: "J.R.R. Tolkien", pages: 310, read: true },
    { title: "Brave New World", author: "Aldous Huxley", pages: 268, read: false },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", pages: 234, read: true },
    { title: "To Kill a Mockingbird", author: "Harper Lee", pages: 281, read: true },
    { title: "Fahrenheit 451", author: "Ray Bradbury", pages: 158, read: false },
    { title: "Dune", author: "Frank Herbert", pages: 412, read: false },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", pages: 213, read: true },
    { title: "The Alchemist", author: "Paulo Coelho", pages: 167, read: true },
    { title: "Frankenstein", author: "Mary Shelley", pages: 280, read: false },
    { title: "Pride and Prejudice", author: "Jane Austen", pages: 432, read: false }
];


let editBookId = null;

function createLibrary(data) {
    return data.map(item => new Book(item.title, item.author, item.pages, item.read));
}

let myLibrary = createLibrary(rawData);

function displayBooks(libraryArray) {
    const container = document.getElementById('library-container');
    if (!container) return; 

    container.innerHTML = "";

    libraryArray.forEach((book) => {
        const card = document.createElement('div');
        card.classList.add('book-card');
        //assign unique data-id based on book.id
        card.setAttribute('data-id', book.id);

        card.innerHTML = `
            <h3>${book.title}</h3>
            <p>By: ${book.author}</p>
            <p>Pages: ${book.pages}</p>
            <p class="status">${book.read ? "Read" : "Not Read Yet"}</p>
            <div class="buttons">
            <button class="toggle-btn">Change Status</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Remove</button>
            </div>`;
        
        container.appendChild(card);
    });
}


displayBooks(myLibrary);


const dialog = document.querySelector('#book-dialog');
const showButton = document.querySelector('#new-book-btn');
const closeButton = document.querySelector('#close-btn');
const bookForm = document.querySelector('#book-form');


showButton.addEventListener('click', ()=>{
    dialog.showModal();
});

closeButton.addEventListener('click',()=>{
    editBookId = null;
    bookForm.reset();
    dialog.close();
})

bookForm.addEventListener('submit', (event)=>{
    event.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const isRead = document.querySelector('#read').checked;

    if (editBookId){
        const bookIndex = myLibrary.findIndex(b => b.id === editBookId);
        myLibrary[bookIndex].title = title;
        myLibrary[bookIndex].author = author;
        myLibrary[bookIndex].pages = pages;
        myLibrary[bookIndex].read = isRead;

        editBookId = null; //resetting edit mode
    } else {
        const newBook = new Book(title, author, pages, isRead);
        myLibrary.push(newBook);
    }

    displayBooks(myLibrary);
    bookForm.reset();
    dialog.close();
});



const container = document.getElementById('library-container');

container.addEventListener('click', (e) => {
    // 1. Get the ID from the closest card element
    const card = e.target.closest('.book-card');
    if (!card) return;
    const bookId = card.getAttribute('data-id');

    // 2. Handle Remove Button
    if (e.target.classList.contains('delete-btn')) {
        removeBook(bookId);
    }

    // 3. Handle Toggle Button
    if (e.target.classList.contains('toggle-btn')) {
        toggleBookStatus(bookId);
    }

    if (e.target.classList.contains('edit-btn')){
        const book = myLibrary.find(b => b.id === bookId);
        if (book){
            document.querySelector('#title').value = book.title;
            document.querySelector('#author').vallue = book.author;
            document.querySelector('#pages').value = book.pages;
            document.querySelector('#read').checked = book.read;

            editBookId = bookId;
            dialog.showModal();
        }
    }
});


function removeBook(id) {
    // Filter the array to keep everything EXCEPT the book with this ID
    myLibrary = myLibrary.filter(book => book.id !== id);
    
    // Re-render the library to show the change
    displayBooks(myLibrary);
}

function toggleBookStatus(id) {
    // Find the specific book object in the array
    const book = myLibrary.find(book => book.id === id);
    
    if (book) {
        book.toggleRead(); // Use the prototype function we created
        displayBooks(myLibrary); // Re-render to update the text/button
    }
}