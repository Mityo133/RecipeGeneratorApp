import axios from 'axios'
import { FullRecipe, FavoriteFood, Favorite_Food } from "../obj";
const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
import { createClient } from "@supabase/supabase-js";
if (!supabaseURL || !supabaseKey ) {
  // This will now only log if the variables are truly missing from your .env.local file
  console.error("Supabase configuration missing");
  throw Error("No Api Key!");
}else{
  console.log(process.env.NEXT_PUBLIC_API_KEY);
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const host: string = process.env.NEXT_PUBLIC_BACK_URL || "https://backend-1uav.onrender.com/";
const api = axios.create({
  baseURL: `${host}`,
  headers: {
    'Content-Type': 'application/json',
    // process.env.BACKEND_API_KEY is safe here because this block runs on the server side
    'x-api-key':process.env.NEXT_PUBLIC_API_KEY || '', 
  }
});
export async function GetAllRecipes() {
  const fetched = await api.get(`/get-all-recipes`);
  const data = fetched.data;
  return data as FullRecipe[];
}
export async function SendRecipe(promt: string) {
  const fetched = await api.post(`/generate-recipe`, { "ingredients": promt });
  const data = fetched.data;
  console.log(data);
  return data.doneres;
}
export async function GetRecipeById(id: string) {
  const fetched = await api.get(`/get-recipe-by-id/${id}`);
  const data = fetched.data;
  console.log(data);
  return data as FullRecipe;
}
export async function Registration(email: string, password: string) {
  try {
    const fetched = await api.post(`/sign-up`, { email, password });
    return {
      message: "Account has benn logged",
      account: fetched
    }
  } catch (err) {
    console.error(err);
    throw ("There has been an errro with your registration");
  }
}

export async function LoginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      message: error.message,
      err: error,
      data: null,
    };
  }

  return {
    message: "Login successful",
    data,
    err: null,
  };
}
export async function AddFavoriteFood(emailId: string, recipeId: string) {
  try {
    const fetched = await api.post(`/AddMealToUsersList`, { "userId": emailId, "mealId": recipeId });
    const data = fetched;
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return {
      message: "The recipe couldn't be added!"
    }
  }
}

export async function ExtracRecipeByFavoriteId(email: string) {
  try {
      const userMeals = await supabase
      .from('favorite_meals')
      .select('recipe_id')
      .eq("user_id", email);
    const mapped: string[] = userMeals.data?.map((meal) => meal.recipe_id) ?? [];
    const datoss:Favorite_Food = {
      message: "You have got the data Yupi!",
      recipe_id: mapped as string[]
    };
    return datoss
  } catch (error) {
    return {
      message: "You did not get the data",
      err: error
    } as Favorite_Food
  }
}

export async function GetTheUsersMeals(user_id:string,recipe_id:string){
  try{
    const userMeals = await supabase
      .from('favorite_meals')
      .select('recipe_id')
      .eq("user_id", user_id);
    const mapped: string[] = userMeals.data?.map((meal) => meal.recipe_id) ?? [];
    if(mapped.includes(recipe_id)){
      return true as boolean;
    }
    return false as boolean;
  }catch(error){
    return false as boolean;
  }
}

export async function RemoveFavoriteFood(user_id:string,recipe_id:string){
    try{
     
    const { error } = await supabase
      .from('favorite_meals')
      .delete()
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)

      if(error){
        console.error(error);
        return false as boolean;
      }
      return true as boolean;
    }
    catch(error){
        console.error(error);
        return false as boolean;
    }
}

export async function ForgotPassword(email: string) {
  try {
    const fetched = await api.post(`/forgot-password`, { email });
    return fetched.data;
  } catch (error: any) {
    console.error("ForgotPassword error:", error);
    const errorMsg = error.response?.data?.error || "Failed to request password reset.";
    return { error: errorMsg };
  }
}
