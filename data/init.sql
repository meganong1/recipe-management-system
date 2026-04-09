DROP TABLE TrainsIn;
DROP TABLE Employs;
DROP TABLE UsedIn;
DROP TABLE Uses;
DROP TABLE PreparationStep2;
DROP TABLE Photo;
DROP TABLE Recipe;

DROP TABLE Electric2;
DROP TABLE Manual2;
DROP TABLE CookingTechnique2;

DROP TABLE Ingredient;

DROP TABLE PreparationStep1;
DROP TABLE Electric1;
DROP TABLE Manual1;
DROP TABLE CookingTechnique1;

DROP TABLE Measurement;
DROP TABLE NutritionProfile;
DROP TABLE Author;

CREATE TABLE Author (
	AuthorID	INT PRIMARY KEY,
	FirstName	VARCHAR(20),
	LastName	VARCHAR(20),
	Email		VARCHAR(20));
GRANT SELECT ON Author TO PUBLIC;
-- NOTE: For this relation, we cannot enforce the total participation constraint in the ER diagram between Author and Recipe without assertions in SQL.

CREATE TABLE NutritionProfile (
	NutritionProfileID	INT PRIMARY KEY,
	Calories			INT,
	Carbohydrates		INT,
	Fats				INT,
	Protein				INT);
GRANT SELECT ON NutritionProfile TO PUBLIC;

CREATE TABLE Ingredient (
	IngredientName			VARCHAR(20) PRIMARY KEY,
	AllergenInformation 	VARCHAR(250),
	Seasonality				CHAR(6),
	IngredientType			VARCHAR(20),
	NutritionProfileID		INT UNIQUE,
	FOREIGN KEY (NutritionProfileID) REFERENCES NutritionProfile(NutritionProfileID)
		ON DELETE SET NULL);
GRANT SELECT ON Ingredient TO PUBLIC;
-- NOTE: For this relation, we cannot enforce the total participation constraint in the ER diagram between Ingredient and UsedIn with assertions in SQL.
-- NOTE: Set the FK field to null if FK is deleted because the field isn’t constrained by not null or total participation between this relation and the FK’s relation.

CREATE TABLE CookingTechnique1 (
	HeatSource		VARCHAR(20) PRIMARY KEY,
	DryOrMoistHeat 	VARCHAR(5));
GRANT SELECT ON CookingTechnique1 TO PUBLIC;

CREATE TABLE CookingTechnique2 (
	TechniqueName		VARCHAR(20) PRIMARY KEY,
	DifficultyRating	INT,
	HeatSource			VARCHAR(20),
	FOREIGN KEY (HeatSource) REFERENCES CookingTechnique1(HeatSource)
		ON DELETE SET NULL);
GRANT SELECT ON CookingTechnique2 TO PUBLIC;
-- NOTE: Set the FK field to null if FK is deleted because the field isn’t constrained by not null or total participation between this relation and the FK’s relation.

CREATE TABLE Electric1 (
	MotorRPM	INT,
	Torque 		FLOAT,
	Wattage		INT,
	PRIMARY KEY (MotorRPM, Torque));
GRANT SELECT ON Electric1 TO PUBLIC;

CREATE TABLE Electric2 (
	EquipmentID			INT PRIMARY KEY,
	EquipmentName 		VARCHAR(20),
	EDescription		VARCHAR(500),
	MaintenanceLevel	NUMERIC(1,0),
	MotorRPM			INT,
	Torque 				FLOAT,
	FOREIGN KEY (MotorRPM, Torque) REFERENCES Electric1(MotorRPM, Torque)
		ON DELETE SET NULL);
GRANT SELECT ON Electric2 TO PUBLIC;
-- NOTE: Set the FK field to null if FK is deleted because the field isn’t constrained by not null or total participation between this relation and the FK’s relation.

CREATE TABLE Manual1 (
	EquipmentName   	VARCHAR(20) PRIMARY KEY,
	ErgonomicRating   	INT);
GRANT SELECT ON Manual1 TO PUBLIC;

