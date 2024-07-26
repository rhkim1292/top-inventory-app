const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: { type: String, required: true, maxLength: 100 },
	category: { type: Schema.Types.ObjectId, ref: "Category" },
	priceInCents: { type: Number, required: true, min: 0 },
	quantity: { type: Number, required: true, min: 0 },
});

// Virtual for item's URL
ItemSchema.virtual("url").get(function () {
	// We don't use an arrow function as we'll need the this object
	return `/item/${this._id}`;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);
