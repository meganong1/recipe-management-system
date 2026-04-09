/*
 * These functions below are for various webpage functionalities.
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 *
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your
 *   backend endpoints
 * and
 *   HTML structure.
 *
 */

// This function checks the database connection and updates its status on the frontend.

async function checkDbConnection() {
  const statusElem = document.getElementById("dbStatus");
  const loadingGifElem = document.getElementById("loadingGif");

  // If these elements don't exist on this page, skip
  if (!statusElem || !loadingGifElem) return;

  const response = await fetch("/check-db-connection", {
    method: "GET",
  });

  // Hide the loading GIF once the response is received.
  loadingGifElem.style.display = "none";
  // Display the statusElem's text in the placeholder.
  statusElem.style.display = "inline";

  response
    .text()
    .then((text) => {
      statusElem.textContent = text;
    })
    .catch((error) => {
      statusElem.textContent = "connection timed out"; // Adjust error handling if required.
    });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
  const tableElement = document.getElementById("demotable");
  const tableBody = tableElement.querySelector("tbody");

  const response = await fetch("/demotable", {
    method: "GET",
  });

  const responseData = await response.json();
  const demotableContent = responseData.data;

  // Always clear old, already fetched data before new fetching process.
  if (tableBody) {
    tableBody.innerHTML = "";
  }

  demotableContent.forEach((user) => {
    const row = tableBody.insertRow();
    user.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

async function fetchAndDisplayAuthors() {
  const tableElement = document.getElementById("author-table");
  const tableBody = tableElement.querySelector("tbody");

  const response = await fetch("/author-table", {
    method: "GET",
  });

  const responseData = await response.json();
  const authorTableContent = responseData.data;

  if (tableBody) {
    tableBody.innerHTML = "";
  }

  authorTableContent.forEach((author) => {
    const row = tableBody.insertRow();
    author.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

async function fetchAndDisplayPhotos() {
  const tableElement = document.getElementById("phototable");
  const tableBody = tableElement.querySelector("tbody");

  const response = await fetch("/photo-table", {
    method: "GET",
  });

  const responseData = await response.json();
  const photoTableContent = responseData.data;

  if (tableBody) {
    tableBody.innerHTML = "";
  }

  photoTableContent.forEach((photo) => {
    const row = tableBody.insertRow();
    photo.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

async function fetchAndDisplayRecipes(recipeData = null) {
  const tableElement = document.getElementById("recipeSelectTable");
  const tableBody = tableElement.querySelector("tbody");

  let recipeContent = recipeData;

  if (!recipeContent) {
    const response = await fetch("/recipe-table", {
      method: "GET",
    });

    const responseData = await response.json();
    recipeContent = responseData.data;
  }

  if (tableBody) {
    tableBody.innerHTML = "";
  }

  recipeContent.forEach((recipe) => {
    const row = tableBody.insertRow();
    recipe.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

async function fetchAndDisplayUsedIn() {
  const tableElement = document.getElementById("usedInTable");
  const tableBody = tableElement.querySelector("tbody");

  const response = await fetch("/used-in-table", {
    method: "GET",
  });

  const responseData = await response.json();
  const usedInTableContent = responseData.data;

  if (tableBody) {
    tableBody.innerHTML = "";
  }

  usedInTableContent.forEach((tuple) => {
    const row = tableBody.insertRow();
    tuple.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

async function fetchAndDisplayJoin() {
  const tableElement = document.getElementById("joinTable");
  const tableBody = tableElement.querySelector("tbody");

  const response = await fetch("/join-tables", {
    method: "GET",
  });

  const responseData = await response.json();
  const joinTableContent = responseData.data;

  if (tableBody) {
    tableBody.innerHTML = "";
  }

  joinTableContent.forEach((recipe) => {
    const row = tableBody.insertRow();
    recipe.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

// This function resets or initializes the demotable.
async function resetTables() {
  const response = await fetch("/initiate-tables", {
    method: "POST",
  });
  const responseData = await response.json();

  if (responseData.success) {
    const messageElement = document.getElementById("resetResultMsg");
    messageElement.textContent = "Tables initiated successfully!";
    // fetchTableData();
  } else {
    alert("Error initiating tables!");
  }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
  event.preventDefault();

  const idValue = document.getElementById("insertId").value;
  const nameValue = document.getElementById("insertName").value;

  const response = await fetch("/insert-demotable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: idValue,
      name: nameValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("insertResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Data inserted successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error inserting data!";
  }
}
// Insert new records into PreparationStep2 table

async function insertPreparationStep2(event) {
  event.preventDefault();

  const newPreparationStepIDValue = document.getElementById(
    "insertPreparationStepID"
  ).value;
  const newPSDescriptionValue = document.getElementById(
    "insertPSDescription"
  ).value;
  const newRequiredTemperatureValue = document.getElementById(
    "insertRequiredTemperature"
  ).value;
  const newRecipeNameValue = document.getElementById("insertRecipeName").value;

  const response = await fetch("/insert-PreparationStep2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newPreparationStepID: newPreparationStepIDValue,
      newPSDescription: newPSDescriptionValue,
      newRequiredTemperature: newRequiredTemperatureValue,
      newRecipeName: newRecipeNameValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("insertPreparationStep2Msg");

  if (responseData.success) {
    messageElement.textContent = "Values inserted successfully!";
    document.getElementById("insertPreparationStep2").reset();
    fetchAndDisplayPreparationStep2();
  } else {
    messageElement.textContent =
      responseData.message || "Error inserting values!";
  }
}
// Updates names in the demotable.
async function updateNameDemotable(event) {
  event.preventDefault();

  const oldNameValue = document.getElementById("updateOldName").value;
  const newNameValue = document.getElementById("updateNewName").value;

  const response = await fetch("/update-name-demotable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldName: oldNameValue,
      newName: newNameValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("updateNameResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Name updated successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error updating name!";
  }
}

async function loadRecipeNames() {
  const response = await fetch("/recipe-names", { method: "GET" });
  const data = await response.json();
  const select = document.getElementById("updateRecipeName");
  if (!select) return;
  data.data.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

async function loadPhotoIDs() {
  const response = await fetch("/photo-ids", { method: "GET" });
  const data = await response.json();
  const select = document.getElementById("updatePhotoID");
  if (!select) return;
  data.data.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

// Updates names in the photo table.
async function updatePhotoTable(event) {
  event.preventDefault();

  const pIDValue = document.getElementById("updatePhotoID").value;
  const newPDescriptionValue =
    document.getElementById("updatePDescription").value;
  const newHeightValue = document.getElementById("updateNewHeight").value;
  const newWidthValue = document.getElementById("updateNewWidth").value;
  const newRecipeNameValue = document.getElementById("updateRecipeName").value;

  const response = await fetch("/update-photo-table", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pID: pIDValue,
      newPDescription: newPDescriptionValue,
      newHeight: newHeightValue,
      newWidth: newWidthValue,
      newRecipeName: newRecipeNameValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("updatePhotoResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Values updated successfully!";
    fetchAndDisplayPhotos();
  } else {
    messageElement.textContent = "Error updating values!";
  }
}

async function fetchAndDisplayNP() {
  const tableElement = document.getElementById("np-table");
  const tableBody = tableElement.querySelector("tbody");

  const response = await fetch("/np-table", {
    method: "GET",
  });

  const responseData = await response.json();
  const photoTableContent = responseData.data;

  if (tableBody) {
    tableBody.innerHTML = "";
  }

  photoTableContent.forEach((photo) => {
    const row = tableBody.insertRow();
    photo.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

// Deletes an author from author table
async function deleteAuthor(event) {
  event.preventDefault();

  const deleteAIDvalue = document.getElementById("deleteAuthorID").value;
  const messageElement = document.getElementById("deleteAuthorResultMsg");

  const response = await fetch("/delete-author", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorID: deleteAIDvalue }),
  });

  const responseData = await response.json();

  if (response.status === 404) {
    messageElement.textContent = "Please enter a valid AuthorID.";
    return;
  }

  if (responseData.success) {
    messageElement.textContent = "Author successfully deleted!";
    fetchAndDisplayAuthors();
    return;
  }

  if (responseData.blocked) {
    const recipesList = responseData.recipes.join(", ");
    messageElement.innerHTML =
      `If you delete this author from the database, there will be no author for the following recipes: <strong>${recipesList}</strong><br><br>` +
      `Please press the confirm button below to delete both the author and all their recipes, or update the author for the mentioned recipes first.<br><br>` +
      `<button id="confirmDeleteBtn">Confirm Delete</button>`;

    document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
      const forceResponse = await fetch("/delete-author", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorID: deleteAIDvalue, forceDelete: true }),
      });

      const forceData = await forceResponse.json();

      if (forceData.success) {
        messageElement.textContent = "Author and all their recipes have been deleted.";
        fetchAndDisplayAuthors();
      } else {
        messageElement.textContent = "Error deleting author and recipes.";
      }
    });

    return;
  }

  if (responseData.message === "Author not found") {
    messageElement.textContent = "Please enter a valid AuthorID.";
    return;
  }

  messageElement.textContent = "Error occurred. Please try again.";
}

// select recipe from recipe table
async function selectRecipeTable(event) {
  event.preventDefault();

  const rows = document.querySelectorAll(
    "#conditions-container .condition-row"
  );
  const conditions = [];

  rows.forEach((row, index) => {
    const selects = row.querySelectorAll("select");
    const input = row.querySelector("input");

    let logical = null; // stores AND and OR, default is NULL
    let attribute;
    let operator;

    if (selects.length === 3) {
      logical = selects[0].value;
      attribute = selects[1].value;
      operator = selects[2].value;
    } else {
      // first row only
      attribute = selects[0].value;
      operator = selects[1].value;
    }

    conditions.push({
      logical: index === 0 ? null : logical,
      attribute,
      operator,
      value: input.value,
    });
  });

  const response = await fetch("/select-recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conditions }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("selectRecipeoResultMsg");

  if (responseData.success) {
    if (responseData.data.length === 0) {
      messageElement.textContent = "No matching recipes found.";
      fetchAndDisplayRecipes([]);
    } else {
      messageElement.textContent = "Values selected successfully!";
      fetchAndDisplayRecipes(responseData.data);
    }
  } else {
    messageElement.textContent =
      responseData.message || "Error selecting values!";
  }
}

// TODO
// projectNutritionProfile
// projects columns in the nutrition profile table.
async function projectNPTable(event) {
  event.preventDefault();

  const col1 = document.getElementById("projectcol1").value;
  const col2 = document.getElementById("projectcol2").value;
  const col3 = document.getElementById("projectcol3").value;
  const col4 = document.getElementById("projectcol4").value;
  const col5 = document.getElementById("projectcol5").value;
  const messageElement = document.getElementById("projectNPResultMsg");

  const selectedCols = [col1];
  // col1 is a required field

  if (col2 != "") selectedCols.push(col2);
  if (col3 != "") selectedCols.push(col3);
  if (col4 != "") selectedCols.push(col4);
  if (col5 != "") selectedCols.push(col5);

  const allowedCols = [
    "NutritionProfileID",
    "Calories",
    "Carbohydrates",
    "Fats",
    "Protein",
  ];
  for (const col of selectedCols) {
    if (!allowedCols.includes(col)) {
      messageElement.textContent = `Invalid column name(s). Please choose from: NutritionProfileID, Calories, Carbohydrates, Fats, Protein.`;
      return;
    }
  }

  const uniqueCols = new Set(selectedCols);
  if (uniqueCols.size !== selectedCols.length) {
    messageElement.textContent =
      "Duplicate columns are not allowed. Please use another column name.";
    return;
  }

  const response = await fetch("/project-np-table", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selectedCols,
    }),
  });

  const responseData = await response.json();

  if (responseData.success) {
    messageElement.textContent = "Values projected successfully!";

    const tableElement = document.getElementById("np-table");
    const tableHead = tableElement.querySelector("thead");
    const tableBody = tableElement.querySelector("tbody");

    tableHead.innerHTML = "";
    const headerRow = tableHead.insertRow();
    responseData.columns.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    });

    tableBody.innerHTML = "";
    responseData.data.forEach((np) => {
      const row = tableBody.insertRow();
      np.forEach((field, index) => {
        const cell = row.insertCell(index);
        cell.textContent = field;
      });
    });
  } else {
    messageElement.textContent = "Error projecting values!";
  }
}

// joins recipe, usedin, measurement and finds all recipes/measurements with a certain ingredient.
async function joinTables(event) {
  event.preventDefault();

  const joinIngredientValue = document.getElementById("joinIngredient").value;

  const response = await fetch(`/join-tables?ingredientName=${encodeURIComponent(joinIngredientValue)}`, {
    method: "GET",
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("joinResultMsg");

  if (responseData.success && responseData.data.length > 0) {
    messageElement.textContent = "Here are recipes you can try using your ingredient:";
    
    const tableElement = document.getElementById("joinTable");
    const tableBody = tableElement.querySelector("tbody");
    tableBody.innerHTML = "";
    responseData.data.forEach((row) => {
      const tableRow = tableBody.insertRow();
      row.forEach((field, index) => {
        const cell = tableRow.insertCell(index);
        cell.textContent = field;
      });
    });

  } else {
    messageElement.textContent = "Please enter a valid ingredient name. Make sure it exactly matches a name in the Ingredient table!";
  }
}

// Aggregation with GROUP BY.
async function aggrGroupBy(event) {
  event.preventDefault();

  const response = await fetch("/aggregation-group-by");
  const responseData = await response.json();
  const messageElement = document.getElementById("aggrGroupByResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Successful!";
    const tableElement = document.getElementById("aggrGroupByTable");
    const tableHead = tableElement.querySelector("thead");
    const tableBody = tableElement.querySelector("tbody");

    tableHead.innerHTML = "";
    const headerRow = tableHead.insertRow();
    responseData.columns.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    });

    tableBody.innerHTML = "";
    responseData.data.forEach((np) => {
      const row = tableBody.insertRow();
      np.forEach((field, index) => {
        const cell = row.insertCell(index);
        cell.textContent = field;
      });
    });
  } else {
    messageElement.textContent = "Error!";
  }
}

// Aggregation with HAVING.
async function aggrHaving(event) {
  event.preventDefault();

  const response = await fetch("/aggregation-having");
  const responseData = await response.json();
  const messageElement = document.getElementById("aggrHavingResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Successful!";
    const tableElement = document.getElementById("aggrHavingTable");
    const tableHead = tableElement.querySelector("thead");
    const tableBody = tableElement.querySelector("tbody");

    tableHead.innerHTML = "";
    const headerRow = tableHead.insertRow();
    responseData.columns.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    });

    tableBody.innerHTML = "";
    responseData.data.forEach((np) => {
      const row = tableBody.insertRow();
      np.forEach((field, index) => {
        const cell = row.insertCell(index);
        cell.textContent = field;
      });
    });
  } else {
    messageElement.textContent = "Error!";
  }
}

// nested aggregation with GROUP BY
async function nestedAggregation(event) {
  event.preventDefault();

  const response = await fetch("/nested-aggregation");
  const responseData = await response.json();
  const messageElement = document.getElementById("nestedAggrResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Successful!";
    const tableElement = document.getElementById("nestedAggrTable");
    const tableHead = tableElement.querySelector("thead");
    const tableBody = tableElement.querySelector("tbody");

    tableHead.innerHTML = "";
    const headerRow = tableHead.insertRow();
    responseData.columns.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    });

    tableBody.innerHTML = "";
    responseData.data.forEach((np) => {
      const row = tableBody.insertRow();
      np.forEach((field, index) => {
        const cell = row.insertCell(index);
        cell.textContent = field;
      });
    });
  } else {
    messageElement.textContent = "Error!";
  }
}

// division
async function division(event) {
  event.preventDefault();

  const response = await fetch("/division", {
    method: "GET",
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("divisionResultMsg");
  const tableElement = document.getElementById("divisionTable");

  if (responseData.success) {
    if (responseData.data.length === 0) {
      messageElement.textContent = "No authors are trained in every cooking technique.";
      tableElement.style.display = "none";
    } else {
      messageElement.textContent = "Successful!";
      tableElement.style.display = "";

      const tableHead = tableElement.querySelector("thead");
      const tableBody = tableElement.querySelector("tbody");

      tableHead.innerHTML = "";
      const headerRow = tableHead.insertRow();
      responseData.columns.forEach((col) => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      });

      tableBody.innerHTML = "";
      responseData.data.forEach((row) => {
        const tableRow = tableBody.insertRow();
        row.forEach((field, index) => {
          const cell = tableRow.insertCell(index);
          cell.textContent = field;
        });
      });
    }
  } else {
    messageElement.textContent = "Error running division query!";
    tableElement.style.display = "none";
  }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
  const response = await fetch("/count-demotable", {
    method: "GET",
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("countResultMsg");

  if (responseData.success) {
    const tupleCount = responseData.count;
    messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
  } else {
    alert("Error in count demotable!");
  }
}

async function fetchAndDisplayValidTemperatures() {
  const msgElement = document.getElementById("validTemperatureMsg");
  if (!msgElement) return;

  const response = await fetch("/valid-required-temperatures", {
    method: "GET",
  });

  const responseData = await response.json();
  const temperatures = responseData.data.map((row) => row[0]);

  msgElement.textContent =
    "Valid RequiredTemperature values: " + temperatures.join(", ");
}

async function fetchAndDisplayPreparationStep2() {
  const tableElement = document.getElementById("preparationStepTable");
  if (!tableElement) return;

  const tableBody = tableElement.querySelector("tbody");

  const response = await fetch("/preparation-step-table", {
    method: "GET",
  });

  const responseData = await response.json();
  const tableContent = responseData.data;

  tableBody.innerHTML = "";

  tableContent.forEach((rowData) => {
    const row = tableBody.insertRow();
    rowData.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}
// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
  checkDbConnection();

  const resetBtn = document.getElementById("resetTables");
  if (resetBtn) resetBtn.addEventListener("click", resetTables);

  const updateBtn = document.getElementById("updatePhotoTable");
  if (updateBtn) {
    updateBtn.addEventListener("submit", updatePhotoTable);
    fetchAndDisplayPhotos();
    loadRecipeNames();
    loadPhotoIDs();
  }

  const projectBtn = document.getElementById("projectNPTable");
  if (projectBtn) {
    projectBtn.addEventListener("submit", projectNPTable);
  }

  const deleteAuthorForm = document.getElementById("deleteAuthor");
  if (deleteAuthorForm) {
    deleteAuthorForm.addEventListener("submit", deleteAuthor);
    fetchAndDisplayAuthors(); // only runs on pages that have this form
    loadRecipeNames();
  }

  const selectRecipeForm = document.getElementById("selectRecipe");
  if (selectRecipeForm) {
    selectRecipeForm.addEventListener("submit", selectRecipeTable);
  }

  const insertPreparationStep2Form = document.getElementById(
    "insertPreparationStep2"
  );
  if (insertPreparationStep2Form) {
    insertPreparationStep2Form.addEventListener(
      "submit",
      insertPreparationStep2
    );
    fetchAndDisplayPreparationStep2();
    fetchAndDisplayValidTemperatures();
  }

  const aggrGroupByButton = document.getElementById("aggrGroupByButton");
  if (aggrGroupByButton) {
    aggrGroupByButton.addEventListener("click", aggrGroupBy);
  }

  const aggrHavingButton = document.getElementById("aggrHavingButton");
  if (aggrHavingButton) {
    aggrHavingButton.addEventListener("click", aggrHaving);
  }
  
  const joinBtn = document.getElementById("joinTables");
  if (joinBtn) {
      joinBtn.addEventListener("submit", joinTables);
      fetchAndDisplayUsedIn();
  }

  const nestedAggrButton = document.getElementById("nestedAggrButton");
  if (nestedAggrButton) {
    nestedAggrButton.addEventListener("click", nestedAggregation);
  }

  const divisionButton = document.getElementById("divisionButton");
  if (divisionButton) {
    divisionButton.addEventListener("click", division);
  }
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
  // fetchAndDisplayUsers();
}