CREATE TABLE Manual2 (
	EquipmentID			INT PRIMARY KEY, 
	EquipmentName		VARCHAR(20),
	EDescription		VARCHAR(500),
	MaintenanceLevel	NUMERIC(1, 0),
	ErgonomicRating		NUMERIC(1, 0),
	FOREIGN KEY (EquipmentName) REFERENCES Manual1(EquipmentName) 
		ON DELETE SET NULL);
GRANT SELECT ON Manual2 TO PUBLIC;
-- NOTE: Set the FK field to null if FK is deleted because the field isn’t constrained by not null or total participation between this relation and the FK’s relation.

CREATE TABLE Recipe (
	RecipeName		VARCHAR(20) PRIMARY KEY,
	Servings		FLOAT,
	Cuisine			VARCHAR(20),
	TotalTime		FLOAT,
	AuthorID		INT NOT NULL,
	FOREIGN KEY (AuthorID) REFERENCES Author(AuthorID));
GRANT SELECT ON Recipe TO PUBLIC;
-- NOTE: For this relation, we cannot enforce the total participation constraint in the ER diagram between Recipe and UsedIn with assertions in SQL.
-- NOTE: Since this relation is bound by a total participation constraint, the FK value is not allowed to be deleted until its field here is replaced. No action is taken by default.

CREATE TABLE PreparationStep1 (
	RequiredTemperature		FLOAT PRIMARY KEY,
	Duration				FLOAT);
GRANT SELECT ON PreparationStep1 TO PUBLIC;

CREATE TABLE PreparationStep2 (
	RecipeName				VARCHAR(20),
	PreparationStepID		INT,
	PSDescription			VARCHAR(500),
	RequiredTemperature		FLOAT,
	PRIMARY KEY (RecipeName, PreparationStepID),
	FOREIGN KEY (RecipeName) REFERENCES Recipe(RecipeName),
	FOREIGN KEY (RequiredTemperature) REFERENCES PreparationStep1(RequiredTemperature)
		ON DELETE SET NULL);
GRANT SELECT ON PreparationStep2 TO PUBLIC;
-- NOTE: Since this relation is bound by a total participation constraint, the first FK value is not allowed to be deleted until its field here is replaced. No action is taken by default.
-- NOTE: Set the second FK field to null if FK is deleted because the field isn’t constrained by not null or total participation between this relation and the FK’s relation.

CREATE TABLE Uses (
	RecipeName		VARCHAR(20),
	EquipmentID		INT,
	PRIMARY KEY (RecipeName, EquipmentID),
	FOREIGN KEY (RecipeName) REFERENCES Recipe(RecipeName)
		ON DELETE CASCADE,
	FOREIGN KEY (EquipmentID) REFERENCES Electric2(EquipmentID)
		ON DELETE CASCADE,
	FOREIGN KEY (EquipmentID) REFERENCES Manual2(EquipmentID)
		ON DELETE CASCADE);
GRANT SELECT ON Uses TO PUBLIC;
-- NOTE: Since each FK is not allowed to be null (either explicitly set manually or implicitly set by property of PK) and is not constrained by a total participation constraint, the corresponding tuple of this relation should be deleted if a FK tuple is deleted.

CREATE TABLE Photo (
	PhotoID        	INT PRIMARY KEY,
	PDescription 	VARCHAR(500),
	HEIGHT       	FLOAT,
	WIDTH         	FLOAT,
	RecipeName 		VARCHAR(20) NOT NULL, 
	FOREIGN KEY (RecipeName) REFERENCES Recipe(RecipeName));
GRANT SELECT ON Photo TO PUBLIC;
-- NOTE: Since this relation is bound by a total participation constraint, the FK value is not allowed to be deleted until its field here is replaced. No action is taken by default.

CREATE TABLE Measurement (
	MeasurementID	INT PRIMARY KEY,
	Volume			FLOAT,
	NumberOf		INT,
	Weight			FLOAT);
GRANT SELECT ON Measurement TO PUBLIC;
-- NOTE: For this relation, we cannot enforce the total participation constraint in the ER diagram between Measurement and UsedIn without assertions in SQL.

