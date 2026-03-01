let books = JSON.parse(localStorage.getItem("books")) || [];
let currentRating = 0;
let editIndex = null;

/* ===============================
   DISPLAY BOOKS (index.html)
================================= */
function displayBooks() {
    const bookList = document.getElementById("bookList");
    if (!bookList) return; // Only runs on index page

    bookList.innerHTML = "";

    books.forEach((book, index) => {

        const rating = Number(book.rating) || 0;
        let stars = "";

        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? "★" : "☆";
        }

        const div = document.createElement("div");
        div.classList.add("book");

        div.innerHTML = `
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p style="color:#c7a96b; font-size:18px;">${stars}</p>
            <button onclick="editBook(${index})">Edit</button>
            <button onclick="deleteBook(${index})">Delete</button>
        `;

        bookList.appendChild(div);
    });
}

/* ===============================
   ADD OR UPDATE BOOK
================================= */
function addBook() {

    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");

    if (!titleInput || !authorInput) return;

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !author) {
        alert("Please enter both title and author.");
        return;
    }

    const book = {
        title: title,
        author: author,
        rating: currentRating
    };

    if (editIndex !== null) {
        books[editIndex] = book;
        editIndex = null;
    } else {
        books.push(book);
    }

    localStorage.setItem("books", JSON.stringify(books));

    window.location.href = "index.html";
}

/* ===============================
   DELETE BOOK
================================= */
function deleteBook(index) {
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
}

/* ===============================
   EDIT BOOK
================================= */
function editBook(index) {
    localStorage.setItem("editBookIndex", index);
    window.location.href = "add.html";
}

/* ===============================
   PAGE LOAD LOGIC
================================= */
document.addEventListener("DOMContentLoaded", function () {

    displayBooks();

    const stars = document.querySelectorAll(".stars span");

    // Star click logic (only works on add.html)
    if (stars.length > 0) {

        stars.forEach(star => {
            star.addEventListener("click", function () {

                currentRating = Number(this.getAttribute("data-value"));

                stars.forEach(s => {
                    const value = Number(s.getAttribute("data-value"));
                    s.style.color = value <= currentRating ? "#c7a96b" : "#555";
                });
            });
        });

        // Load book for editing
        const editIndexStored = localStorage.getItem("editBookIndex");

        if (editIndexStored !== null) {

            editIndex = Number(editIndexStored);
            const book = books[editIndex];

            document.getElementById("title").value = book.title;
            document.getElementById("author").value = book.author;

            currentRating = Number(book.rating) || 0;

            stars.forEach(s => {
                const value = Number(s.getAttribute("data-value"));
                s.style.color = value <= currentRating ? "#c7a96b" : "#555";
            });

            localStorage.removeItem("editBookIndex");
        }
    }
});