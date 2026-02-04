const CardSection = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 lg:mx-10 xl:mx-32 mb-10">
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 transition-all hover:scale-[1.01] duration-600 cursor-pointer bg-white">
                <img className="w-full h-48 object-cover" src="https://market-resized.envatousercontent.com/photodune.net/EVA/TRX/41/f5/c6/f7/be/v1_E10/E10Q1AA.jpg?auto=format&q=94&mark=https%3A%2F%2Fassets.market-storefront.envato-static.com%2Fwatermarks%2Fphoto-260724.png&opacity=0.2&cf_fit=contain&w=590&h=884&s=a497ec0ea2b9f5dc9c0d759742c9877750af9c16af9442e99e8b7f898f922c6e" alt="Service 1" />
                <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Name of expert</h3>
                <p className="text-gray-600 mb-4">Category</p>
                <span className="text-blue-600 font-medium">$50 per hour</span>
                <a href="#" className="block rounded-sm p-2 mt-5 text-sm text-white bg-blue-600 text-center hover:underline">View Details</a>
                </div>
            </div>
        </div>
    );
}

export default CardSection;