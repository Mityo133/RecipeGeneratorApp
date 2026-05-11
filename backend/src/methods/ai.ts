import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Recipe } from "./obj"
import axios from "axios"
dotenv.config();
const genAI = new GoogleGenAI({
    apiKey: process.env.gemini_API,
});
async function getPexelsImage(query: string): Promise<string> {
    try {
        const key = process.env.IMAGE_API;

        if (!key) {
            throw new Error("Missing Pexels API key");
        }
        const res = await axios.get("https://api.pexels.com/v1/search", {
            headers: { Authorization: key },
            params: {
                query: `${query} food`,
                per_page: 5
            },
        });

        const photos = res.data.photos;

        if (!photos || photos.length === 0) {
            return "https://via.placeholder.com/300";
        }

        // ✅ Find first valid image (extra safety)
        const validPhoto = photos.find((p: any) => p?.src?.medium);

        return validPhoto?.src?.medium || "https://via.placeholder.com/300";

    } catch (error) {
        console.error("Pexels API error:", error);
        return "https://via.placeholder.com/300";
    }
}
export async function generateText(prompt: string) {
    const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a recipe for a dish that can be made with the following description and ingredients: ${prompt}
        Make the structure of the file JSON file.
        The JSON file should contain information for
        -name
        -description
        -ingredients- for ingredients i want the structure to be like this:{ item: string,
    quantity: string,}
        -instructions- for instaruction i want the structure to be like this:{ stepnumber: string,
    description: string,}
        -prepTime
        -cookTime
        -totalTime
        -servings
        -calories
        -protein
        -carbs
        -fat
        -notes
        For the image you can take it from a site like printerest!`,
    });
    let answerss = "";
    if (response.text) {
        answerss = response.text.replace("```json", "").replace("```", "");
    } else {
        throw new Error("There is a problem with the JSON!");
    }
    const answer = answerss;
    if (answer) {
        const parse: Recipe = JSON.parse(answer);
        const image = await getPexelsImage(parse.name)
        const lll: Recipe =
        {
            name: parse.name,
            imageURL: image,
            description: parse.description,
            ingredients: parse.ingredients,
            instructions: parse.instructions,
            prepTime: parse.prepTime,
            cookTime: parse.cookTime,
            totalTime: parse.totalTime,
            servings: parse.servings,
            calories: parse.calories,
            protein: parse.protein,
            carbs: parse.carbs,
            fat: parse.fat,
            notes: parse.notes,
            tags: parse.tags
        }
        return lll;
    }
    else {
        throw new Error("There is no recipe!");
    }
}