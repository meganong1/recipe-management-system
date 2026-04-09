const fs = require("fs/promises");

const oracledb = require("oracledb");
const loadEnvFile = require("./utils/envUtil");

const envVariables = loadEnvFile("./.env");

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
  user: envVariables.ORACLE_USER,
  password: envVariables.ORACLE_PASS,
  connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
  poolMin: 1,
  poolMax: 3,
  poolIncrement: 1,
  poolTimeout: 60,
};

// initialize connection pool
async function initializeConnectionPool() {
  try {
    await oracledb.createPool(dbConfig);
    console.log("Connection pool started");
  } catch (err) {
    console.error("Initialization error: " + err.message);
  }
}

async function closePoolAndExit() {
  console.log("\nTerminating");
  try {
    await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
    console.log("Pool closed");
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

initializeConnectionPool();

process.once("SIGTERM", closePoolAndExit).once("SIGINT", closePoolAndExit);

// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
  let connection;
  try {
    connection = await oracledb.getConnection(); // Gets a connection from the default pool
    return await action(connection);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
  return await withOracleDB(async (connection) => {
    return true;
  }).catch(() => {
    return false;
  });
}

async function fetchDemotableFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT * FROM DEMOTABLE");
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchPreparationStep2FromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      "SELECT RecipeName, PreparationStepID, PSDescription, RequiredTemperature FROM PreparationStep2"
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchAuthorTableFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT * FROM Author");
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchPhotoTableFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT * FROM Photo");
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchValidRequiredTemperatures() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT RequiredTemperature
       FROM PreparationStep1`
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchRecipeNamesFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT RecipeName FROM Recipe");
    return result.rows.map((row) => row[0]);
  }).catch(() => {
    return [];
  });
}

async function fetchPhotoIDsFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT PhotoID FROM Photo");
    return result.rows.map((row) => row[0]);
  }).catch(() => {
    return [];
  });
}


async function fetchRecipeTableFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT * FROM Recipe");
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchMeasurementTableFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT * FROM Measurement");
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchUsedInTableFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT * FROM UsedIn");
    return result.rows; // remove the .map((row) => row[0])
  }).catch(() => {
    return [];
  });
}

async function initiateTables() {
  return await withOracleDB(async (connection) => {
    // try {
    //     await connection.execute(`DROP TABLE DEMOTABLE`);
    // } catch(err) {
    //     console.log('Table might not exist, proceeding to create...');
    // }

    try {
      let sql = await fs.readFile("data/init.sql", "utf-8");

      // remove comments
      sql = sql.replace(/--.*$/gm, "");

      // split safely
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const stmt of statements) {
        await connection.execute(stmt);
      }

      await connection.commit(); // REQUIRED

      return true;
    } catch (err) {
      console.error("SQL execution failed:", err);
      return false;
    }
  }).catch(() => {
    return false;
  });
}

async function insertDemotable(id, name) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
      [id, name],
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function updateNameDemotable(oldName, newName) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
      [newName, oldName],
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function countDemotable() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`SELECT Count(*) FROM DEMOTABLE`);
    return result.rows[0][0];
  }).catch(() => {
    return -1;
  });
}

// query for insert (non-hardcoded)
// insertPreparationStep2:
async function insertPreparationStep2(
  newPreparationStepID,
  newPSDescription,
  newRequiredTemperature,
  newRecipeName
) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO PreparationStep2 
       (RecipeName, PreparationStepID, PSDescription, RequiredTemperature)
       VALUES (:recipeName, :stepID, :description, :temperature)`,
      {
        recipeName: newRecipeName,
        stepID: Number(newPreparationStepID),
        description: newPSDescription,
        temperature: Number(newRequiredTemperature),
      },
      { autoCommit: true }
    );

    return { success: result.rowsAffected > 0 };
  }).catch((err) => {
    if (err.errorNum === 2291) {
      if (err.message.includes("SYS_C002953117")) {
        return {
          success: false,
          message: "Invalid Recipe. Please enter an existing RecipeName.",
        };
      }

      if (err.message.includes("SYS_C002953118")) {
        return {
          success: false,
          message:
            "Invalid temperature. Please enter an existing RequiredTemperature.",
        };
      }

      return {
        success: false,
        message: "You have inserted an invalid value.",
      };
    }

    return {
      success: false,
      message: "Insertion error occurred.",
    };
  });
}

