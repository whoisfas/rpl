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
            <span className="gradient-text">Perawatan Hewan Modern</span>
            <br />
            <span className="dark:text-white text-gray-900">Sistem Manajemen</span>
          </h1>
          <p className="text-xl dark:text-gray-300 text-gray-700 mb-8 max-w-2xl mx-auto">
            Kelola hewan peliharaan Anda dengan mudah. Pesan pakan, booking grooming, dan hotel hewan dalam satu platform modern.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Mulai Sekarang <ArrowRight className="inline ml-2 w-5 h-5" />
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
            <h2 className="text-4xl font-bold mb-4 gradient-text">Tentang Mixy Pet Shop</h2>
            <p className="dark:text-gray-400 text-gray-600 max-w-2xl mx-auto">
              Platform modern untuk manajemen perawatan hewan peliharaan Anda dengan fitur lengkap dan pengalaman pengguna yang premium.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-dark p-8 rounded-2xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 dark:text-white text-gray-900">Perawatan Penuh Kasih</h3>
              <p className="dark:text-gray-400 text-gray-600">Kami peduli dengan kesehatan dan kebahagiaan hewan peliharaan Anda seperti keluarga sendiri.</p>
            </div>
            
            <div className="glass-dark p-8 rounded-2xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6">
                <PawPrint className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 dark:text-white text-gray-900">Tim Ahli</h3>
              <p className="dark:text-gray-400 text-gray-600">Tim profesional berpengalaman dalam perawatan hewan peliharaan berbagai jenis.</p>
            </div>
            
            <div className="glass-dark p-8 rounded-2xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 dark:text-white text-gray-900">Produk Berkualitas</h3>
              <p className="dark:text-gray-400 text-gray-600">Pakan dan produk perawatan berkualitas tinggi untuk kebutuhan hewan peliharaan Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 relative">
        <div className="absolute inset-0 gradient-bg opacity-30"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Layanan Kami</h2>
            <p className="dark:text-gray-400 text-gray-600 max-w-2xl mx-auto">
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
                  <h3 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">Layanan Grooming</h3>
                  <p className="dark:text-gray-400 text-gray-600 mb-4">Layanan grooming profesional untuk menjaga kebersihan dan kesehatan hewan peliharaan Anda.</p>
                  <Link to="/register" className="text-primary-400 hover:text-primary-300 transition-colors">
                    Booking Sekarang <ArrowRight className="inline ml-1 w-4 h-4" />
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
                  <h3 className="text-2xl font-semibold mb-2 dark:text-white text-gray-900">Hotel Hewan</h3>
                  <p className="dark:text-gray-400 text-gray-600 mb-4">Hotel hewan dengan fasilitas lengkap dan perawatan 24 jam saat Anda bepergian.</p>
                  <Link to="/register" className="text-accent-400 hover:text-accent-300 transition-colors">
                    Booking Sekarang <ArrowRight className="inline ml-1 w-4 h-4" />
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
            <h2 className="text-4xl font-bold mb-4 gradient-text">Produk Premium</h2>
            <p className="dark:text-gray-400 text-gray-600 max-w-2xl mx-auto">
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
                  <h3 className="text-lg font-semibold mb-2 dark:text-white text-gray-900">Pakan Hewan Premium {i}</h3>
                  <p className="dark:text-gray-400 text-gray-600 text-sm mb-4">Nutrisi berkualitas tinggi untuk hewan peliharaan Anda</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold gradient-text">Rp {(i * 150000).toLocaleString()}</span>
                    <Link to="/register" className="text-sm text-primary-400 hover:text-primary-300">Lihat</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/register" className="btn-primary">
              Lihat Semua Produk <ArrowRight className="inline ml-2 w-5 h-5" />
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
              <h2 className="text-4xl font-bold mb-6 gradient-text">Grooming Profesional</h2>
              <p className="dark:text-gray-400 text-gray-600 mb-8 text-lg">
                Layanan grooming profesional dengan peralatan modern dan tenaga ahli berpengalaman. Hewan peliharaan Anda akan terlihat dan merasa lebih baik.
              </p>
              <ul className="space-y-4 mb-8">
                {['Mandi & Pengeringan', 'Potong & Styling Rambut', 'Pemotongan Kuku', 'Pembersihan Telinga', 'Pembersihan Gigi'].map((service, i) => (
                  <li key={i} className="flex items-center space-x-3 dark:text-gray-300 text-gray-700">
                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary">
                Booking Grooming <ArrowRight className="inline ml-2 w-5 h-5" />
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
              <h2 className="text-4xl font-bold mb-4 dark:text-white text-gray-900">Siap Memulai?</h2>
              <p className="dark:text-gray-300 text-gray-700 mb-8 text-lg">
                Bergabunglah dengan ribuan pelanggan yang puas dengan layanan kami
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Buat Akun
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
              <p className="dark:text-gray-400 text-gray-600">Sistem manajemen perawatan hewan modern untuk hewan peliharaan kesayangan Anda.</p>
            </div>
            
            <div>
              <h4 className="dark:text-white text-gray-900 font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 dark:text-gray-400 text-gray-600">
                <li><a href="#services" className="hover:dark:text-white hover:text-gray-900 transition-colors">Grooming</a></li>
                <li><a href="#services" className="hover:dark:text-white hover:text-gray-900 transition-colors">Hotel Hewan</a></li>
                <li><a href="#products" className="hover:dark:text-white hover:text-gray-900 transition-colors">Produk</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="dark:text-white text-gray-900 font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 dark:text-gray-400 text-gray-600">
                <li><a href="#about" className="hover:dark:text-white hover:text-gray-900 transition-colors">Tentang</a></li>
                <li><Link to="/login" className="hover:dark:text-white hover:text-gray-900 transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:dark:text-white hover:text-gray-900 transition-colors">Daftar</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="dark:text-white text-gray-900 font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 dark:text-gray-400 text-gray-600">
                <li><a href="#about" className="hover:dark:text-white hover:text-gray-900 transition-colors">Tentang</a></li>
                <li><Link to="/login" className="hover:dark:text-white hover:text-gray-900 transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:dark:text-white hover:text-gray-900 transition-colors">Daftar</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center dark:text-gray-400 text-gray-600">
            <p>&copy; 2024 Mixy Pet Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
