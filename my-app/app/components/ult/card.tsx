'use client'
import React from "react";
import { FullRecipe } from "../../interfaces/obj";
import Image from 'next/image'
interface CardProps {
    data: FullRecipe;
}
import Button from '@/app/components/ult/button'
export default function Card({ data }: CardProps) {
    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <h2 className="text-xl text-gray-500">The data is undefined!</h2>
            </div>
        );
    }

    return <>
        <div className="max-w-4xl mx-auto p-6 bg-gray-950 rounded-2xl">
            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden mb-8">
                <Image
                    src={data.recipe.imageURL}
                    width={350}
                    height={350}
                    alt={data.recipe.name}
                    className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 from-black/70 to-transparent " />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {data.recipe.name}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        {data.recipe.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full"
                            >
                                {tag.id}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {data.recipe.description}
                </p>
            </div>

            {/* Time & Servings Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Prep Time</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {data.recipe.prepTime}
                    </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">Cook Time</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {data.recipe.cookTime}
                    </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Time</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {data.recipe.totalTime}
                    </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Servings</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {data.recipe.servings}
                    </p>
                </div>
            </div>

            {/* Nutrition */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-purple-500 rounded-full" />
                    Nutrition
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
                        <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            {data.recipe.calories}
                        </p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
                        <p className="text-xl font-bold text-red-600 dark:text-red-400">
                            {data.recipe.protein}
                        </p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Carbs</p>
                        <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                            {data.recipe.carbs}
                        </p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Fat</p>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {data.recipe.fat}
                        </p>
                    </div>
                </div>
            </div>

            {/* Ingredients */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full" />
                    Ingredients
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {data.ingridients.map((ing, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                            >
                                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                                <span className="font-medium text-green-600 dark:text-green-400">
                                    {ing.quantity}
                                </span>
                                <span>{ing.item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-500 rounded-full" />
                    Instructions
                </h2>
                <ol className="space-y-4">
                    {data.instructions
                        .sort((a, b) => a.stepnumber - b.stepnumber)
                        .map((step) => (
                            <li
                                key={step.stepnumber}
                                className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <span className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
                                    {step.stepnumber}
                                </span>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-2">
                                    {step.description}
                                </p>
                            </li>
                        ))}
                </ol>
            </div>

            {/* Notes */}
            {data.recipe.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <span className="w-2 h-8 bg-yellow-500 rounded-full" />
                        Notes
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {data.recipe.notes}
                    </p>
                </div>
            )}
            <div>
                <Button mealId={data.recipe.id}></Button>               
            </div>
        </div>
    </>
}
