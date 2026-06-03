import { createClient } from "@supabase/supabase-js";
import { Recipe, ingridient, instruction, ExtractedRecipe, FullRecipe, Tags } from "./obj";
import dotenv from "dotenv";
import { Session } from "inspector";
dotenv.config();
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
export interface mes {
    message: any,
    error: any
}
if (!supabaseURL || !supabaseKey) {
    console.error("Supabase configuration missing:", {
        url: !!supabaseURL,
        key: !!supabaseKey
    });
    throw new Error("Missing Supabase configuration!");
}

const supabase = createClient(supabaseURL, supabaseKey);

export async function insertRecipe(recipe: Recipe) {
    try {
        const { data, error } = await supabase
            .from('recipes')
            .insert([
                {
                    "name": `${recipe.name}`,
                    "image_url": `${recipe.imageURL}`,
                    "description": `${recipe.description}`,
                    "prep_time": `${recipe.prepTime}`,
                    "cook_time": `${recipe.cookTime}`,
                    "total_time": `${recipe.totalTime}`,
                    "servings": `${recipe.servings}`,
                    "calories": `${recipe.calories}`,
                    "protein": `${recipe.protein}`,
                    "carbs": `${recipe.carbs}`,
                    "fat": `${recipe.fat}`,
                    "notes": `${recipe.notes}`
                },
            ])
            .select().single();
        console.log(data);
        if (error) {
            console.error("Error inserting recipe:", error);
            throw error;
        }

        return data.id;
    } catch (err) {
        console.error("insertRecipe failed:", err);
        throw new Error("No item can be added!")
    }
}
export async function insertIngridients(ingridients: ingridient[], idForRecipe: string) {
    try {
        const formatted = ingridients.map(i => ({
            recipe_id: idForRecipe,
            item: i.item,
            quantity: i.quantity
        }));
        await supabase
            .from("ingridients_recipe")
            .insert(formatted);
    } catch (err) {
        console.error("insertIngridients failed:", err);
        throw new Error("You cannot add an item to ingridients!")
    }
}
export async function insertInstructions(instructions: instruction[], id: string) {
    try {
        const formated = instructions.map(i => ({
            recipe_id: id,
            step_number: i.stepnumber,
            description: i.description
        }));

        await supabase
            .from("instruction_recipe")
            .insert(formated);
        console.log(formated);
    } catch (err) {
        console.error("insertInstructions failed:", err);
        throw new Error("An item cannot be added to the database instructions!");
    }
}
export async function getAllRecipes() {
    try {
        const { data, error } = await supabase.from("recipes").select("*");
        if (error) {
            console.error("Error getting all recipes:", error);
            throw error;
        }
        const recipes: ExtractedRecipe[] = await Promise.all(data.map(async (i) => ({
            id: i.id,
            name: i.name,
            imageURL: i.image_url,
            description: i.description,
            prepTime: i.prep_time,
            cookTime: i.cook_time,
            totalTime: i.total_time,
            servings: i.servings,
            calories: i.calories,
            protein: i.protein,
            carbs: i.carbs,
            fat: i.fat,
            notes: i.notes,
            tags: await ExtractTagsForRecipe(i.id)
        })));
        const recipe: FullRecipe[] = await Promise.all(recipes.map(async (res: ExtractedRecipe) => ({
            recipe: res,
            ingridients: await ExtractIngridients(res.id),
            instructions: await ExtractInstructions(res.id),
        })));
        return recipe;
    } catch (err) {
        console.error("getAllRecipes failed:", err);
        throw new Error("No item can be added!")
    }
}
export async function ExtractIngridients(id: string) {
    try {
        const { data, error } = await supabase.from("ingridients_recipe").select("*").eq("recipe_id", id);
        if (error) {
            console.error("Error getting ingridients:", error);
            throw error;
        }
        const ingridients: ingridient[] = data.map(i => ({
            item: i.item,
            quantity: i.quantity
        }));
        return ingridients as ingridient[];
    } catch (err) {
        console.error("ExtractIngridients failed:", err);
        throw new Error("No item can be fetched!")
    }
}
export async function ExtractInstructions(id: string) {
    try {
        const { data, error } = await supabase.from("instruction_recipe").select("*").eq("recipe_id", id).order("step_number", { ascending: true });
        if (error) {
            console.error("Error getting instructions:", error);
            throw error;
        }
        const instructions: instruction[] = data.map(i => ({
            stepnumber: i.step_number,
            description: i.description
        }));
        return instructions as instruction[];
    } catch (err) {
        console.error("Cannot extract instruction");
        throw new Error("Sorry there was an error with instruction!");
    }
}
export async function ExtractByRecipeId(id: string) {
    try {
        const { data, error } = await supabase.from("recipes").select("*").eq("id", id);
        if (error) {
            console.error("Error getting recipe:", error);
            throw error;
        }
        const recipe: ExtractedRecipe[] = data.map(i => ({
            id: i.id,
            name: i.name,
            imageURL: i.image_url,
            description: i.description,
            prepTime: i.prep_time,
            cookTime: i.cook_time,
            totalTime: i.total_time,
            servings: i.servings,
            calories: i.calories,
            protein: i.protein,
            carbs: i.carbs,
            fat: i.fat,
            notes: i.notes,
            tags: i.tags || []
        }));
        console.log(recipe);
        const recipes: FullRecipe[] = await Promise.all(recipe.map(async (res: ExtractedRecipe) => ({
            recipe: res,
            ingridients: await ExtractIngridients(res.id),
            instructions: await ExtractInstructions(res.id),
        })));
        return recipes[0];
    } catch (err) {
        console.error("ExtractByRecipeId failed:", err);
        throw new Error("No item can be fetched!");
    }
}
export async function addTag(tag: string) {
    try {
        const { data, error } = await supabase.from("tags").insert({
            name: tag
        });
        if (error) {
            console.error("Error adding tag:", error);
            throw error;
        }
        return data;
    } catch (err) {
        console.error("addTag failed:", err);
        throw new Error("No item can be added!")
    }
}
export async function getAllTags() {
    try {
        const { data, error } = await supabase.from("tags").select("*");
        if (error) {
            console.error("Error getting tags:", error);
            throw error;
        }
        const tags: Tags[] = await Promise.all(data.map(async (i) => ({
            id: i.id,
            names: i.name
        })));
        return tags as Tags[];
    } catch (err) {
        console.error("getAllTags failed:", err);
        throw new Error("No item can be fetched!")
    }
}
export async function GetTagByName(name: string) {
    try {
        const { data, error } = await supabase.from("tags").select("*").eq("name", name);
        if (error) {
            console.error("Error getting tags:", error);
            throw error;
        }
        const tags: string[] = data.map(i => i.name);
        return tags as string[];
    } catch (err) {
        console.error("getAllTags failed:", err);
        throw new Error("No item can be fetched!")
    }
}
export async function PostTagForRecipe(recipe_id: string, tag_id: string) {
    try {
        const { data, error } = await supabase.from("recipe_tags").insert({
            recipe_id: recipe_id,
            tag_id: tag_id
        });
        if (error) {
            console.error("Error adding tag:", error);
            throw error;
        }
        return data;
    } catch (err) {
        console.error("PostTagForRecipe failed:", err);
        throw new Error("No item can be added!")
    }
}
export async function ExtractTagsForRecipe(recipe_id: string) {
    try {
        const { data, error } = await supabase.from("recipe_tags").select("*").eq("recipe_id", recipe_id);
        if (error) {
            console.error("Error getting tags:", error);
            throw error;
        }
        const tags: Tags[] = await Promise.all(data.map(async (i) => ({
            id: i.id,
            names: await GetTagById(i.tag_id)
        })));
        return tags as Tags[];
    } catch (err) {
        console.error("ExtractTagsForRecipe failed:", err);
        throw new Error("No item can be fetched!")
    }
}
async function GetTagById(id: string) {
    try {
        const { data, error } = await supabase.from("tags").select("*").eq("id", id);
        if (error) {
            console.error("Error getting tags:", error);
            throw error;
        }
        const tags: Tags[] = data.map(i => ({
            id: i.id,
            names: i.name
        }));
        const name: string = tags[0].names;
        return name as string;
    } catch (err) {
        console.error("GetTagById failed:", err);
        throw new Error("No item can be fetched!")
    }
}
export async function SignUpUser(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        return data;

    } catch (err: any) {
        const message: mes = {
            message: false,
            error: err.message || "Something went wrong",
        }
        return message as mes;
    }
}
export async function UserReturn(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword(
            {
                email: email,
                password: password
            }
        );
        if (error) {
            return {
                message: "Unsacsesfull Login",
                err: error
            };
        } else {
            return {
                message: "Succsesfull login",
                data: data
            }
        }
    } catch (err: any) {
        return {
            message: "There was an error with the login",
            eror: err
        }
    }
}

