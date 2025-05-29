import ProductOffer from "../models/productOffer.model.js";
import User from "../models/user.model.js";
import { VALID_AISLES } from "../constants/aisles.js";

// Get all offers
export const getAllOffers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      chainName,
      supermarketAisle,
      brand,
      sort,
    } = req.query;

    const query = {};

    // Apply filters if provided
    if (chainName) query.chainName = chainName;
    if (supermarketAisle) {
      // Se supermarketAisle è fornito, cerca offerte che contengono quel reparto
      query.supermarketAisle = supermarketAisle;
    }
    if (brand) query.brand = brand;

    // Only show active offers
    query.offerEndDate = { $gte: new Date() };

    // Determine sort order
    let sortOption = {};
    if (sort === "price") {
      sortOption = { offerPrice: 1 };
    } else if (sort === "discount") {
      sortOption = { discountPercentage: -1 };
    } else if (sort === "endDate") {
      sortOption = { offerEndDate: 1 };
    } else {
      // Default sort by newest
      sortOption = { createdAt: -1 };
    }

    const offers = await ProductOffer.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ProductOffer.countDocuments(query);

    res.json({
      offers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error in getAllOffers:", err.message);
    res.status(500).send("Server error");
  }
};

// Get offers by supermarket
export const getOffersBySupermarket = async (req, res) => {
  try {
    const { chainName } = req.params;
    const { page = 1, limit = 20, sort } = req.query;

    // Determine sort order
    let sortOption = {};
    if (sort === "price") {
      sortOption = { offerPrice: 1 };
    } else if (sort === "discount") {
      sortOption = { discountPercentage: -1 };
    } else {
      // Default sort by newest
      sortOption = { createdAt: -1 };
    }

    const offers = await ProductOffer.find({
      chainName,
      offerEndDate: { $gte: new Date() },
    })
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ProductOffer.countDocuments({
      chainName,
      offerEndDate: { $gte: new Date() },
    });

    res.json({
      offers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error in getOffersBySupermarket:", err.message);
    res.status(500).send("Server error");
  }
};

// Get offers by product name (search)
export const searchOffers = async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offers = await ProductOffer.find({
      $text: { $search: query },
      offerEndDate: { $gte: new Date() },
    })
      .sort({ score: { $meta: "textScore" } })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ProductOffer.countDocuments({
      $text: { $search: query },
      offerEndDate: { $gte: new Date() },
    });

    res.json({
      offers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error in searchOffers:", err.message);
    res.status(500).send("Server error");
  }
};

// Get offers for user's shopping list
export const getOffersForShoppingList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's shopping list and frequented supermarkets
    const { shoppingList, frequentedSupermarkets } = user;

    if (shoppingList.length === 0) {
      return res.json({ message: "Shopping list is empty", offers: [] });
    }

    // Create an array of product names from the shopping list
    const productNames = shoppingList.map((item) => item.productName);

    // Find offers that match products in the shopping list and are from frequented supermarkets
    const offers = await Promise.all(
      productNames.map(async (productName) => {
        const matchingOffers = await ProductOffer.find({
          $text: { $search: productName },
          chainName: { $in: frequentedSupermarkets },
          offerEndDate: { $gte: new Date() },
        })
          .sort({ offerPrice: 1 })
          .limit(5);

        return {
          productName,
          offers: matchingOffers,
        };
      })
    );

    res.json(offers);
  } catch (err) {
    console.error("Error in getOffersForShoppingList:", err.message);
    res.status(500).send("Server error");
  }
};

// Get best offers (highest discount percentage)
export const getBestOffers = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const offers = await ProductOffer.find({
      offerEndDate: { $gte: new Date() },
      discountPercentage: { $exists: true, $ne: null },
    })
      .sort({ discountPercentage: -1 })
      .limit(limit * 1)
      .exec();

    res.json(offers);
  } catch (err) {
    console.error("Error in getBestOffers:", err.message);
    res.status(500).send("Server error");
  }
};

// Get offers by aisle
export const getOffersByAisle = async (req, res) => {
  try {
    const { aisle } = req.params;
    const { page = 1, limit = 20, chainName } = req.query;

    const query = {
      supermarketAisle: aisle, // Mongoose cerca automaticamente nell'array
      offerEndDate: { $gte: new Date() },
    };

    if (chainName) {
      query.chainName = chainName;
    }

    const offers = await ProductOffer.find(query)
      .sort({ offerPrice: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ProductOffer.countDocuments(query);

    res.json({
      offers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error in getOffersByAisle:", err.message);
    res.status(500).send("Server error");
  }
};

// Get offers by brand
export const getOffersByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offers = await ProductOffer.find({
      brand,
      offerEndDate: { $gte: new Date() },
    })
      .sort({ offerPrice: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ProductOffer.countDocuments({
      brand,
      offerEndDate: { $gte: new Date() },
    });

    res.json({
      offers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error in getOffersByBrand:", err.message);
    res.status(500).send("Server error");
  }
};

// Get all available aisles - ora restituisce l'array predefinito
export const getAllAisles = async (req, res) => {
  try {
    res.json(VALID_AISLES);
  } catch (err) {
    console.error("Error in getAllAisles:", err.message);
    res.status(500).send("Server error");
  }
};

// Get all available brands
export const getAllBrands = async (req, res) => {
  try {
    const brands = await ProductOffer.distinct("brand");
    res.json(brands.filter((brand) => brand)); // Filter out null or empty brands
  } catch (err) {
    console.error("Error in getAllBrands:", err.message);
    res.status(500).send("Server error");
  }
};