CREATE TABLE UsedIn (
	RecipeName		VARCHAR(20),
	IngredientName	VARCHAR(20),
	MeasurementID	INT,
	PRIMARY KEY (RecipeName, IngredientName, MeasurementID),
	FOREIGN KEY (RecipeName) REFERENCES Recipe(RecipeName),
	FOREIGN KEY (IngredientName) REFERENCES Ingredient(IngredientName),
	FOREIGN KEY (MeasurementID) REFERENCES Measurement(MeasurementID));
GRANT SELECT ON UsedIn TO PUBLIC;
-- NOTE: For the UsedIn relation, we cannot enforce the total participation constraints in the ER diagram between Recipe, Ingredient, and Measurement without assertions in SQL. 
-- NOTE: Since this relation is bound by a total participation constraint for each FK, no FK value is allowed to be deleted until its field here is replaced. No action is taken by default.

CREATE TABLE Employs (
	RecipeName		VARCHAR(20),
	TechniqueName	VARCHAR(20),
	PRIMARY KEY (RecipeName, TechniqueName),
	FOREIGN KEY (RecipeName) REFERENCES Recipe(RecipeName)
		ON DELETE CASCADE,
	FOREIGN KEY (TechniqueName) REFERENCES CookingTechnique2(TechniqueName)
		ON DELETE CASCADE);
GRANT SELECT ON Employs TO PUBLIC;
-- NOTE: Since each FK is not allowed to be null (either explicitly set manually or implicitly set by property of PK) and is not constrained by a total participation constraint, the corresponding tuple of this relation should be deleted if a FK tuple is deleted.

CREATE TABLE TrainsIn (
	AuthorID		INT,
	TechniqueName	VARCHAR(20),
	PRIMARY KEY (AuthorID, TechniqueName),
	FOREIGN KEY (AuthorID) REFERENCES Author(AuthorID)
		ON DELETE CASCADE,
	FOREIGN KEY (TechniqueName) REFERENCES CookingTechnique2(TechniqueName)
		ON DELETE CASCADE);
GRANT SELECT ON TrainsIn TO PUBLIC;
-- NOTE: Since each FK is not allowed to be null (either explicitly set manually or implicitly set by property of PK) and is not constrained by a total participation constraint, the corresponding tuple of this relation should be deleted if a FK tuple is deleted.

-----------------------------------------------------

INSERT INTO Author VALUES (1, 'Nigella', 'Lawson', 'nlawson@chefs.com');
INSERT INTO Author VALUES (2, 'Guy', 'Fieri', 'gfieri@chefs.com');
INSERT INTO Author VALUES (3, 'Romain', 'Avril', 'ravril@chefs.com');
INSERT INTO Author VALUES (4, 'Keith', 'Pears', 'kpears@chefs.com');
INSERT INTO Author VALUES (5, 'Ina', 'Garten', 'igarten@chefs.com');
INSERT INTO Author VALUES (6, 'Gordon', 'Ramsay', 'gramsay@chefs.com');
INSERT INTO Author VALUES (7, 'Julia', 'Child', 'jchild@chefs.com');
INSERT INTO Author VALUES (8, 'Jamie', 'Oliver', 'joliver@chefs.com');
INSERT INTO Author VALUES (9, 'Yotam', 'Ottolenghi', 'yotto@chefs.com');

INSERT INTO NutritionProfile VALUES (1, 55, 11, 1, 4);
INSERT INTO NutritionProfile VALUES (2, 20, 5, 0, 1);
INSERT INTO NutritionProfile VALUES (3, 40, 9, 1, 2);
INSERT INTO NutritionProfile VALUES (4, 22, 4, 1, 2);
INSERT INTO NutritionProfile VALUES (5, 32, 7, 0, 2);
INSERT INTO NutritionProfile VALUES (6, 150, 12, 8, 8);
INSERT INTO NutritionProfile VALUES (7, 250, 0, 18, 26);
INSERT INTO NutritionProfile VALUES (8, 180, 0, 14, 19);
INSERT INTO NutritionProfile VALUES (9, 70, 15, 1, 3);
INSERT INTO NutritionProfile VALUES (10, 45, 10, 0, 1);
INSERT INTO NutritionProfile VALUES (11, 90, 20, 0, 2);

