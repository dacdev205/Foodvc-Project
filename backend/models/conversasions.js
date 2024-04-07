const mongoose = require('mongoose');

const conversasionsSchema = mongoose.Schema({
    members: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
    },
    {timestamp: true}
);

module.exports = mongoose.model('Conversasions', conversasionsSchema);

