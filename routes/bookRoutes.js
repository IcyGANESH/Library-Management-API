const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// CRITICAL: /books/search route MUST come BEFORE /books/:id route
// Otherwise, Express will confuse "search" as an ID parameter

/**
 * POST /books
 * Add a new book
 */
router.post('/books', bookController.addBook);

/**
 * GET /books
 * Get all books
 */
router.get('/books', bookController.getAllBooks);

/**
 * GET /books/search?title=xyz
 * Search books by title (partial matching with regex)
 * IMPORTANT: This must be BEFORE /books/:id route
 */
router.get('/books/search', bookController.searchBooksByTitle);

/**
 * GET /books/:id
 * Get a specific book by ID
 */
router.get('/books/:id', bookController.getBookById);

/**
 * PUT /books/:id
 * Update a specific book by ID
 */
router.put('/books/:id', bookController.updateBook);

/**
 * DELETE /books/:id
 * Delete a specific book by ID
 */
router.delete('/books/:id', bookController.deleteBook);

module.exports = router;