INSERT INTO Ingredient VALUES ('Broccoli', 'Could induce symptoms of food allergy in sensitised individuals.', 
    'Autumn', 'Vegetable', 1);
INSERT INTO Ingredient VALUES ('Lemon', 'Citrus seed extracts display antigenic profiles.', 
    'Winter', 'Fruit', 2);
INSERT INTO Ingredient VALUES ('Chili Pepper', 'Allergy to the spice dust is rare.', 
    'Autumn', 'Vegetable', 3);
INSERT INTO Ingredient VALUES ('Parsley', 'Symptoms of urticaria and anaphylaxis have been described.',
    'Autumn', 'Vegetable', 4);
INSERT INTO Ingredient VALUES ('Scallion', 'Onion handling can induce rhinoconjunctivitis and asthma.',
    'Spring', 'Vegetable', 5);
INSERT INTO Ingredient VALUES ('Milk', 'The major allergens are casein, alpha-lactalbumin, and beta-lactoglobulin.',
    'All   ', 'Dairy', 6);
INSERT INTO Ingredient VALUES ('Chicken', 'May contain traces of poultry allergens.',
    'All   ', 'Meat', 7);
INSERT INTO Ingredient VALUES ('Salmon', 'Contains fish allergens.',
    'Summer', 'Fish', 8);
INSERT INTO Ingredient VALUES ('Tomato', 'Rarely causes oral allergy syndrome.',
    'Summer', 'Vegetable', 9);
INSERT INTO Ingredient VALUES ('Garlic', 'May cause contact dermatitis in sensitive individuals.',
    'All   ', 'Vegetable', 10);
INSERT INTO Ingredient VALUES ('Rice', 'Generally well tolerated.',
    'All   ', 'Grain', 11);
 
INSERT INTO CookingTechnique1 VALUES ('Hot Air', 'Dry');
INSERT INTO CookingTechnique1 VALUES ('Fat/Oil', 'Dry');
INSERT INTO CookingTechnique1 VALUES ('Water Vapor', 'Moist');
INSERT INTO CookingTechnique1 VALUES ('Water', 'Moist');
INSERT INTO CookingTechnique1 VALUES ('Radiant/Direct', 'Dry');
INSERT INTO CookingTechnique1 VALUES ('Liquid', 'Moist');
 
INSERT INTO CookingTechnique2 VALUES ('Roasting', 3, 'Hot Air');
INSERT INTO CookingTechnique2 VALUES ('Baking', 2, 'Hot Air');
INSERT INTO CookingTechnique2 VALUES ('Deep-frying', 2, 'Fat/Oil');
INSERT INTO CookingTechnique2 VALUES ('Steaming', 1, 'Water Vapor');
INSERT INTO CookingTechnique2 VALUES ('Boiling', 2, 'Water');
INSERT INTO CookingTechnique2 VALUES ('Sauteing', 3, 'Fat/Oil');
 
INSERT INTO Electric1 VALUES (50, 2.0, 20);
INSERT INTO Electric1 VALUES (75, 2.5, 15);
INSERT INTO Electric1 VALUES (200, 3.0, 12);
INSERT INTO Electric1 VALUES (15, 1.0, 8);
INSERT INTO Electric1 VALUES (20, 4.0, 65);
 
INSERT INTO Electric2 VALUES (1, 'Air Fryer', 'Uses hot air circulation to cook, crisp, and roast food with little to no oil.', 
    0, 50, 2.0);
INSERT INTO Electric2 VALUES (2, 'Slow Cooker', 'Cooks food at low temperatures for long periods, ideal for stews and tenderizing meats.', 
    0, 75, 2.5);
INSERT INTO Electric2 VALUES (3, 'Blender', 'Ideal for pureeing, crushing ice, and making smoothies or soups.', 
    0, 200, 3.0);
INSERT INTO Electric2 VALUES (4, 'Toaster Oven', 'A compact oven used for toasting, baking, and reheating.', 
    0, 15, 1.0);
INSERT INTO Electric2 VALUES (5, 'Rice Cooker', 'Automatically cooks rice to the proper consistency and keeps it warm.', 
    0, 20, 4.0);
 
