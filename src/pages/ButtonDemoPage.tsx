
import { Button } from '@/components/ui/Button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ButtonDemoPage = () => {
    return (
        <div className="min-h-screen bg-bg">
            <Header />
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl font-heading mb-8 text-text">Button Component Demo</h1>
                <p className="mb-12 text-lg text-text">
                    This page demonstrates the various styles and states of the new neo-brutalist Button component.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Standard Variants */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-heading text-text border-b-2 border-border pb-2">Standard Variants</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Button>Default Button</Button>
                                <span className="text-sm text-text">Default (Primary)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="noShadow">No Shadow</Button>
                                <span className="text-sm text-text">No Shadow</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="neutral">Neutral</Button>
                                <span className="text-sm text-text">Neutral</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="reverse">Reverse</Button>
                                <span className="text-sm text-text">Reverse</span>
                            </div>
                        </div>
                    </div>

                    {/* Compatibility Aliases */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-heading text-text border-b-2 border-border pb-2">Compatibility Aliases</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Button variant="primary">Primary (Alias)</Button>
                                <span className="text-sm text-text">Same as Default</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="secondary">Secondary</Button>
                                <span className="text-sm text-text">Mapped to Neutral</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="destructive">Destructive</Button>
                                <span className="text-sm text-text">Red Background</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="outline">Outline</Button>
                                <span className="text-sm text-text">Mapped to Neutral</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="ghost">Ghost</Button>
                                <span className="text-sm text-text">Transparent</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="link">Link</Button>
                                <span className="text-sm text-text">Underline</span>
                            </div>
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-heading text-text border-b-2 border-border pb-2">Sizes</h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon">Icon</Button>
                        </div>
                    </div>

                    {/* States */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-heading text-text border-b-2 border-border pb-2">States</h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button disabled>Disabled</Button>
                            <Button disabled variant="neutral">Disabled Neutral</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ButtonDemoPage;
