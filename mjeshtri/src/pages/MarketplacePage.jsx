import FilterSection from "../Components/Marketplace/filterSection";

const MarketplacePage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        Find an Expert
                    </h1>
                    <p className="mt-2 text-gray-600 text-base sm:text-lg max-w-2xl">
                        Browse professionals by category and hourly rate. Filter and compare to find the right fit.
                    </p>
                </div>
            </div>
            <FilterSection />
        </div>
    );
};

export default MarketplacePage;
