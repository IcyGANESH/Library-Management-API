const Book = require('../models/Book');

/**
 * POST /books
 * Add a new book to the library
 * Returns 201 on success
 */
exports.addBook = async (req, res, next) => {
  try {
    const { title, author, isbn, genre, publisher, publicationYear, totalCopies, availableCopies, shelfLocation, bookType, status } = req.body;

    // Validate required fields
    if (!title || !author || !isbn || !genre || !publisher) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, author, isbn, genre, publisher',
      });
    }

    // Validate totalCopies is positive
    if (totalCopies !== undefined && totalCopies < 0) {
      return res.status(400).json({
        success: false,
        message: 'Total copies must be a positive number',
      });
    }

    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'A book with this ISBN already exists',
      });
    }

    // Create new book
    const newBook = new Book({
      title,
      author,
      isbn,
      genre,
      publisher,
      publicationYear: publicationYear || null,
      totalCopies: totalCopies || 0,
      availableCopies: availableCopies || 0,
      shelfLocation: shelfLocation || null,
      bookType: bookType || 'Circulating',
      status: status || 'Available',
    });

    await newBook.save();

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: newBook,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /books
 * Retrieve all books from the library
 * Returns 200 on success
 */
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /books/search?title=xyz
 * Search books by title (case-insensitive, partial matching using regex)
 * Returns 200 on success
 */
exports.searchBooksByTitle = async (req, res, next) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title query parameter',
      });
    }

    // Use regex for case-insensitive partial matching
    const books = await Book.find({
      title: { $regex: title, $options: 'i' },
    });

    res.status(200).json({
      success: true,
      message: 'Search results retrieved successfully',
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /books/:id
 * Retrieve a specific book by ID
 * Returns 200 on success, 404 if not found
 */
exports.getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: book,
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid book ID format',
      });
    }
    next(error);
  }
};

/**
 * PUT /books/:id
 * Update a specific book by ID
 * Returns 200 on success, 404 if not found
 */
exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate totalCopies if provided
    if (updateData.totalCopies !== undefined && updateData.totalCopies < 0) {
      return res.status(400).json({
        success: false,
        message: 'Total copies must be a positive number',
      });
    }

    // If ISBN is being updated, check for duplicates
    if (updateData.isbn) {
      const existingBook = await Book.findOne({
        isbn: updateData.isbn,
        _id: { $ne: id },
      });
      if (existingBook) {
        return res.status(400).json({
          success: false,
          message: 'A book with this ISBN already exists',
        });
      }
    }

    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook,
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid book ID format',
      });
    }
    next(error);
  }
};

/**
 * DELETE /books/:id
 * Delete a specific book by ID
 * Returns 200 on success, 404 if not found
 */
exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: deletedBook,
    });
  } catch (error) {
    // Handle invalid MongoDB ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid book ID format',
      });
    }
    next(error);
  }
};
