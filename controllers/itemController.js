const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { formatCurrency } = require("../lib/formatters");
const { body, validationResult } = require("express-validator");

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
		itemUrl: item.url,
	});
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
	// Get all categories, which we can use for adding to our item.
	const allCategories = await Category.find().sort({ name: 1 }).exec();

	res.render("item_form", {
		title: "Create Item",
		categories: allCategories,
	});
});

// Handle item create on POST.
exports.item_create_post = [
	// Validate and sanitize fields.
	body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
	body("category.*").escape(),
	body("priceInCents", "The price of the item must be greater than 0.").isInt({
		min: 1,
	}),
	body("quantity", "Quantity cannot be a negative number.").isInt({ min: 0 }),
	// Process request after validation and sanitization.

	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a Item object with escaped and trimmed data.
		const item = new Item({
			name: req.body.name,
			category: req.body.category,
			priceInCents: req.body.priceInCents,
			quantity: req.body.quantity,
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.

			// Get all categories for form.
			const allCategories = await Category.find().sort({ name: 1 }).exec();

			// Mark our selected categories as checked.
			for (const category of allCategories) {
				if (item.category.includes(category._id)) {
					category.selected = "true";
					break;
				}
			}
			res.render("item_form", {
				title: "Create Item",
				categories: allCategories,
				item: item,
				errors: errors.array(),
			});
		} else {
			// Data from form is valid. Save book.
			await item.save();
			res.redirect(item.url);
		}
	}),
];

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
	// Get details of item
	const item = await Item.findById(req.params.id).exec();

	if (item === null) {
		// No results.
		res.redirect("/items");
	}

	res.render("item_delete", {
		title: "Delete Item",
		item: item,
	});
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
	await Item.findByIdAndDelete(req.body.itemid);
	res.redirect("/items");
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Item update GET");
});

// Handle Item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Item update POST");
});