INSERT INTO Manual1 VALUES ('Spatula', 0);
INSERT INTO Manual1 VALUES ('Whisk', 0);
INSERT INTO Manual1 VALUES ('Hand Grater', 0);
INSERT INTO Manual1 VALUES ('Meshed Sieve', 0);
INSERT INTO Manual1 VALUES ('Tongs', 0);
 
INSERT INTO Manual2 VALUES (1, 'Spatula', 'Broad blade attached to a handle designed for lifting or stirring', 0, 0);
INSERT INTO Manual2 VALUES (2, 'Whisk', 'Handle with wired loops for blending ingredients', 0, 0);
INSERT INTO Manual2 VALUES (3, 'Hand Grater', 'Tool for grating and shredding foods into fine pieces', 0, 0);
INSERT INTO Manual2 VALUES (4, 'Meshed Sieve', 'Mesh strainer for separating elements from unwanted material', 0, 0);
INSERT INTO Manual2 VALUES (5, 'Tongs', 'Versatile, hinged tool with two long arms', 0, 0);

INSERT INTO Recipe VALUES ('Tacos', 4.0, 'Mexican', 1.0, 1);
INSERT INTO Recipe VALUES ('Enchiladas', 4.0, 'Mexican', 1.5, 1);
INSERT INTO Recipe VALUES ('Guacamole', 4.0, 'Mexican', 0.5, 2);
INSERT INTO Recipe VALUES ('Muffins', 12.0, 'American', 1.0, 2);
INSERT INTO Recipe VALUES ('Pancakes', 4.0, 'American', 0.5, 3);
INSERT INTO Recipe VALUES ('Turkey', 12.0, 'American', 6.0, 3);
INSERT INTO Recipe VALUES ('Spaghetti', 4.0, 'Italian', 1.0, 4);
INSERT INTO Recipe VALUES ('Risotto', 4.0, 'Italian', 1.0, 4);
INSERT INTO Recipe VALUES ('Congee', 4.0, 'Asian', 2.0, 5);
INSERT INTO Recipe VALUES ('Fried Rice', 2.0, 'Asian', 0.5, 5);
INSERT INTO Recipe VALUES ('Ramen', 2.0, 'Asian', 1.5, 6);
INSERT INTO Recipe VALUES ('Salmon Fillet', 2.0, 'French', 0.5, 6);
INSERT INTO Recipe VALUES ('Roast Chicken', 4.0, 'French', 2.0, 7);
INSERT INTO Recipe VALUES ('Beef Stew', 6.0, 'American', 3.0, 7);
INSERT INTO Recipe VALUES ('Shakshuka', 4.0, 'Middle East', 0.5, 8);
INSERT INTO Recipe VALUES ('Fish Tacos', 4.0, 'Mexican', 0.5, 8);
INSERT INTO Recipe VALUES ('Falafel', 4.0, 'Middle East', 1.0, 9);
INSERT INTO Recipe VALUES ('Lemon Pasta', 4.0, 'Italian', 0.5, 9);
 
INSERT INTO PreparationStep1 VALUES(450, 45);
INSERT INTO PreparationStep1 VALUES(425, 20);
INSERT INTO PreparationStep1 VALUES(200, 10);
INSERT INTO PreparationStep1 VALUES(180, 20);
INSERT INTO PreparationStep1 VALUES(160, 15);
 