// query for update (non-hardcoded)
// updatePhotoTable: update any non-primary key attributes of selected photo (based on key)
// implementation details: only attributes that user gave new values for will change; for the others, must assign their "new" values to just be their old values
// Oracle doesn't support ON UPDATE CASCADE, but if the RecipeName is updated, this foreign key should be updated
async function updatePhotoTable(
  pID,
  newPDescription,
  newHeight,
  newWidth,
  newRecipeName
) {
  return await withOracleDB(async (connection) => {
    const current = await connection.execute(
      `SELECT PDescription, Height, Width, RecipeName FROM Photo WHERE PhotoID = :pID`,
      [parseInt(pID)]
    );

    if (current.rows.length === 0) {
      return false; // PhotoID not found
    }

    const [
      currentPDescription,
      currentHeight,
      currentWidth,
      currentRecipeName,
    ] = current.rows[0];

    const finalPDescription =
      newPDescription !== "" && newPDescription != null
        ? newPDescription
        : currentPDescription;
    const finalHeight =
      newHeight !== "" && newHeight != null
        ? parseFloat(newHeight)
        : currentHeight;
    const finalWidth =
      newWidth !== "" && newWidth != null ? parseFloat(newWidth) : currentWidth;
    const finalRecipeName =
      newRecipeName !== "" && newRecipeName != null
        ? newRecipeName
        : currentRecipeName;

    const result = await connection.execute(
      `UPDATE Photo SET PDescription = :finalPDescription, HEIGHT = :finalHeight, WIDTH = :finalWidth, RecipeName = :finalRecipeName WHERE PhotoID = :pID`,
      [
        finalPDescription,
        finalHeight,
        finalWidth,
        finalRecipeName,
        parseInt(pID),
      ],
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function selectRecipesTable(conditions) {
  return await withOracleDB(async (connection) => {
    const whereClauses = [];
    const bindParams = {};

    conditions.forEach((cond, index) => {
      const attr = cond.attribute;
      const op = cond.operator;
      const val = cond.value;
      const logical = cond.logical; // null for first row

      const bindName = `val${index}`;
      if (["Servings", "TotalTime", "AuthorID"].includes(attr)) {
        bindParams[bindName] = Number(val);
      } else {
        bindParams[bindName] = val;
      }

      if (index === 0) {
        // no logical for first row
        whereClauses.push(`${attr} ${op} :${bindName}`);
      } else {
        whereClauses.push(`${logical} ${attr} ${op} :${bindName}`);
      }
    });

    const query = `SELECT * FROM Recipe WHERE ${whereClauses.join(" ")}`;
    const result = await connection.execute(query, bindParams);

    return { success: true, data: result.rows };
  }).catch((error) => {
    console.error("Select Error:", error);
    return { success: false, message: error.message };
  });
}

/*
Query for delete (non-hardcoded)
deleteAuthor: delete any one tuple of author (based on primary key)
implementation details: 
    associated tuples in TrainsIn are deleted (result of cascade)
    Recipe entries can't be left without an AuthorID so only when applicable, delete both or update Recipe first
return:
    true on successful action
    false if primary key doesn't exist (blocked action)
    [{recipes}] if blocked by total participation constraints
*/
async function deleteAuthor(authorID) {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
        `DELETE FROM Author WHERE AuthorID = :authorID`,
        [authorID],
        { autoCommit: true }
      );

      if (!result.rowsAffected || result.rowsAffected === 0) {
        return { status: "not_found" }; // nothing deleted -> author doesn't exist
      }

      return { status: "deleted" }; // success
    } catch (err) {
      // likely FK constraint -> get blocking recipes
      const recipes = await showRecipesSoloedByAuthor(authorID, connection);
      return {
        status: "blocked",
        recipes: recipes,
      };
    }
  }).catch(() => ({ status: "error" }));
}

// helper for delete
async function showRecipesSoloedByAuthor(authorID, connection) {
  const result = await connection.execute(
    `SELECT RecipeName FROM Recipe WHERE AuthorID = :authorID`,
    [authorID]
  );

  return result.rows.map((row) => row[0]); // list of recipe names
}

