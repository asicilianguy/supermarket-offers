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

// Batch insert offers - NOT accessible from client
export const batchInsertOffers = async (req, res) => {
  try {
    const { productsInfo } = req.body;

    if (!productsInfo || !Array.isArray(productsInfo)) {
      return res.status(400).json({
        success: false,
        message: "productsInfo array is required",
      });
    }

    console.log("VALID_AISLES:", VALID_AISLES);

    // Raccogli tutti i valori unici di supermarketAisle dai prodotti
    const uniqueAisles = new Set();
    productsInfo.forEach((product) => {
      if (Array.isArray(product.supermarketAisle)) {
        product.supermarketAisle.forEach((aisle) => uniqueAisles.add(aisle));
      }
    });
    console.log("Aisles nei prodotti:", Array.from(uniqueAisles));

    // Crea date predefinite
    const defaultStartDate = new Date();
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 14);

    console.log(`Validazione di ${productsInfo.length} prodotti...`);

    const validatedProducts = productsInfo.map((product) => {
      const validatedProduct = { ...product };

      // Imposta supermarketAisle a un valore valido forzato
      validatedProduct.supermarketAisle = ["spesa base"];

      // Assicurati che productName sia presente
      if (
        !validatedProduct.productName ||
        typeof validatedProduct.productName !== "string"
      ) {
        validatedProduct.productName = "Prodotto senza nome";
      }

      // Assicurati che offerPrice sia sempre presente e sia un numero
      if (
        validatedProduct.offerPrice === null ||
        validatedProduct.offerPrice === undefined ||
        isNaN(validatedProduct.offerPrice)
      ) {
        validatedProduct.offerPrice = 0;
      }

      // Imposta date di default
      validatedProduct.offerStartDate = defaultStartDate;
      validatedProduct.offerEndDate = defaultEndDate;

      return validatedProduct;
    });

    // Prova a inserire un singolo prodotto per debug
    try {
      const singleProduct = new ProductOffer(validatedProducts[0]);
      const validationError = singleProduct.validateSync();

      if (validationError) {
        console.error("Errore di validazione:", validationError);
        return res.status(400).json({
          success: false,
          message: "Validation error on sample product",
          errors: validationError.errors,
        });
      }

      // Salva il singolo prodotto
      const savedProduct = await singleProduct.save();
      console.log("Prodotto singolo salvato con successo:", savedProduct._id);

      // Se funziona, prova il batch
      console.log("Tentativo di inserimento batch...");
    } catch (singleError) {
      console.error(
        "Errore nel salvataggio del prodotto singolo:",
        singleError
      );
      return res.status(400).json({
        success: false,
        message: "Error saving sample product",
        error: singleError.message,
      });
    }

    // Insert all products in batch
    try {
      const result = await ProductOffer.insertMany(validatedProducts, {
        ordered: false, // Continue inserting even if some fail
      });

      console.log("Risultato inserimento batch:", result.length);

      res.json({
        success: true,
        message: `Successfully inserted ${result.length} offers`,
        insertedCount: result.length,
        failedCount: validatedProducts.length - result.length,
      });
    } catch (batchError) {
      console.error("Errore batch completo:", batchError);

      // Cerca di estrarre informazioni dettagliate sugli errori
      let insertedCount = 0;
      let detailedErrors = [];

      if (batchError.insertedDocs) {
        insertedCount = batchError.insertedDocs.length;
      }

      if (batchError.writeErrors) {
        detailedErrors = batchError.writeErrors.map((err) => ({
          code: err.code,
          index: err.index,
          message: err.errmsg || err.message,
        }));
      }

      res.status(207).json({
        success: false,
        message: "Partial insert success",
        insertedCount: insertedCount,
        failedCount: validatedProducts.length - insertedCount,
        detailedErrors: detailedErrors.slice(0, 10), // Primi 10 errori
      });
    }
  } catch (err) {
    console.error("Error in batchInsertOffers:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
      stack: err.stack,
    });
  }
};
