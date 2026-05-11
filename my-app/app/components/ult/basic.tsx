import { FullRecipe } from "../../interfaces/obj";
export default function Basic({ recipe }: { recipe: FullRecipe }) {
    return (
        <>
            <h1>{recipe.recipe.name}</h1>

        </>
    )
}