import { InteractiveCheckout, type Product } from '../components/ui/interactive-checkout';

const demoProducts: Product[] = [
    {
        id: "1",
        name: "Air Max 90",
        price: 129.99,
        category: "Running",
        image: "https://images.unsplash.com/photo-1542291026-7ec0c45ec0c4?w=400&h=400&fit=crop&crop=center",
        color: "Black/White",
    },
    {
        id: "2",
        name: "Ultra Boost",
        price: 179.99,
        category: "Performance",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center",
        color: "Grey/Blue",
    },
    {
        id: "3",
        name: "Classic Trainer",
        price: 89.99,
        category: "Casual",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&crop=center",
        color: "White/Red",
    },
    {
        id: "4",
        name: "Retro Runner",
        price: 149.99,
        category: "Vintage",
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&crop=center",
        color: "Navy/Orange",
    },
    {
        id: "5",
        name: "Trail Blazer",
        price: 199.99,
        category: "Hiking",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop&crop=center",
        color: "Brown/Green",
    },
];

function InteractiveCheckoutDemo() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Interactive Checkout Demo
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Experience our modern shopping cart with smooth animations and real-time updates
                    </p>
                </div>
                
                <InteractiveCheckout products={demoProducts} />
                
                <div className="mt-12 text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">✨ Animations</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Smooth transitions powered by Framer Motion
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">📱 Responsive</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Works perfectly on all device sizes
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">🎨 Modern UI</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Built with Tailwind CSS and shadcn/ui
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">⚡ Real-time</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Instant updates with NumberFlow animations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InteractiveCheckoutDemo;
