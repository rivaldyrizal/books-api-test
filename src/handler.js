const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

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

    const newBooks = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    books.push(newBooks);
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
    let result = [...books];

    // Filter berdasarkan query parameter "name"
    if (request.query.name) {
        result = result.filter(book => book.name.toLowerCase().includes(request.query.name.toLowerCase()));
    }

    // Filter berdasarkan query parameter "reading"
    if (request.query.reading === '0' || request.query.reading === '1') {
        const reading = request.query.reading === '1' ? true : false;
        result = result.filter(book => book.reading === reading);
    }

    // Filter berdasarkan query parameter "finished"
    if (request.query.finished === '0' || request.query.finished === '1') {
        const finished = request.query.finished === '1' ? true : false;
        result = result.filter(book => book.finished === finished);
    }

    const newBooks = result.map(function (a) {
        return {
            id: a.id,
            name: a.name,
            publisher: a.publisher
        }
    });

    return {
        status: 'success',
        data: {
            books: newBooks
        },
    }
};

const getBooksByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBooksByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
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

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
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

const deleteBooksByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

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
    addBooksHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    editBooksByIdHandler,
    deleteBooksByIdHandler,
}