import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PawPrint, Scissors, Home, ShoppingCart, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8 animate-float">
            <PawPrint className="w-24 h-24 mx-auto text-primary-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Modern Pet Care</span>
            <br />
            <span className="text-white">Management System</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Kelola hewan peliharaan Anda dengan mudah. Pesan pakan, booking grooming, dan hotel hewan dalam satu platform modern.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Get Started <ArrowRight className="inline ml-2 w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">About Mixy Pet Shop</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Platform modern untuk manajemen perawatan hewan peliharaan Anda dengan fitur lengkap dan pengalaman pengguna yang premium.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-dark p-8 rounded-2xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Passionate Care</h3>
              <p className="text-gray-400">Kami peduli dengan kesehatan dan kebahagiaan hewan peliharaan Anda seperti keluarga sendiri.</p>
            </div>
            
            <div className="glass-dark p-8 rounded-2xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6">
                <PawPrint className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Expert Team</h3>
              <p className="text-gray-400">Tim profesional berpengalaman dalam perawatan hewan peliharaan berbagai jenis.</p>
            </div>
            
            <div className="glass-dark p-8 rounded-2xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Quality Products</h3>
              <p className="text-gray-400">Pakan dan produk perawatan berkualitas tinggi untuk kebutuhan hewan peliharaan Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 relative">
        <div className="absolute inset-0 gradient-bg opacity-30"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Our Services</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Layanan lengkap untuk kebutuhan hewan peliharaan Anda
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-2xl card-hover">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-7 h-7 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">Grooming Service</h3>
                  <p className="text-gray-400 mb-4">Layanan grooming profesional untuk menjaga kebersihan dan kesehatan hewan peliharaan Anda.</p>
                  <Link to="/register" className="text-primary-400 hover:text-primary-300 transition-colors">
                    Book Now <ArrowRight className="inline ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="glass p-8 rounded-2xl card-hover">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-accent-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Home className="w-7 h-7 text-accent-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">Pet Hotel</h3>
                  <p className="text-gray-400 mb-4">Hotel hewan dengan fasilitas lengkap dan perawatan 24 jam saat Anda bepergian.</p>
                  <Link to="/register" className="text-accent-400 hover:text-accent-300 transition-colors">
                    Book Now <ArrowRight className="inline ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section id="products" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Premium Products</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Koleksi pakan dan produk perawatan berkualitas tinggi
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-dark rounded-2xl overflow-hidden card-hover">
                <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                  <PawPrint className="w-16 h-16 text-primary-400/50" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-white">Premium Pet Food {i}</h3>
                  <p className="text-gray-400 text-sm mb-4">High-quality nutrition for your pet</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold gradient-text">Rp {(i * 150000).toLocaleString()}</span>
                    <Link to="/register" className="text-sm text-primary-400 hover:text-primary-300">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/register" className="btn-primary">
              View All Products <ArrowRight className="inline ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Grooming Preview */}
      <section id="grooming" className="py-24 px-4 relative">
        <div className="absolute inset-0 gradient-bg opacity-30"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 gradient-text">Professional Grooming</h2>
              <p className="text-gray-400 mb-8 text-lg">
                Layanan grooming profesional dengan peralatan modern dan tenaga ahli berpengalaman. Hewan peliharaan Anda akan terlihat dan merasa lebih baik.
              </p>
              <ul className="space-y-4 mb-8">
                {['Bathing & Drying', 'Hair Cutting & Styling', 'Nail Trimming', 'Ear Cleaning', 'Teeth Cleaning'].map((service, i) => (
                  <li key={i} className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary">
                Book Grooming <ArrowRight className="inline ml-2 w-5 h-5" />
              </Link>
            </div>
            
            <div className="glass rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center">
                    <Scissors className="w-12 h-12 text-primary-400/50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Bergabunglah dengan ribuan pelanggan yang puas dengan layanan kami
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Create Account
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-dark py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold gradient-text mb-4">Mixy Pet Shop</h3>
              <p className="text-gray-400">Modern pet care management system for your beloved pets.</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-white transition-colors">Grooming</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Pet Hotel</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@mixy.com</li>
                <li>+62 812 3456 7890</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mixy Pet Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
