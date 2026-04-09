const express = require("express");
const appService = require("./appService");

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get("/check-db-connection", async (req, res) => {
  const isConnect = await appService.testOracleConnection();
  if (isConnect) {
    res.send("connected");
  } else {
    res.send("unable to connect");
  }
});

router.get("/demotable", async (req, res) => {
  const tableContent = await appService.fetchDemotableFromDb();
  res.json({ data: tableContent });
});

router.get("/author-table", async (req, res) => {
  const tableContent = await appService.fetchAuthorTableFromDb();
  res.json({ data: tableContent });
});

router.get("/photo-table", async (req, res) => {
  const tableContent = await appService.fetchPhotoTableFromDb();
  res.json({ data: tableContent });
});

router.get("/recipe-table", async (req, res) => {
  const tableContent = await appService.fetchRecipeTableFromDb();
  res.json({ data: tableContent });
});

router.get("/preparation-step-table", async (req, res) => {
  const tableContent = await appService.fetchPreparationStep2FromDb();
  res.json({ data: tableContent });
});

router.get("/measurement-step-table", async (req, res) => {
  const tableContent = await appService.fetchMeasurementTableFromDb();
  res.json({ data: tableContent });
});

router.get("/used-in-table", async (req, res) => {
  const tableContent = await appService.fetchUsedInTableFromDb();
  res.json({ data: tableContent });
});

router.post("/initiate-tables", async (req, res) => {
  const initiateResult = await appService.initiateTables();
  if (initiateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-demotable", async (req, res) => {
  const { id, name } = req.body;
  const insertResult = await appService.insertDemotable(id, name);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-PreparationStep2", async (req, res) => {
  const {
    newRecipeName,
    newPreparationStepID,
    newPSDescription,
    newRequiredTemperature,
  } = req.body;

  const result = await appService.insertPreparationStep2(
    newPreparationStepID,
    newPSDescription,
    newRequiredTemperature,
    newRecipeName
  );

  if (result.success) {
    res.json({ success: true });
  } else {
    res.status(500).json({
      success: false,
      message: result.message || "Insert failed",
    });
  }
});

router.get("/valid-required-temperatures", async (req, res) => {
  const temps = await appService.fetchValidRequiredTemperatures();
  res.json({ data: temps });
});

router.post("/update-name-demotable", async (req, res) => {
  const { oldName, newName } = req.body;
  const updateResult = await appService.updateNameDemotable(oldName, newName);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/update-photo-table", async (req, res) => {
  const { pID, newPDescription, newHeight, newWidth, newRecipeName } = req.body;
  const updateResult = await appService.updatePhotoTable(
    pID,
    newPDescription,
    newHeight,
    newWidth,
    newRecipeName
  );
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.get("/recipe-names", async (req, res) => {
  const names = await appService.fetchRecipeNamesFromDb();
  res.json({ data: names });
});

router.get("/photo-ids", async (req, res) => {
  const names = await appService.fetchPhotoIDsFromDb();
  res.json({ data: names });
});

router.post("/delete-author", async (req, res) => {
  const { authorID, forceDelete } = req.body;

  if (forceDelete) {
    const success = await appService.deleteAuthorAndRecipes(authorID);
    return res.json({ success });
  }

  const result = await appService.deleteAuthor(authorID);

  if (result.status === "deleted") {
    return res.json({ success: true });
  }

  if (result.status === "not_found") {
    return res.status(404).json({ success: false, message: "Author not found" });
  }

  if (result.status === "blocked") {
    return res.json({ success: false, blocked: true, recipes: result.recipes });
  }

  return res.status(500).json({ success: false });
});

router.post("/select-recipe", async (req, res) => {
  const { conditions } = req.body;

  if (!conditions) {
    return res.status(400).json({
      success: false,
      message: "Invalid",
    });
  }

  const result = await appService.selectRecipesTable(conditions);

  if (result.success) {
    return res.json({
      success: true,
      data: result.data,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: result.message || "Selection failed",
    });
  }
});

//add '/project-np-table'
// calls appService.projectNutritionProfile(selectedCols)
router.post("/project-np-table", async (req, res) => {
  const { selectedCols } = req.body;
  const projectResult = await appService.projectNutritionProfile(selectedCols);
  if (projectResult) {
    res.json({ success: true, data: projectResult, columns: selectedCols });
  } else {
    res.status(500).json({ success: false });
  }
});

// add '/aggregation-group-by'
// calls appService.aggregationGroupBy
router.get("/aggregation-group-by", async (req, res) => {
  const tableContent = await appService.aggregationGroupBy();
  res.json({
    success: true,
    data: tableContent,
    columns: ["Cuisine", "CuisineCount"],
  });
});

// add '/aggregation-having'
// calls appService.aggregationHaving
router.get("/aggregation-having", async (req, res) => {
  const tableContent = await appService.aggregationHaving();
  res.json({
    success: true,
    data: tableContent,
    columns: ["IngredientType", "AverageProteinPerServing"],
  });
});

// add '/join-tables'
// calls appService.joinTables
router.get("/join-tables", async (req, res) => {
  const { ingredientName } = req.query;

    if (!ingredientName) {
        return res.status(400).json({ success: false, message: "Valid ingredient name required" });
    }

  const result = await appService.joinTables(ingredientName);

  if (result.success) {
    return res.json({
      success: true,
      data: result.data,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: result.message || "Filter failed",
    });
  }
});

// add '/division'

router.get("/count-demotable", async (req, res) => {
  const tableCount = await appService.countDemotable();
  if (tableCount >= 0) {
    res.json({
      success: true,
      count: tableCount,
    });
  } else {
    res.status(500).json({
      success: false,
      count: tableCount,
    });
  }
});

router.get('/nested-aggregation', async (req, res) => {
  const tableContent = await appService.nestedAggregation();
    res.json({ success: true, data: tableContent, columns: ["RecipeName", "NumEquipment"]});
});

router.get("/division", async (req, res) => {
  const result = await appService.division();
  if (result.success) {
    res.json({ success: true, data: result.data, columns: ["FirstName", "LastName", "Email"] });
  } else {
    res.status(500).json({ success: false, message: result.message });
  }
});

router.get("/cooking-technique-table", async (req, res) => {
  const tableContent = await appService.fetchCookingTechniqueTableFromDb();
  res.json({ data: tableContent });
});

module.exports = router;