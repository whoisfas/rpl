import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PawPrint, Scissors, Home, ShoppingCart, Heart, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { productService, newsService, groomingService } from '../services/supabase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const LandingPage = () => {
  const [premiumProducts, setPremiumProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [groomingServices, setGroomingServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, newsData, groomingData] = await Promise.all([
        productService.getAllProducts(),
        newsService.getAllNews(),
        groomingService.getAllGroomingServices()
      ]);
      const premium = productsData?.filter(p => p.is_premium) || [];
      setPremiumProducts(premium.slice(0, 4));
      setNews(newsData?.slice(0, 3) || []);
      setGroomingServices(groomingData?.slice(0, 4) || []);
    } catch (err) {
      console.error('Gagal memuat data:', err);
    } finally {
      setLoading(false);
    }
  };

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

      {/* News Section */}
      <section id="news" className="py-24 px-4 relative">
        <div className="absolute inset-0 gradient-bg opacity-30"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <Newspaper className="w-8 h-8 text-primary-400" />
              <h2 className="text-4xl font-bold gradient-text">Berita Terkini</h2>
            </div>
            <Link to="/register" className="text-primary-400 hover:text-primary-300 transition-colors flex items-center space-x-2">
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Hero News Carousel */}
          {loading ? (
            <div className="h-[500px] bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl animate-pulse"></div>
          ) : news.length > 0 ? (
            <div className="relative">
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev'
                }}
                pagination={{
                  clickable: true,
                  el: '.swiper-pagination'
                }}
                loop={true}
                className="hero-swiper"
              >
                {news.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center">
                          <Newspaper className="w-24 h-24 text-primary-400/50" />
                        </div>
                      )}
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <div className="max-w-3xl">
                          <div className="flex items-center space-x-4 mb-4">
                            <span className="px-3 py-1 bg-primary-500/80 text-white text-xs font-medium rounded-full">
                              Berita
                            </span>
                            <span className="dark:text-gray-300 text-gray-300 text-sm">
                              {new Date(item.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="dark:text-gray-400 text-gray-400 text-sm">
                              Admin
                            </span>
                          </div>

                          <h3 className="text-2xl md:text-4xl font-bold dark:text-white text-white mb-4 line-clamp-2">
                            {item.title}
                          </h3>

                          <p className="dark:text-gray-200 text-gray-200 text-sm md:text-base mb-6 line-clamp-2">
                            {item.content}
                          </p>

                          <Link
                            to="/register"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
                          >
                            <span>Baca Selengkapnya</span>
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              <button className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors">
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Pagination */}
              <div className="swiper-pagination absolute bottom-8 right-8"></div>
            </div>
          ) : (
            <div className="text-center dark:text-gray-400 text-gray-600 py-12">
              Belum ada berita
            </div>
          )}
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
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-dark rounded-2xl overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 animate-pulse"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                    <div className="h-3 bg-white/10 rounded animate-pulse"></div>
                    <div className="h-6 bg-white/10 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))
            ) : premiumProducts.length > 0 ? (
              premiumProducts.map((product) => (
                <div key={product.id} className="glass-dark rounded-2xl overflow-hidden card-hover">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                      <PawPrint className="w-16 h-16 text-primary-400/50" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white text-gray-900">{product.name}</h3>
                    <p className="dark:text-gray-400 text-gray-600 text-sm mb-4">{product.description || 'Produk premium berkualitas'}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold gradient-text">Rp {(product.price || 0).toLocaleString()}</span>
                      <Link to="/register" className="text-sm text-primary-400 hover:text-primary-300">Lihat</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center dark:text-gray-400 text-gray-600 py-12">
                Belum ada produk premium
              </div>
            )}
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
                {loading ? (
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl animate-pulse"></div>
                  ))
                ) : groomingServices.length > 0 ? (
                  groomingServices.map((service) => (
                    <div key={service.id} className="aspect-square rounded-xl overflow-hidden relative group">
                      {service.image_url ? (
                        <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                          <Scissors className="w-12 h-12 text-primary-400/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <span className="text-white text-sm font-medium line-clamp-1">{service.name}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center">
                      <Scissors className="w-12 h-12 text-primary-400/50" />
                    </div>
                  ))
                )}
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