INSERT INTO PreparationStep2 VALUES('Turkey', 1, 'Roast turkey until the skin is brown.', 450);
INSERT INTO PreparationStep2 VALUES('Muffins', 2, 'Continue baking until a toothpick comes out clean.', 425);
INSERT INTO PreparationStep2 VALUES('Spaghetti', 3, 'Bring water in a pot to a rolling boil.', 200);
INSERT INTO PreparationStep2 VALUES('Congee', 4, 'Reduce heat to low, cover pot with a lid, then simmer.', 180);
INSERT INTO PreparationStep2 VALUES('Tacos', 5, 'Cook meat until no pink remains.', 160);
INSERT INTO PreparationStep2 VALUES('Roast Chicken', 1, 'Roast at high heat until juices run clear.', 450);
INSERT INTO PreparationStep2 VALUES('Salmon Fillet', 1, 'Bake until flesh flakes easily with a fork.', 425);
INSERT INTO PreparationStep2 VALUES('Risotto', 1, 'Simmer broth while stirring continuously.', 200);
INSERT INTO PreparationStep2 VALUES('Ramen', 1, 'Bring broth to a boil then reduce to simmer.', 180);
INSERT INTO PreparationStep2 VALUES('Pancakes', 1, 'Cook until bubbles form on surface then flip.', 160);
INSERT INTO PreparationStep2 VALUES('Beef Stew', 1, 'Brown the meat on all sides before adding liquid.', 450);
INSERT INTO PreparationStep2 VALUES('Shakshuka', 1, 'Simmer tomato sauce before adding eggs.', 180);
INSERT INTO PreparationStep2 VALUES('Fish Tacos', 1, 'Cook fish until it flakes easily.', 160);
INSERT INTO PreparationStep2 VALUES('Falafel', 1, 'Fry until golden brown on all sides.', 425);
INSERT INTO PreparationStep2 VALUES('Lemon Pasta', 1, 'Bring salted water to a rolling boil.', 200);

INSERT INTO Uses VALUES ('Muffins', 2);
INSERT INTO Uses VALUES ('Muffins', 1);
INSERT INTO Uses VALUES ('Tacos', 3);
INSERT INTO Uses VALUES ('Tacos', 5);
INSERT INTO Uses VALUES ('Turkey', 4);
INSERT INTO Uses VALUES ('Risotto', 1);
INSERT INTO Uses VALUES ('Risotto', 2);
INSERT INTO Uses VALUES ('Risotto', 4);
INSERT INTO Uses VALUES ('Pancakes', 2);
INSERT INTO Uses VALUES ('Salmon Fillet', 5);
INSERT INTO Uses VALUES ('Ramen', 3);
INSERT INTO Uses VALUES ('Beef Stew', 2);
INSERT INTO Uses VALUES ('Beef Stew', 4);
 
INSERT INTO Photo VALUES (1, 'Three soft-shell tacos with beef, tomatoes, avocado, chilli and onions on a black plate.', 3.5, 4.0, 'Tacos');
INSERT INTO Photo VALUES (2, 'Five blueberry muffins served on a white plate on a white background.', 3.6, 3.6, 'Muffins');
INSERT INTO Photo VALUES (3, 'Roast turkey on a white oval platter on a white background.', 4.8, 3.2, 'Turkey');
INSERT INTO Photo VALUES (4, 'Spaghetti in a white ceramic bowl on wooden table background.', 4.0, 4.0, 'Spaghetti');
INSERT INTO Photo VALUES (5, 'Congee with scallions in a wooden bowl on a white background.', 4.0, 3.5, 'Congee');
INSERT INTO Photo VALUES (6, 'Golden pancakes stacked with maple syrup on a white plate.', 3.5, 3.5, 'Pancakes');
INSERT INTO Photo VALUES (7, 'Creamy risotto in a wide bowl garnished with parmesan.', 4.0, 4.0, 'Risotto');
INSERT INTO Photo VALUES (8, 'Ramen in a deep bowl with soft boiled egg and nori.', 4.0, 3.8, 'Ramen');
INSERT INTO Photo VALUES (9, 'Salmon fillet on a white plate with lemon and herbs.', 3.8, 4.2, 'Salmon Fillet');
INSERT INTO Photo VALUES (10, 'Roast chicken on a wooden board with roasted vegetables.', 4.5, 4.5, 'Roast Chicken');
INSERT INTO Photo VALUES (11, 'Fried rice in a black bowl with chopsticks on the side.', 3.6, 3.6, 'Fried Rice');
INSERT INTO Photo VALUES (12, 'Enchiladas on a white plate covered in red sauce and cheese.', 4.0, 4.2, 'Enchiladas');
INSERT INTO Photo VALUES (13, 'Guacamole in a stone bowl surrounded by tortilla chips.', 3.2, 3.8, 'Guacamole');
INSERT INTO Photo VALUES (14, 'Beef stew in a Dutch oven with carrots and potatoes.', 4.0, 4.0, 'Beef Stew');
INSERT INTO Photo VALUES (15, 'Shakshuka in a cast iron pan with crusty bread on the side.', 4.2, 4.2, 'Shakshuka');
INSERT INTO Photo VALUES (16, 'Fish tacos on a wooden board with lime wedges and slaw.', 3.5, 4.0, 'Fish Tacos');
INSERT INTO Photo VALUES (17, 'Falafel on a plate with hummus and warm pita bread.', 3.8, 4.0, 'Falafel');
INSERT INTO Photo VALUES (18, 'Lemon pasta in a white bowl with fresh basil and zest.', 3.8, 3.8, 'Lemon Pasta');
 
