import { useState, useEffect } from 'react';
import axios from 'axios';
import CardSection from "./cardSection";

const { VITE_API_BASE_URL } = import.meta.env;

const FilterSection = () => {

    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(null);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
                <aside className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900">Filters</h3>
                            <button
                                onClick={() => { setSelectedCategories([]); setMinPrice(0); setMaxPrice(null); }}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                            <div className="flex flex-col gap-2.5 max-h-52 overflow-auto pr-1">
                                {availableCategories.map((category, index) => (
                                    <label key={index} className="inline-flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                        <span>{category}</span>
                                    </label>
                                ))}
                                {availableCategories.length === 0 && (
                                    <span className="text-sm text-gray-500">No categories available</span>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Hourly rate</h4>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min={0}
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Min"
                                />
                                <span className="text-gray-400 shrink-0">–</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Max"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Up to ${maxPrice}/hr</p>
                        </div>
                    </div>
                </aside>

                <main className="lg:col-span-3">
                    <CardSection filters={{ categories: selectedCategories.join(','), minPrice, maxPrice }} />
                </main>
            </div>
        </div>
    );
}

export default FilterSection;