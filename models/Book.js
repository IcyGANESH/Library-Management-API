const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
    },
    publisher: {
      type: String,
      required: [true, 'Publisher is required'],
      trim: true,
    },
    publicationYear: {
      type: Number,
      default: null,
    },
    totalCopies: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: 'Total copies must be a positive number',
      },
    },
    availableCopies: {
      type: Number,
      default: 0,
    },
    shelfLocation: {
      type: String,
      default: null,
      trim: true,
    },
    bookType: {
      type: String,
      enum: ['Reference', 'Circulating'],
      default: 'Circulating',
    },
    status: {
      type: String,
      enum: ['Available', 'Checked Out'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);