INSERT INTO Employs VALUES ('Tacos', 'Sauteing');
INSERT INTO Employs VALUES ('Muffins', 'Baking');
INSERT INTO Employs VALUES ('Turkey', 'Roasting');
INSERT INTO Employs VALUES ('Spaghetti', 'Boiling');
INSERT INTO Employs VALUES ('Congee', 'Boiling');
INSERT INTO Employs VALUES ('Pancakes', 'Sauteing');
INSERT INTO Employs VALUES ('Risotto', 'Boiling');
INSERT INTO Employs VALUES ('Ramen', 'Boiling');
INSERT INTO Employs VALUES ('Salmon Fillet', 'Roasting');
INSERT INTO Employs VALUES ('Roast Chicken', 'Roasting');
INSERT INTO Employs VALUES ('Fried Rice', 'Sauteing');
INSERT INTO Employs VALUES ('Enchiladas', 'Baking');
INSERT INTO Employs VALUES ('Guacamole', 'Sauteing');
INSERT INTO Employs VALUES ('Beef Stew', 'Boiling');
INSERT INTO Employs VALUES ('Shakshuka', 'Sauteing');
INSERT INTO Employs VALUES ('Fish Tacos', 'Deep-frying');
INSERT INTO Employs VALUES ('Falafel', 'Deep-frying');
INSERT INTO Employs VALUES ('Lemon Pasta', 'Boiling');

INSERT INTO TrainsIn VALUES (1, 'Roasting');
INSERT INTO TrainsIn VALUES (1, 'Baking');
INSERT INTO TrainsIn VALUES (2, 'Baking');
INSERT INTO TrainsIn VALUES (2, 'Sauteing');
INSERT INTO TrainsIn VALUES (3, 'Deep-frying');
INSERT INTO TrainsIn VALUES (3, 'Boiling');
INSERT INTO TrainsIn VALUES (4, 'Steaming');
INSERT INTO TrainsIn VALUES (4, 'Boiling');
INSERT INTO TrainsIn VALUES (5, 'Steaming');
INSERT INTO TrainsIn VALUES (5, 'Roasting');
INSERT INTO TrainsIn VALUES (6, 'Roasting');
INSERT INTO TrainsIn VALUES (6, 'Baking');
INSERT INTO TrainsIn VALUES (6, 'Deep-frying');
INSERT INTO TrainsIn VALUES (6, 'Steaming');
INSERT INTO TrainsIn VALUES (6, 'Boiling');
INSERT INTO TrainsIn VALUES (6, 'Sauteing');
INSERT INTO TrainsIn VALUES (7, 'Roasting');
INSERT INTO TrainsIn VALUES (7, 'Baking');
INSERT INTO TrainsIn VALUES (7, 'Deep-frying');
INSERT INTO TrainsIn VALUES (7, 'Steaming');
INSERT INTO TrainsIn VALUES (7, 'Boiling');
INSERT INTO TrainsIn VALUES (7, 'Sauteing');
INSERT INTO TrainsIn VALUES (8, 'Sauteing');
INSERT INTO TrainsIn VALUES (8, 'Deep-frying');
INSERT INTO TrainsIn VALUES (9, 'Baking');
INSERT INTO TrainsIn VALUES (9, 'Boiling');
 
