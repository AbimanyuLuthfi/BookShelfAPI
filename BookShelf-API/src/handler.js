const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const id = nanoid(16);

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name) {
        const fewBooks = books
        .filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));
        const response = h.response({
            status: 'success',
            data: {
                books: fewBooks,
            },
        });
        response.code(200);
        return response;
    }
    if (reading) {
        const theBook = books.filter((book) => book.reading === false);
        const response = h.response({
            status: 'success',
            data: {
                books: theBook.map((book2) => ({
                    id: book2.id,
                    name: book2.name,
                    publisher: book2.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    if (finished) {
        const response = h.response({
            status: 'success',
            data: {
                books: books
                .filter((book) => Number(book.finished) === Number(finished)).map((book2) => ({
                    id: book2.id,
                    name: book2.name,
                    publisher: book2.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book2) => ({
                id: book2.id,
                name: book2.name,
                publisher: book2.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book2 = books.filter((thatBook) => thatBook.id === bookId)[0];

    if (!book2) {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }
    const response = h.response({
        status: 'success',
        data: {
            book:
            book2,
        },
    });
    response.code(200);
    return response;
};

const updateBookHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((theBook) => theBook.id === bookId);
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            pageCount,
            publisher,
            readPage,
            reading,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((required) => required.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookHandler,
    deleteBookHandler,
};
