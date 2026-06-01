import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Recipe } from "./methods/obj";
import {
    insertRecipe, insertIngridients, insertInstructions, getAllRecipes
    , ExtractByRecipeId, addTag, getAllTags, GetTagByName, PostTagForRecipe
    , SignUpUser, UserReturn, PassWordRecovory, AddFavoriteFood,ResetPassword, mes
} from "./methods/database";
import { generateText } from "./methods/ai";
import path from 'path';
import {translateToEnglish} from './methods/translating'
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const redo = 'http://localhost:3000/'
app.use(express.json());
app.use(cors({ origin: "*" }));
// ─── Swagger / OpenAPI setup ───────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../public')))
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Recipe API",
        version: "1.0.0",
        description:
            "REST API for generating, storing, and retrieving AI-powered recipes and tags.",
    },
    servers: [{ url: `http://localhost:${port}`, description: "Local dev server" }],
    components: {
        schemas: {
            Ingredient: {
                type: "object",
                properties: {
                    item: { type: "string", example: "Chicken breast" },
                    quantity: { type: "string", example: "200g" },
                },
            },
            Instruction: {
                type: "object",
                properties: {
                    stepnumber: { type: "integer", example: 1 },
                    description: { type: "string", example: "Preheat oven to 180°C." },
                },
            },
            Tag: {
                type: "object",
                properties: {
                    id: { type: "string", example: "uuid-123" },
                    names: { type: "string", example: "Vegetarian" },
                },
            },
            ExtractedRecipe: {
                type: "object",
                properties: {
                    id: { type: "string", example: "uuid-456" },
                    name: { type: "string", example: "Grilled Chicken" },
                    imageURL: { type: "string", example: "https://example.com/image.jpg" },
                    description: { type: "string", example: "A delicious grilled chicken recipe." },
                    prepTime: { type: "string", example: "10 minutes" },
                    cookTime: { type: "string", example: "20 minutes" },
                    totalTime: { type: "string", example: "30 minutes" },
                    servings: { type: "string", example: "2" },
                    calories: { type: "string", example: "350" },
                    protein: { type: "string", example: "40g" },
                    carbs: { type: "string", example: "5g" },
                    fat: { type: "string", example: "12g" },
                    notes: { type: "string", example: "Best served hot." },
                    tags: { type: "array", items: { $ref: "#/components/schemas/Tag" } },
                },
            },
            FullRecipe: {
                type: "object",
                properties: {
                    recipe: { $ref: "#/components/schemas/ExtractedRecipe" },
                    ingridients: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Ingredient" },
                    },
                    instructions: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Instruction" },
                    },
                },
            },
            Error: {
                type: "object",
                properties: {
                    error: { type: "string", example: "Something went wrong." },
                },
            },
        },
    },
};

