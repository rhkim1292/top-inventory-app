#! /usr/bin/env node

console.log("This script populates some test items and categories");

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
	console.log("Debug: About to connect");
	await mongoose.connect(mongoDB);
	console.log("Debug: Should be connected?");
	await createCategories();
	await createItems();
	console.log("Debug: Closing mongoose");
	mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the T-Shirt category, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
	const category = new Category({ name: name, description: description });
	await category.save();
	categories[index] = category;
	console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, category, priceInCents, quantity) {
	const itemdetail = {
		name: name,
		category: category,
		priceInCents: priceInCents,
		quantity: quantity,
	};

	const item = new Item(itemdetail);

	await item.save();
	items[index] = item;
	console.log(`Added item: ${name}`);
}

async function createCategories() {
	console.log("Adding categories");
	await Promise.all([
		categoryCreate(0, "T-Shirt", "Short sleeve t-shirts"),
		categoryCreate(1, "Hoodie", "Outerwear with a hood"),
		categoryCreate(2, "Hat", "Accessories you wear on your head"),
	]);
}

async function createItems() {
	console.log("Adding Items");
	await Promise.all([
		itemCreate(
			0,
			"Shmoo Fthr T-Shirt - Charcoal/White",
			categories[0],
			10000,
			5
		),
		itemCreate(
			1,
			"(WSR91KWH) Newington T-Shirt - Black Heritage Wash",
			categories[0],
			10000,
			6
		),
		itemCreate(2, "Take Out T-Shirt - Tan", categories[0], 10000, 15),
		itemCreate(3, "x Batman Graphic Pullover Hoodie", categories[1], 10000, 5),
		itemCreate(4, "High On Life Pullover Hoodie", categories[1], 10000, 23),
		itemCreate(
			5,
			"LA Dodgers Swirl 59FIFTY Fitted Hat (60288093)",
			categories[2],
			10000,
			30
		),
		itemCreate(
			6,
			"Lord Nermal 6 Panel Pocket Hat - Black",
			categories[2],
			10000,
			55
		),
	]);
}
