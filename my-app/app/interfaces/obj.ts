import error from "next/dist/api/error";

export interface favorite_meals{
    err?:error
    id?:string
    message?:string
    recipe_id?:string
}

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
    tags: Tags[]
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
    tags: Tags[]
}
export interface FullRecipe {
    recipe: ExtractedRecipe;
    ingridients: ingridient[];
    instructions: instruction[];
}
export interface UserChecks {
    message: string;
    data: {
        user: {
            id: string;
            email: string;
        };
        session: {
            access_token: string;
            refresh_token: string;
            expires_at: number;
        };
    } | null;
    err: {
        __isAuthError: boolean;
        name: string;
        status: number;
        code: string;
    } | null;
}
export interface FavoriteFood{
    recipe?:FullRecipe[],
    error?:error,
    message:string
}
export interface Favorite_Food{
    message:string,
    error?:error
    recipe_id?:string[]
}