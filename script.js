let books = JSON.parse(localStorage.getItem("books")) || [];
let currentRating = 0;
let editIndex = null;

/* ===============================
   DISPLAY BOOKS
================================= */
function displayBooks() {
    const bookList = document.getElementById("bookList");
    if (!bookList) return;

    bookList.innerHTML = "";

    const countElement = document.getElementById("bookCount");
    if (countElement) {
        countElement.textContent = `Total Books: ${books.length}`;
    }

    books.forEach((book, index) => {

        const rating = Number(book.rating) || 0;

        let stars = "";
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? "★" : "☆";
        }

        let seriesInfo = "";
        if (book.series && book.series.trim() !== "") {
            seriesInfo = `
                <div class="series-badge">
                    ${book.series} 
                    ${book.seriesNumber ? `- Book ${book.seriesNumber}` : ""}
                </div>
            `;
        }

        const div = document.createElement("div");
        div.classList.add("book");

        div.innerHTML = `
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            ${seriesInfo}
            <div class="stars-display">${stars}</div>
            <button onclick="editBook(${index})">Edit</button>
            <button onclick="deleteBook(${index})">Delete</button>
        `;

        bookList.appendChild(div);
    });
}

/* ===============================
   ADD BOOK
================================= */
function addBook() {

    const title = document.getElementById("title")?.value.trim();
    const author = document.getElementById("author")?.value.trim();
    const series = document.getElementById("series")?.value.trim() || "";
    const seriesNumber = document.getElementById("seriesNumber")?.value || "";

    if (!title || !author) {
        alert("Please enter title and author.");
        return;
    }

    const book = {
        title,
        author,
        series,
        seriesNumber,
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
   DELETE
================================= */
function deleteBook(index) {
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
}

/* ===============================
   EDIT
================================= */
function editBook(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "add.html";
}

/* ===============================
   PAGE LOAD
================================= */
document.addEventListener("DOMContentLoaded", function () {

    displayBooks();

    const stars = document.querySelectorAll(".stars span");

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

        const storedIndex = localStorage.getItem("editIndex");

        if (storedIndex !== null) {
            editIndex = Number(storedIndex);
            const book = books[editIndex];

            document.getElementById("title").value = book.title;
            document.getElementById("author").value = book.author;
            document.getElementById("series").value = book.series || "";
            document.getElementById("seriesNumber").value = book.seriesNumber || "";

            currentRating = Number(book.rating) || 0;

            stars.forEach(s => {
                const value = Number(s.getAttribute("data-value"));
                s.style.color = value <= currentRating ? "#c7a96b" : "#555";
            });

            localStorage.removeItem("editIndex");
        }
    }
});