// helper for delete
async function deleteAuthorAndRecipes(authorID) {
  return await withOracleDB(async (connection) => {
    // Delete child records of Recipe in dependency order before deleting recipes
    await connection.execute(
      `DELETE FROM Photo WHERE RecipeName IN (SELECT RecipeName FROM Recipe WHERE AuthorID = :authorID)`,
      [authorID]
    );
    await connection.execute(
      `DELETE FROM PreparationStep2 WHERE RecipeName IN (SELECT RecipeName FROM Recipe WHERE AuthorID = :authorID)`,
      [authorID]
    );
    await connection.execute(
      `DELETE FROM UsedIn WHERE RecipeName IN (SELECT RecipeName FROM Recipe WHERE AuthorID = :authorID)`,
      [authorID]
    );
    // Uses and Employs have ON DELETE CASCADE from Recipe, but delete explicitly to be safe
    await connection.execute(
      `DELETE FROM Uses WHERE RecipeName IN (SELECT RecipeName FROM Recipe WHERE AuthorID = :authorID)`,
      [authorID]
    );
    await connection.execute(
      `DELETE FROM Employs WHERE RecipeName IN (SELECT RecipeName FROM Recipe WHERE AuthorID = :authorID)`,
      [authorID]
    );
    // Now safe to delete recipes
    await connection.execute(
      `DELETE FROM Recipe WHERE AuthorID = :authorID`,
      [authorID]
    );
    // Finally delete the author (cascades TrainsIn automatically)
    const result = await connection.execute(
      `DELETE FROM Author WHERE AuthorID = :authorID`,
      [authorID],
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  }).catch((err) => {
    console.error("deleteAuthorAndRecipes error:", err);
    return false;
  });
}

// Query for projection (non-hardcoded)
// projectNutritionProfile: select any number of columns from the NP table and display only selected columns in the user-specified order
// implementation details: takes a list of columns as input and displays only these columns in the exact listed order
async function projectNutritionProfile(selectedCols) {
  return await withOracleDB(async (connection) => {
    const selectClause = selectedCols.join(", ");
    const result = await connection.execute(
      `SELECT ${selectClause}
            FROM NutritionProfile`
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

// joinTables function
async function joinTables(ingredientName) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT r.RecipeName, r.Servings, r.Cuisine, r.TotalTime, r.AuthorID,
              m.MeasurementID, m.Volume, m.NumberOf, m.Weight
       FROM Recipe r, UsedIn u, Measurement m
       WHERE r.RecipeName = u.RecipeName
         AND u.MeasurementID = m.MeasurementID
         AND UPPER(u.IngredientName) = UPPER(:ingredientName)`,
      { ingredientName }
    );
    return { success: true, data: result.rows };
  }).catch((err) => {
    console.error("Join error:", err);
    return { success: false, message: err.message };
  });
}

// Query for nested aggregation with GROUP BY
async function nestedAggregation() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT U.RecipeName, COUNT(U.EquipmentID) AS NumEquipment
            FROM Uses U
            GROUP BY U.RecipeName
            HAVING COUNT(U.EquipmentID) <= ALL (
              SELECT COUNT(U2.EquipmentID)
              FROM Uses U2
              GROUP BY U2.RecipeName)`
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

// Query for aggregation with GROUP BY (hard coded)
// creates groups of recipes based on their total count for each cuisine type
async function aggregationGroupBy() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT R.Cuisine, COUNT(*) AS CuisineCount FROM Recipe R GROUP BY R.Cuisine`
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

// Query for aggregation with HAVING (hard coded)
// aggregationHaving: find all ingredient types that have an average of at least 2g of protein
/* 'SELECT i.IngredientType AS IngredientType, AVG(n.Protein) as AverageProteinPerServing
 FROM Ingredient i NATURAL JOIN NutritionProfile n 
 GROUPBY i.IngredientType
 HAVING AVG(n.Protein) >= 2'
*/
async function aggregationHaving() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT i.IngredientType, AVG(n.Protein) as AverageProteinPerServing 
            FROM Ingredient i JOIN NutritionProfile n ON i.NutritionProfileID = n.NutritionProfileID
            GROUP BY i.IngredientType 
             HAVING AVG(n.Protein) >= 2`
    );
    return result.rows;
  }).catch(() => {
    return [];
  });
}

// Query for nested aggregation with GROUP BY
// TODO

// Query for division
async function division() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT DISTINCT a.FirstName, a.LastName, a.Email
       FROM Author a
       WHERE NOT EXISTS (
         (SELECT TechniqueName FROM CookingTechnique2)
         MINUS
         (SELECT t.TechniqueName
          FROM TrainsIn t
          WHERE t.AuthorID = a.AuthorID)
       )`
    );
    return { success: true, data: result.rows };
  }).catch((err) => {
    console.error("Division error:", err);
    return { success: false, message: err.message };
  });
}

async function fetchCookingTechniqueTableFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT * FROM CookingTechnique2");
    return result.rows;
  }).catch(() => {
    return [];
  });
}

module.exports = {
  testOracleConnection,
  fetchDemotableFromDb,
  fetchAuthorTableFromDb,
  fetchPhotoTableFromDb,
  fetchRecipeTableFromDb,
  fetchRecipeNamesFromDb,
  fetchPreparationStep2FromDb,
  fetchMeasurementTableFromDb,
  fetchUsedInTableFromDb,
  initiateTables,
  insertDemotable,
  updateNameDemotable,
  updatePhotoTable,
  deleteAuthor,
  deleteAuthorAndRecipes,
  countDemotable,
  projectNutritionProfile,
  joinTables,
  nestedAggregation,
  aggregationHaving,
  insertPreparationStep2,
  fetchValidRequiredTemperatures,
  selectRecipesTable,
  aggregationGroupBy,
  division,
  fetchCookingTechniqueTableFromDb,
  fetchPhotoIDsFromDb,
};
