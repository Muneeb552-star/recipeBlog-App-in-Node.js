const express = require('express');
const router = express.Router();
const recipeController = require("../controllers/recipeController");

/**
 * App Routes
 */
router.get("/", recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get("/categories", recipeController.exploreCategories);
router.get("/categories/:id", recipeController.exploreCategoriesById);
router.post("/search", recipeController.searchRecipe);
router.get("/explore-latest", recipeController.exploreLatest);
router.get("/submit-recipe", recipeController.submitRecipe);
router.post("/submit-recipe", recipeController.submitRecipeOnPost);
router.get("/dashboard", recipeController.dashboard);
router.get("/get-recipe/:id", recipeController.getRecipe);
router.post("/submit-update/:id", recipeController.updateRecipe);
router.post("/signup", recipeController.handleNewUser);
router.post("/login", recipeController.userLogin);
router.post("/logout", recipeController.userLogout);
module.exports = router;