const swaggerOptions: swaggerJSDoc.Options = {
    swaggerDefinition,
    apis: [__filename], // Reads JSDoc @swagger comments from this file at runtime
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     description: Returns a simple "Hello World!" message to confirm the server is running.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is running.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello World!
 */
app.get("/", (req, res) => {
    res.redirect(`${redo}`);
});

/**
 * @swagger
 * /generate-recipe:
 *   post:
 *     summary: Generate and store a recipe
 *     description: Uses AI to generate a full recipe from a list of ingredients, then persists it in the database.
 *     tags:
 *       - Recipes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ingredients
 *             properties:
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["chicken", "garlic", "lemon"]
 *     responses:
 *       200:
 *         description: Recipe successfully generated and stored.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The recipe has been added!
 *                 recipe:
 *                   $ref: '#/components/schemas/ExtractedRecipe'
 *       500:
 *         description: Failed to generate recipe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/generate-recipe", async (req, res) => {
    try {
        const { ingredients } = req.body;
        const result = await translateToEnglish(ingredients)
        const recipe: Recipe = await generateText(result.translation);
        const recipeId = await insertRecipe(recipe);
        await insertIngridients(recipe.ingredients, recipeId);
        await insertInstructions(recipe.instructions, recipeId);
        const doneres = await ExtractByRecipeId(recipeId);
        res.json({ message: "The recipe has been added!", doneres });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate recipe please try a diffrent way!" });
    }
});

/**
 * @swagger
 * /get-all-recipes:
 *   get:
 *     summary: Get all recipes
 *     description: Returns every recipe stored in the database, including their ingredients, instructions, and tags.
 *     tags:
 *       - Recipes
 *     responses:
 *       200:
 *         description: List of all full recipes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FullRecipe'
 *       500:
 *         description: Failed to retrieve recipes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/get-all-recipes", async (req, res) => {
    try {
        const recipes = await getAllRecipes();
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get recipes please try a diffrent way!" });
    }
});

/**
 * @swagger
 * /get-recipe-by-id:
 *   get:
 *     summary: Get a recipe by ID
 *     description: Returns a specific recipe (with ingredients and instructions) by its database ID. The ID is passed in the request body.
 *     tags:
 *       - Recipes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "uuid-456"
 *     responses:
 *       200:
 *         description: The matching recipe.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FullRecipe'
 *       500:
 *         description: Failed to retrieve recipe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/get-recipe-by-id/:id", async (req, res) => {
    try {
        const id: string = req.params.id;
        const recipe = await ExtractByRecipeId(id);
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get recipe please try a diffrent way!" });
    }
});

/**
 * @swagger
 * /add-tag:
 *   post:
 *     summary: Create a new tag
 *     description: Inserts a new tag (e.g. "Vegetarian") into the tags table.
 *     tags:
 *       - Tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tag
 *             properties:
 *               tag:
 *                 type: string
 *                 example: "Vegetarian"
 *     responses:
 *       200:
 *         description: Tag created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               nullable: true
 *       500:
 *         description: Failed to add tag.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/add-tag", async (req, res) => {
    try {
        const { tag } = req.body;
        const recipe = await addTag(tag);
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add tag please try a diffrent way!" });
    }
});

/**
 * @swagger
 * /all-tags:
 *   get:
 *     summary: Get all tags
 *     description: Returns a list of all tags available in the database.
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: List of all tags.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Failed to retrieve tags.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/all-tags", async (req, res) => {
    try {
        const tags = await getAllTags();
        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get tags please try a diffrent way!" });
    }
});

/**
 * @swagger
 * /tag-by-id:
 *   get:
 *     summary: Get tags by name
 *     description: Returns all tags that match the provided name string. The name is passed in the request body.
 *     tags:
 *       - Tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vegetarian"
 *     responses:
 *       200:
 *         description: Matching tag names.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Vegetarian"]
 *       500:
 *         description: Failed to retrieve tag.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/tag-by-id", async (req, res) => {
    try {
        const { name } = req.body;
        const tag = await GetTagByName(name);
        res.json(tag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get tag please try a diffrent way!" });
    }
});

/**
 * @swagger
 * /post-tag-for-recipe:
 *   post:
 *     summary: Associate a tag with a recipe
 *     description: Links an existing tag to an existing recipe via the recipe_tags junction table.
 *     tags:
 *       - Tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipe_id
 *               - tag_id
 *             properties:
 *               recipe_id:
 *                 type: string
 *                 example: "uuid-recipe-123"
 *               tag_id:
 *                 type: string
 *                 example: "uuid-tag-456"
 *     responses:
 *       200:
 *         description: Tag successfully associated with recipe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               nullable: true
 *       500:
 *         description: Failed to post tag for recipe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/post-tag-for-recipe", async (req, res) => {
    try {
        const { recipe_id, tag_id } = req.body;
        const recipe = await PostTagForRecipe(recipe_id, tag_id);
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to post tag for recipe please try a diffrent way!" });
    }
});
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
});
app.post("/sign-up", limiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = await SignUpUser(email, password);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to sign up user please try a diffrent way!" });
    }
});
app.post("/reset-password", async (req, res) => {
    const { accessToken, refreshToken, newPassword } = req.body;
    const result = await ResetPassword(accessToken, refreshToken, newPassword);
    if (result.error) return res.status(400).json(result);
    return res.status(200).json(result);
});
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const result = await PassWordRecovory(email);
    if (result.error) return res.status(400).json(result);
    return res.status(200).json(result);
});
app.post("/log-in", async (req, res) => {
    const { email, password } = req.body;
    const users = await UserReturn(email, password);
    res.json(users);
});
app.post("/AddMealToUsersList",async(req,res)=>{
    const {userId,mealId} = req.body;
    const datos = await AddFavoriteFood(userId,mealId);
    res.json(datos);
});
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/reset-password.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});