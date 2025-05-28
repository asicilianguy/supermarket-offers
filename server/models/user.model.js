import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const VALID_SUPERMARKETS = [
  "esselunga",
  "conad",
  "lidl",
  "eurospin",
  "bennet",
  "auchan",
  "penny",
  "despar",
  "centesimo",
  "carrefouriper",
  "carrefourexpress",
  "prestofresco",
  "carrefourmarket",
  "gigante",
  "ins",
  "todis",
  "md",
  "crai",
  "paghipoco",
]

const shoppingListItemSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: true, timestamps: true },
)

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v) => /^\+39\d{9,10}$/.test(v),
        message: (props) => `${props.value} is not a valid Italian phone number!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    shoppingList: [shoppingListItemSchema],
    frequentedSupermarkets: {
      type: [String],
      validate: {
        validator: (v) => v.every((market) => VALID_SUPERMARKETS.includes(market)),
        message: (props) => `${props.value} contains invalid supermarket names!`,
      },
    },
  },
  { timestamps: true },
)

// Index for faster queries
userSchema.index({ phoneNumber: 1 })

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User", userSchema)

export default User
