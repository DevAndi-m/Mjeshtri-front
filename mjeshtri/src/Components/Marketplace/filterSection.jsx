import { useState, useEffect } from 'react';
import axios from 'axios';
import CardSection from "./cardSection";

const { VITE_API_BASE_URL } = import.meta.env;

const FilterSection = () => {

    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(600);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get(`${VITE_API_BASE_URL}/api/expert/categories`);
                setAvailableCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        getCategories();
    }, []);

    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <>
        <div class="space-y-4 px-4 py-2 sm:px-6 lg:mx-100 lg:px-10 lg:py-8">
        <details class=" group relative overflow-hidden rounded border border-gray-300 shadow-sm">
            <summary class="cursor-pointer text-gray-700 bg-white flex items-center justify-between gap-2 p-3 text-white-700 transition-colors hover:text-gray-900 [&amp;::-webkit-details-marker]:hidden">
            <span class="text-sm font-medium"> Categories of Services </span>

            <span class="transition-transform group-open:-rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                </svg>
            </span>
            </summary>

            <div class="divide-y divide-gray-300 border-t border-gray-300 bg-white">
            <div class="flex items-center justify-between px-3 py-2">
                <span class="text-sm text-gray-700"> {selectedCategories.length} selected </span>

                <button type="button" onClick={() => setSelectedCategories([])} class="text-sm text-gray-700 underline transition-colors hover:text-gray-900">
                    Reset Filters
                </button>
            </div>

            <fieldset class="p-3">
                <legend class="sr-only">Checkboxes</legend>

                <div class="flex flex-col items-start gap-3">
                {/* 4. DYNAMIC MAPPING STARTS HERE */}
                {availableCategories.map((category, index) => (
                    <label key={index} htmlFor={`Category-${index}`} class="inline-flex items-center gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            class="size-5 rounded border-gray-300 shadow-sm" 
                            id={`Category-${index}`} 
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                        />
                        <span class="text-sm font-medium text-gray-700"> {category} </span>
                    </label>
                ))}
                {/* IF NO CATEGORIES EXIST */}
                {availableCategories.length === 0 && <span class="text-sm text-gray-400">No experts found.</span>}
                </div>
            </fieldset>
            </div>
        </details>

        <details class="group relative overflow-hidden rounded border border-gray-300 shadow-sm bg-white">
            <summary class="cursor-pointer flex items-center justify-between gap-2 p-3 text-gray-700 transition-colors hover:text-gray-900 [&amp;::-webkit-details-marker]:hidden">
            <span class="text-sm font-medium"> Hourly rate </span>

            <span class="transition-transform group-open:-rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                </svg>
            </span>
            </summary>

            <div class="divide-y divide-gray-300 border-t border-gray-300 bg-white">
            <div class="flex items-center justify-between px-3 py-2">
                <span class="text-sm text-gray-700"> Max price is ${maxPrice} </span>

                <button 
                    type="button" 
                    onClick={() => {setMinPrice(0); setMaxPrice(600);}}
                    class="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
                >
                Reset
                </button>
            </div>

            <div class="flex items-center gap-3 p-3">
                <label htmlFor="MinPrice">
                <span class="text-sm text-gray-700"> Min </span>
                <input 
                    type="number" 
                    id="MinPrice" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value)}
                    class="p-2 mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm" 
                />
                </label>

                <label htmlFor="MaxPrice">
                <span class="text-sm text-gray-700"> Max </span>
                <input 
                    type="number" 
                    id="MaxPrice" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)}
                    class="p-2 mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm" 
                />
                </label>
            </div>
            </div>
        </details>
        </div>
        
        <CardSection filters={{ categories: selectedCategories.join(','), minPrice, maxPrice }}/>
        </>
    );
}

export default FilterSection;