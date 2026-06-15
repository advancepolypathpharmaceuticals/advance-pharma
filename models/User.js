const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Super Admin", "Admin", "Customer"],
      default: "Customer",
    },
    address: {
      street: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      zipCode: {
        type: String,
        default: "",
      },
    },
    pic: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to ensure name is set
UserSchema.pre("save", function (next) {
  // Combine firstName and lastName into name
  if (this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`.trim();
  } else if (this.firstName) {
    this.name = this.firstName;
  } else if (this.lastName) {
    this.name = this.lastName;
  } else {
    this.name = this.username || this.email.split("@")[0];
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
