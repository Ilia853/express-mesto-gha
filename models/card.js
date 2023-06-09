const mongoose = require('mongoose');
const re = require('./user');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      /* eslint-disable */
      validator: function (v) {
        return re.test(v);
      },
    },
    /* eslint-enable */
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [
    {
      default: [],
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  createdAt: {
    default: Date.now,
    type: Date,
  },
});

module.exports = mongoose.model('card', cardSchema);