export async function PassWordRecovory(email: string) {
    try {
        // IMPORTANT:
        // We must redirect to the FRONTEND route (Next.js) so the reset form can call
        // the backend with the required x-api-key header.
        const redirectTo = process.env.SUPABASE_RESET_REDIRECT_TO || 'https://auracheffrontend.onrender.com/components/reset-password';

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        });

        if (error) {
            console.error('PassWordRecovory error:', error);
            return { message: 'Unsuccessful Password Recovery', error: error.message };
        }

        return { message: 'Recovery email sent successfully', data };
    } catch (err: any) {
        console.error('PassWordRecovory exception:', err);
        return { message: 'There has been an error', error: err.message };
    }
}

export async function ResetPassword(accessToken: string, refreshToken: string, newPassword: string) {
    try {
        if (!accessToken || !refreshToken || !newPassword) {
            return { message: 'Error', error: 'Access token, refresh token, and new password are required' };
        }

        const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        if (sessionError) {
            console.error('setSession error:', sessionError);
            return { message: 'Error', error: 'Invalid or expired token' };
        }

        const { data, error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) return { message: 'Error', error: error.message };

        return { message: 'Password updated successfully', email: data.user.email };

    } catch (err: any) {
        return { message: 'Something went wrong', error: err.message };
    }
}
export async function AddFavoriteFood(userId: string, mealId: string) {
    try {
        const { data, error } = await supabase
            .from('favorite_meals')
            .insert([
                { user_id: `${userId}`, recipe_id: `${mealId}` },
            ])
            .select();
        if (error) {
            return {
                message: "A recipe could not be added",
                Err: error
            }
        } else {
            return {
                message: "A recipe has been added to your list"
            }
        }

    } catch (err) {
        return {
            message: "The recipe was not added to your list"
        }
    }
}