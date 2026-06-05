import { User } from "@supabase/supabase-js";

export interface Recipe {
    name: string;
    imageURL: string;
    description: string;
    ingredients: ingridient[];
    instructions: instruction[];
    prepTime: string;
    cookTime: string;
    totalTime: string;
    servings: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    notes: string;
    tags: Tags[];
    user_id?: string;
}
export interface Tags {
    id: string
    names: string;
}
export interface UserProfile {
    name: string;
    age: number;
    gender: string;
    weight: number;
    height: number;
}
export interface ingridient {
    item: string;
    quantity: string;
}
export interface instruction {
    stepnumber: number;
    description: string;
}
export interface FavoriteMeal {
    userId: string;
    recipeId: string;
}
export interface UserProfile {
    name: string;
    age: number;
    gender: string;
    weight: number;
    height: number;
}
export interface ExtractedRecipe {
    id: string;
    name: string;
    imageURL: string;
    description: string;
    prepTime: string;
    cookTime: string;
    totalTime: string;
    servings: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    notes: string;
    tags: Tags[],
    user_id: string
}
export interface FullRecipe {
    recipe: ExtractedRecipe;
    ingridients: ingridient[];
    instructions: instruction[];
}