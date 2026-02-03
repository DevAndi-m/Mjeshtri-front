const ReviewSection = () => {
    return (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
            <h2 className="text-2xl font-bold md:text-4xl md:leading-tight text-foreground">What Our Users Say</h2>
            <p className="mt-1 text-muted-foreground-2">See how game-changing companies are making the most of every engagement with Preline.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <a className="group flex flex-col h-full bg-layer border border-layer-line hover:border-transparent hover:shadow-lg focus:outline-hidden focus:border-transparent focus:shadow-lg transition duration-300 rounded-xl p-5" href="#">
            <div className="aspect-w-16 aspect-h-11">
                <img className="w-full object-cover rounded-xl" src="https://homeyou.s3.amazonaws.com/media/Painting2/Painting.jpg" alt="Blog Image" />
            </div>
            <div className="my-6">
                <h3 className="text-xl font-semibold text-foreground">
                I think this is perfect!
                </h3>
                <p className="mt-5 text-muted-foreground-2">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad blanditiis accusamus enim esse voluptas? Similique beatae numquam neque aliquam! Doloribus optio pariatur error, harum architecto esse eos placeat dolore laborum?
                </p>
            </div>
            <div className="mt-auto flex items-center gap-x-3">
                <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar" />
                <div>
                <h5 className="text-sm text-foreground">By Lauren Waller</h5>
                </div>
            </div>
            </a>
            <a className="group flex flex-col h-full bg-layer border border-layer-line hover:border-transparent hover:shadow-lg focus:outline-hidden focus:border-transparent focus:shadow-lg transition duration-300 rounded-xl p-5" href="#">
            <div className="aspect-w-16 aspect-h-11">
                <img className="w-full object-cover rounded-xl" src="https://thumbs.dreamstime.com/b/vintage-ford-thunderbird-convertible-classic-car-race-mille-miglia-june-predappio-fc-italy-428045922.jpg" alt="Blog Image" />
            </div>
            <div className="my-6">
                <h3 className="text-xl font-semibold text-foreground">
                I just got my car fixed with Mjeshtri, amazing service!
                </h3>
                <p className="mt-5 text-muted-foreground-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quibusdam veniam, accusantium, ut quisquam architecto dolorum molestiae totam maiores iusto voluptate atque? Expedita reiciendis natus iusto ratione fugiat? Praesentium, obcaecati.
                </p>
            </div>
            <div className="mt-auto flex items-center gap-x-3">
                <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar" />
                <div>
                <h5 className="text-sm text-foreground">By Aaron Larsson</h5>
                </div>
            </div>
            </a>
            <a className="group flex flex-col h-full bg-layer border border-layer-line hover:border-transparent hover:shadow-lg focus:outline-hidden focus:border-transparent focus:shadow-lg transition duration-300 rounded-xl p-5" href="#">
            <div className="aspect-w-16 aspect-h-11">
                <img className="w-full object-cover rounded-xl" src="https://media.architecturaldigest.com/photos/65e208d800c17df358c28a7d/master/w_1024%2Cc_limit/17_Gardeners-Dream.jpg" alt="Blog Image" />
            </div>
            <div className="my-6">
                <h3 className="text-xl font-semibold text-foreground">
                My garden has never looked better!
                </h3>
                <p className="mt-5 text-muted-foreground-2">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro est delectus dolor modi. Minus assumenda nisi maxime harum veritatis magnam sequi maiores, sint delectus soluta quam aliquam deleniti dolores suscipit.
                </p>
            </div>
            <div className="mt-auto flex items-center gap-x-3">
                <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar" />
                <div>
                <h5 className="text-sm text-foreground">By Lauren Waller</h5>
                </div>
            </div>
            </a>
        </div>
        </div>
    );
}

export default ReviewSection