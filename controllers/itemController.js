const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

const { formatCurrency } = require("../lib/formatters");

exports.index = asyncHandler(async (req, res, next) => {
	// Get details of books, book instances, authors and genre counts (in parallel)
	const [numItems, numCategories] = await Promise.all([
		Item.countDocuments({}).exec(),
		Category.countDocuments({}).exec(),
	]);

	res.render("index", {
		title: "Inventory Tracker",
		item_count: numItems,
		category_count: numCategories,
	});
});

// Display list of all Items.
exports.item_list = asyncHandler(async (req, res, next) => {
	const allItems = await Item.find({}, "name category")
		.sort({ title: 1 })
		.populate("category")
		.exec();

	res.render("item_list", { title: "Item List", item_list: allItems });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
	// Get details of items
	const item = await Item.findById(req.params.id).populate("category").exec();

	if (item === null) {
		// No results.
		const err = new Error("Item not found");
		err.status = 404;
		return next(err);
	}

	res.render("item_detail", {
		title: item.name,
		itemName: item.name,
		itemQuantity: item.quantity,
		itemCategory: item.category.name,
		itemPrice: formatCurrency(item.priceInCents / 100),
	});
});

// Display Item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Item create GET");
});

// Handle Item create on POST.
exports.item_create_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Item create POST");
});

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Item delete GET");
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Item delete POST");
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Item update GET");
});

// Handle Item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Item update POST");
});
