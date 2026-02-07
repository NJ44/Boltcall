
import { useState, useEffect } from 'react';
import {
    Phone,
    MapPin,
    Clock,
    ArrowRight,
    Check,
    Star,
    Calendar,
    MessageCircle,
    Menu,
    X,
    Instagram,
    Facebook,
    Linkedin
} from 'lucide-react';

const DrHazakLandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'About', href: '#about' },
        { name: 'Team', href: '#team' },
        { name: 'Treatments', href: '#treatments' },
        { name: 'Articles', href: '#articles' },
        { name: 'Contact', href: '#contact' },
    ];

    const services = [
        { title: 'Teeth Whitening', icon: <Star className="w-6 h-6" /> },
        { title: 'Dental Implants', icon: <Check className="w-6 h-6" /> },
        { title: 'Orthodontics', icon: <ArrowRight className="w-6 h-6" /> },
        { title: 'Root Canal', icon: <Clock className="w-6 h-6" /> },
        { title: 'Crowns & Bridges', icon: <MapPin className="w-6 h-6" /> },
        { title: 'Gum Treatment', icon: <Phone className="w-6 h-6" /> },
    ];

    const team = [
        { name: 'Dr. John Doe', role: 'Chief Dentist', image: 'https://images.unsplash.com/photo-1537368910025-bc005ca6278b?q=80&w=1000&auto=format&fit=crop' },
        { name: 'Dr. Jane Smith', role: 'Orthodontist', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop' },
        { name: 'Dr. Mike Ross', role: 'Surgeon', image: 'https://images.unsplash.com/photo-1622253692010-33318b716971?q=80&w=1000&auto=format&fit=crop' },
    ];

    return (
        <div className="min-h-screen bg-[#f5f5f5] font-['IBM_Plex_Sans'] text-[#363636]">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
                <div className="container mx-auto px-6">
                    <div className={`bg-white/80 backdrop-blur-md rounded-full shadow-lg px-6 py-3 flex items-center justify-between border border-[#dddedf] max-w-6xl mx-auto`}>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#ffd64f] rounded-full flex items-center justify-center font-bold text-xl font-['Poppins']">
                                H
                            </div>
                            <span className="font-bold text-xl font-['Poppins'] tracking-tight">Dr. Hazak</span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="text-sm font-medium hover:text-[#ffd64f] transition-colors">
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <a href="#contact" className="hidden md:flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#fc5778] transition-colors">
                                <Calendar className="w-4 h-4" />
                                <span>Book Now</span>
                            </a>
                            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-4 md:hidden">
                        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                    {link.name}
                                </a>
                            ))}
                            <a href="#contact" className="bg-[#ffd64f] text-black w-full py-3 rounded-full text-center font-bold">
                                Book Appointment
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute -inset-4 bg-[#ffd64f]/20 rounded-[3rem] -z-10 rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2000&auto=format&fit=crop"
                                alt="Dental Team"
                                className="rounded-[2.5rem] shadow-2xl w-full object-cover h-[500px] md:h-[600px]"
                            />

                            {/* Floating Badge */}
                            <div className="absolute bottom-8 left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce duration-3000">
                                <div className="bg-[#dcfce7] p-3 rounded-xl text-[#16a34a]">
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg font-['Poppins']">5.0 Rating</p>
                                    <p className="text-sm text-gray-500">Trusted by patients</p>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 md:order-2 space-y-8">
                            <div className="inline-block px-4 py-1.5 bg-white border border-[#dddedf] rounded-full text-sm font-medium tracking-wide">
                                PREMIER DENTAL CARE
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold font-['Poppins'] leading-tight">
                                Your Smile Begins <br />
                                <span className="relative inline-block">
                                    With Us
                                    <span className="absolute bottom-2 left-0 w-full h-3 bg-[#ffd64f]/40 -z-10"></span>
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                                Experience world-class dental care with state-of-the-art technology and a gentle touch. We are dedicated to restoring your smile and confidence.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-[#363636] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                                    Schedule Visit <ArrowRight className="w-4 h-4" />
                                </button>
                                <button className="px-8 py-4 bg-white border border-[#dddedf] rounded-full font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                    <Phone className="w-4 h-4" /> Call (555) 123-4567
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                                <div>
                                    <h3 className="text-3xl font-bold font-['Poppins']">15+</h3>
                                    <p className="text-sm text-gray-500">Years Experience</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold font-['Poppins']">2k+</h3>
                                    <p className="text-sm text-gray-500">Happy Patients</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold font-['Poppins']">50+</h3>
                                    <p className="text-sm text-gray-500">Awards Won</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="treatments" className="py-24 bg-white rounded-t-[3rem] md:rounded-t-[5rem]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold font-['Poppins']">Our Treatments</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive dental solutions tailored to your unique needs using the latest technology.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="group p-8 rounded-[2rem] bg-[#f9fafb] hover:bg-white border border-transparent hover:border-[#ffd64f] hover:shadow-2xl transition-all duration-300">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform text-[#ffd64f]">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold font-['Poppins'] mb-3">{service.title}</h3>
                                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                                <a href="#" className="inline-flex items-center text-sm font-bold text-black border-b border-black pb-0.5 group-hover:text-[#fc5778] group-hover:border-[#fc5778] transition-colors">
                                    Learn More
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="py-24 bg-[#f5f5f5]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="space-y-4">
                            <span className="text-[#fc5778] font-bold tracking-widest text-sm uppercase">The Experts</span>
                            <h2 className="text-3xl md:text-5xl font-bold font-['Poppins']">Meet Our Team</h2>
                        </div>
                        <button className="px-6 py-3 border border-black rounded-full font-medium hover:bg-black hover:text-white transition-all">
                            View All Members
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="relative group">
                                <div className="overflow-hidden rounded-[2.5rem] h-[500px] md:h-[450px] lg:h-[550px] relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                                        <div className="flex gap-4 mb-4">
                                            <div className="p-2 bg-white rounded-full hover:bg-[#ffd64f] cursor-pointer transition-colors"><Instagram size={18} /></div>
                                            <div className="p-2 bg-white rounded-full hover:bg-[#ffd64f] cursor-pointer transition-colors"><Linkedin size={18} /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <h3 className="text-2xl font-bold font-['Poppins']">{member.name}</h3>
                                    <p className="text-[#fc5778] font-medium">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Infinite Scroll Banner - Placeholder */}
            <section className="py-12 bg-black overflow-hidden transform -rotate-1 origin-left scale-105">
                <div className="flex gap-12 whitespace-nowrap animate-marquee text-white/40 font-bold text-4xl md:text-6xl font-['Poppins']">
                    <span>ORTHODONTICS • IMPLANTS • WHITENING • SURGERY • COSMETIC •</span>
                    <span>ORTHODONTICS • IMPLANTS • WHITENING • SURGERY • COSMETIC •</span>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="bg-[#ffd64f] rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold font-['Poppins'] mb-6">Let's Discuss Your Smile</h2>
                                <p className="text-lg text-black/70 mb-8 max-w-md">
                                    Ready to transform your smile? Schedule a consultation today and take the first step towards a healthier, brighter smile.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Phone</p>
                                            <p className="font-bold text-lg">+1 (555) 123-4567</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Location</p>
                                            <p className="font-bold text-lg">123 Dental Street, NY 10001</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                            <MessageCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Email</p>
                                            <p className="font-bold text-lg">hello@drhazak.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl">
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold ml-1">First Name</label>
                                            <input type="text" className="w-full px-6 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#ffd64f]" placeholder="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold ml-1">Last Name</label>
                                            <input type="text" className="w-full px-6 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#ffd64f]" placeholder="Doe" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Email Address</label>
                                        <input type="email" className="w-full px-6 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#ffd64f]" placeholder="john@example.com" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Service Interested In</label>
                                        <select className="w-full px-6 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#ffd64f]">
                                            <option>General Checkup</option>
                                            <option>Teeth Whitening</option>
                                            <option>Implants</option>
                                            <option>Orthodontics</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Message</label>
                                        <textarea rows={4} className="w-full px-6 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#ffd64f]" placeholder="How can we help you?"></textarea>
                                    </div>

                                    <button className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-[#fc5778] transition-colors shadow-lg">
                                        Book Appointment
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-20 rounded-t-[3rem] mt-[-3rem] relative z-0">
                <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#ffd64f] rounded-full flex items-center justify-center font-bold text-xl text-black font-['Poppins']">
                                H
                            </div>
                            <span className="font-bold text-xl font-['Poppins']">Dr. Hazak</span>
                        </div>
                        <p className="text-gray-400 max-w-sm">
                            Transforming lives through smiles. We provide exceptional dental care in a comfortable and modern environment.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffd64f] hover:text-black transition-all"><Facebook size={20} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffd64f] hover:text-black transition-all"><Instagram size={20} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffd64f] hover:text-black transition-all"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 font-['Poppins']">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400">
                            {navLinks.map(link => (
                                <li key={link.name}><a href={link.href} className="hover:text-[#ffd64f] transition-colors">{link.name}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 font-['Poppins']">Opening Hours</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex justify-between"><span>Mon - Fri</span> <span>9:00 - 18:00</span></li>
                            <li className="flex justify-between"><span>Saturday</span> <span>10:00 - 15:00</span></li>
                            <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
                    © 2026 Dr. Hazak Dental Clinic. All rights reserved.
                </div>
            </footer>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
                <button className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <MessageCircle className="w-7 h-7" />
                </button>
                <button className="w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-[#ffd64f]">
                    <Calendar className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default DrHazakLandingPage;