INSERT INTO Measurement VALUES (1, 45.0, NULL, NULL);
INSERT INTO Measurement VALUES (2, NULL, 3, 25.9);
INSERT INTO Measurement VALUES (3, NULL, 1, 121.8);
INSERT INTO Measurement VALUES (4, NULL, 2, 73.4);
INSERT INTO Measurement VALUES (5, NULL, NULL, 14.3);
INSERT INTO Measurement VALUES (6, 250.0, NULL, NULL);
INSERT INTO Measurement VALUES (7, NULL, 2, 200.0);
INSERT INTO Measurement VALUES (8, NULL, 1, 500.0);
INSERT INTO Measurement VALUES (9, 30.0, NULL, NULL);
INSERT INTO Measurement VALUES (10, NULL, 4, 300.0);
INSERT INTO Measurement VALUES (11, 500.0, NULL, NULL);
 
INSERT INTO UsedIn VALUES ('Tacos', 'Chili Pepper', 4);
INSERT INTO UsedIn VALUES ('Tacos', 'Lemon', 3);
INSERT INTO UsedIn VALUES ('Tacos', 'Tomato', 2);
INSERT INTO UsedIn VALUES ('Tacos', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Muffins', 'Milk', 1);
INSERT INTO UsedIn VALUES ('Turkey', 'Lemon', 3);
INSERT INTO UsedIn VALUES ('Turkey', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Spaghetti', 'Parsley', 5);
INSERT INTO UsedIn VALUES ('Spaghetti', 'Milk', 1);
INSERT INTO UsedIn VALUES ('Spaghetti', 'Broccoli', 4);
INSERT INTO UsedIn VALUES ('Spaghetti', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Congee', 'Scallion', 2);
INSERT INTO UsedIn VALUES ('Congee', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Fried Rice', 'Scallion', 2);
INSERT INTO UsedIn VALUES ('Fried Rice', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Fried Rice', 'Rice', 10);
INSERT INTO UsedIn VALUES ('Ramen', 'Scallion', 2);
INSERT INTO UsedIn VALUES ('Ramen', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Salmon Fillet', 'Salmon', 7);
INSERT INTO UsedIn VALUES ('Salmon Fillet', 'Lemon', 3);
INSERT INTO UsedIn VALUES ('Salmon Fillet', 'Parsley', 5);
INSERT INTO UsedIn VALUES ('Roast Chicken', 'Chicken', 8);
INSERT INTO UsedIn VALUES ('Roast Chicken', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Roast Chicken', 'Lemon', 3);
INSERT INTO UsedIn VALUES ('Risotto', 'Milk', 6);
INSERT INTO UsedIn VALUES ('Risotto', 'Parsley', 5);
INSERT INTO UsedIn VALUES ('Enchiladas', 'Chili Pepper', 4);
INSERT INTO UsedIn VALUES ('Enchiladas', 'Tomato', 2);
INSERT INTO UsedIn VALUES ('Guacamole', 'Lemon', 3);
INSERT INTO UsedIn VALUES ('Guacamole', 'Tomato', 2);
INSERT INTO UsedIn VALUES ('Guacamole', 'Chili Pepper', 4);
INSERT INTO UsedIn VALUES ('Pancakes', 'Milk', 1);
INSERT INTO UsedIn VALUES ('Beef Stew', 'Tomato', 2);
INSERT INTO UsedIn VALUES ('Beef Stew', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Shakshuka', 'Tomato', 2);
INSERT INTO UsedIn VALUES ('Shakshuka', 'Chili Pepper', 4);
INSERT INTO UsedIn VALUES ('Shakshuka', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Fish Tacos', 'Salmon', 7);
INSERT INTO UsedIn VALUES ('Fish Tacos', 'Lemon', 3);
INSERT INTO UsedIn VALUES ('Fish Tacos', 'Chili Pepper', 4);
INSERT INTO UsedIn VALUES ('Falafel', 'Parsley', 5);
INSERT INTO UsedIn VALUES ('Falafel', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Falafel', 'Lemon', 3);
INSERT INTO UsedIn VALUES ('Lemon Pasta', 'Lemon', 3);
INSERT INTO UsedIn VALUES ('Lemon Pasta', 'Garlic', 9);
INSERT INTO UsedIn VALUES ('Lemon Pasta', 'Parsley', 5);

SELECT * FROM RECIPE;
-- select table_name from user_tables;