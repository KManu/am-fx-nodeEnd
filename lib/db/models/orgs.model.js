const mongoose = require('mongoose');
const dayjs = require('dayjs');
const uuid4 = require('uuid/v4');

const orgSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
      default: () => uuid4()
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    licenseNumber: {
      type: String,
      required: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      index: true
    },
    phone: {
      type: String,
      required: true
    },
    activated: {
      type: Boolean,
      required: true,
      default: false
    },
    active: {
      type: Boolean,
      required: true,
      default: true
    },
    created: {
      type: Date,
      required: true,
      default: () => {
        return dayjs().toDate();
      }
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

orgSchema.pre('remove', function(next) {
  this.model('User').updateMany({ organisation: this._id }, { active: false });
});

const orgModel = mongoose.model('Org', orgSchema);

module.exports.orgModel = orgModel;
