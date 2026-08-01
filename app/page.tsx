// @ts-nocheck
"use client"
import React, { useState, useEffect } from 'react';


// =========================================================================
// 🚀 PERSIAPAN VS CODE (PENTING)
// 1. Install package di terminal VS Code: npm install @supabase/supabase-js lucide-react
// 2. UNCOMMENT baris import di bawah ini:
// =========================================================================
import { createClient } from '@supabase/supabase-js';
import { 
  Calendar, Check, ChevronRight, Clock, Star, Users, MapPin, 
  User, BookOpen, Heart, Activity, Settings, 
  LayoutDashboard, Menu, X, CheckCircle2, ChevronLeft, CreditCard,
  Image as ImageIcon, Quote, ChevronDown, Plus, Edit2, Trash2,
  Mail, Phone, Eye, LogOut
} from 'lucide-react';

import { supabase } from '../lib/supabase';

// =========================================================================
// 🚀 SUPABASE CONFIGURATION
// Ganti dengan URL dan ANON KEY dari project Supabase Anda.
// =========================================================================


const injectStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('lunilooks-styles')) return; 
  const style = document.createElement('style');
  style.id = 'lunilooks-styles';
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
    
    :root {
      --brand-beige: #FDFBF7;
      --brand-cream: #F5EFE6;
      --brand-soft-pink: #E8C7C8;
      --brand-dark: #2D2A26;
      --brand-gold: #D4AF37;
    }
    
    html { scroll-behavior: smooth; }
    body { 
      font-family: 'Inter', sans-serif; 
      background-color: var(--brand-beige); 
      color: var(--brand-dark); 
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3, h4, .font-serif { font-family: 'Playfair Display', serif; }
    
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #E8C7C8; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #DDBEA9; }
    
    .glass-nav { 
      background: rgba(253, 251, 247, 0.85); 
      backdrop-filter: blur(12px); 
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(45, 42, 38, 0.05); 
    }
    
    .fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
    
    .masonry-grid { column-count: 1; column-gap: 1rem; }
    @media (min-width: 640px) { .masonry-grid { column-count: 2; } }
    @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
    .masonry-item { break-inside: avoid; margin-bottom: 1rem; }
  `;
  document.head.appendChild(style);
};

const CURRENT_DATE = new Date(); // Dinamis menggunakan tanggal hari ini
const EARLY_BIRD_END = new Date('2026-08-03T23:59:59');

const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  const base = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background active:scale-[0.98]";
  const variants = {
    primary: "bg-[#2D2A26] text-white hover:bg-[#1A1A1A] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]",
    secondary: "bg-[#E8C7C8] text-[#2D2A26] hover:bg-[#DDBEA9] shadow-sm",
    outline: "border border-[#2D2A26] bg-transparent hover:bg-[#F5EFE6] text-[#2D2A26]",
    ghost: "hover:bg-[#F5EFE6] text-[#2D2A26]"
  };
  const sizes = {
    default: "h-11 py-2 px-6",
    sm: "h-9 px-4 rounded-md",
    lg: "h-14 px-8 rounded-xl text-base",
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className = '', error, label, ...props }) => (
  <div className="w-full space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input 
      className={`flex h-11 w-full rounded-lg border ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#E8C7C8] focus:ring-[#E8C7C8]'} bg-white/50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
      {...props} 
    />
    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
  </div>
);

const Card = ({ children, className = '', hover = false }: any) => (
  <div className={`rounded-2xl border border-gray-100 bg-white text-gray-950 shadow-sm ${hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }: any) => {
  const variants = {
    default: "bg-[#2D2A26] text-white",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    pink: "bg-[#E8C7C8] text-[#2D2A26]"
  };
  return (
    <div className={`inline-flex items-center rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const LandingPage = ({ onNavigate }: any) => {
  const isEarlyBird = CURRENT_DATE <= EARLY_BIRD_END;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (data) setGallery(data.map(item => item.url));
    };
    fetchGallery();
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 64; 
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - navHeight, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const mockTestimonials = [
    { name: "Siska Saraswati", role: "Mahasiswi", text: "Awalnya sama sekali nggak ngerti makeup, selalu abu-abu. Ikut kelas ini step-by-stepnya jelas banget, sekarang bisa makeup natural ke kampus dalam 10 menit!", rating: 5 },
    { name: "Dinda Kirana", role: "Karyawan Swasta", text: "Sherly sabar banget ngajarinnya. Complexion aku yang tadinya suka crack sekarang flawless tahan seharian buat di kantor. Worth it banget!", rating: 5 },
    { name: "Nadia Utami", role: "Calon Pengantin", text: "Ikut ini buat prewed sendiri, dan hasilnya memuaskan! Modul PDF-nya juga kepake banget buat contekan pas lagi lupa urutannya.", rating: 5 },
  ];

  const mockFaqs = [
    { q: "Apakah harus bawa alat makeup sendiri?", a: "Disarankan membawa alat makeup yang biasa dipakai sehari-hari agar mentor bisa mereview produkmu. Namun kami juga menyediakan alat dan produk basic yang bisa dipinjam selama kelas." },
    { q: "Saya sama sekali belum pernah makeup, apakah bisa ikut?", a: "Sangat bisa! Kelas ini didesain khusus mulai dari level sangat pemula (zero knowledge) hingga bisa mandiri." },
    { q: "Apakah produk yang digunakan aman untuk kulit sensitif?", a: "Kami menggunakan produk-produk drugstore hingga high-end yang teruji aman. Jika kamu punya alergi spesifik, sangat disarankan membawa skincare/base makeup sendiri." },
    { q: "Berapa lama durasi kelasnya?", a: "Satu sesi berdurasi kurang lebih 3 jam (termasuk teori, demo, praktik, dan sesi foto)." }
  ];

  return (
    <div className="min-h-screen relative">
      <nav className="fixed top-0 w-full glass-nav z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-serif text-2xl font-bold tracking-tight cursor-pointer" onClick={() => window.scrollTo(0,0)}>Lunilooks.</div>
          
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <a href="#materi" onClick={(e) => scrollToSection(e, 'materi')} className="hover:text-black transition-colors cursor-pointer">Class Modules</a>
            <a href="#mentor" onClick={(e) => scrollToSection(e, 'mentor')} className="hover:text-black transition-colors cursor-pointer">Mentor</a>
            <a href="#gallery" onClick={(e) => scrollToSection(e, 'gallery')} className="hover:text-black transition-colors cursor-pointer">Gallery</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-black transition-colors cursor-pointer">FAQ</a>
          </div>
          
          <div className="hidden md:block">
            <Button size="sm" onClick={() => onNavigate('/booking')}>Book Class</Button>
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col space-y-4 fade-in-up">
            <a href="#materi" onClick={(e) => scrollToSection(e, 'materi')} className="text-gray-600 font-medium">Class Modules</a>
            <a href="#mentor" onClick={(e) => scrollToSection(e, 'mentor')} className="text-gray-600 font-medium">Mentor</a>
            <a href="#gallery" onClick={(e) => scrollToSection(e, 'gallery')} className="text-gray-600 font-medium">Gallery</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-gray-600 font-medium">FAQ</a>
            <Button className="w-full" onClick={() => { setMobileMenuOpen(false); onNavigate('/booking'); }}>Book Class</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 space-y-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Badge variant="pink" className="animate-pulse">✨ Road to 17 Agustus Special Batch</Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1] text-gray-900">
            Stop Bilang <br/>
            <span className="italic text-gray-400 font-light">"Aku Gak Bisa Makeup"</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
            Karena sebenarnya kamu hanya belum menemukan teknik yang tepat. Ikuti Self Makeup Class bersama Lunilooks dan pelajari makeup natural yang mudah diterapkan untuk aktivitas sehari-hari.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button size="lg" onClick={() => onNavigate('/booking')}>Daftar Sekarang</Button>
            <Button variant="outline" size="lg" onClick={(e) => scrollToSection(e, 'materi')}>Lihat Detail Kelas</Button>
          </div>
        </div>
        <div className="flex-1 w-full fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group">
            <img 
              src="/image/hero.webp?auto=format&fit=crop&q=80" 
              alt="Lunilooks Beauty Makeup" 
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium tracking-wider uppercase">Pendaftaran Dibuka</span>
              </div>
              <h3 className="text-2xl font-serif">Batch Perdana Terbatas</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Pricing Banner */}
      <section className="bg-gradient-to-b from-transparent to-white py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center relative overflow-hidden border border-gray-50 fade-in-up">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#2D2A26]"></div>
          <h2 className="text-3xl font-serif mb-2 text-gray-900">❤️🤍 Road to 17 Agustus Promo</h2>
          <p className="text-gray-500 mb-10">Batch pertama khusus menyambut kemerdekaan.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
            <div className={`transition-all duration-300 ${isEarlyBird ? 'scale-110' : 'opacity-40 grayscale line-through'}`}>
              <div className="text-xs font-bold text-red-500 tracking-widest uppercase mb-2">Early Bird (29 Juli - 3 Agustus)</div>
              <div className="text-5xl font-serif font-bold text-gray-900">Rp499k</div>
            </div>
            <div className="hidden md:block w-px h-20 bg-gray-100"></div>
            <div className={`transition-all duration-300 ${!isEarlyBird ? 'scale-110' : 'opacity-40 line-through'}`}>
              <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Normal Price</div>
              <div className="text-4xl font-serif font-bold text-gray-400">Rp600k</div>
            </div>
          </div>
          
          {isEarlyBird ? (
            <div className="mt-10 inline-flex items-center gap-2 bg-red-50 text-red-700 px-5 py-2.5 rounded-full text-sm font-medium border border-red-100">
              <Clock className="w-4 h-4 animate-spin-slow" /> Promo Early Bird akan segera berakhir!
            </div>
          ) : (
            <div className="mt-10 inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-5 py-2.5 rounded-full text-sm font-medium border border-gray-200">
              Masa Promo Early Bird Telah Berakhir
            </div>
          )}
        </div>
      </section>

      {/* Materi Grid */}
      <section id="materi" className="py-24 bg-white px-4 border-t border-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-serif mb-4 text-gray-900">Kurikulum Kelas</h2>
            <p className="text-gray-500 text-lg">Step-by-step materi dirancang khusus agar mudah dipahami pemula.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Skin Preparation', 'Face Analysis', 'Base Makeup', 'Eyebrow Mastery', 'Eye Makeup', 'Blush & Contour', 'Lip Technique', 'Final Touch & Setting'].map((materi, i) => (
              <Card key={i} hover className="p-8 bg-[#FDFBF7] border-none fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-[#D4AF37] font-serif font-bold text-xl border border-gray-50">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{materi}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Teknik dasar dan pengaplikasian yang tepat untuk hasil flawless dan tahan lama.</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Target */}
      <section className="py-24 px-4 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="fade-in-up">
            <Badge variant="default" className="mb-6">Target Peserta</Badge>
            <h2 className="text-4xl font-serif mb-8 text-gray-900">Kelas Ini Sangat Cocok Untuk...</h2>
            <ul className="space-y-5">
              {['Pemula yang belum pernah makeup sama sekali', 'Mahasiswi & Wanita Bekerja yang butuh makeup cepat', 'Beauty Enthusiast yang ingin perhalus teknik', 'Content Creator pemula', 'Calon Pengantin (untuk prewedding/daily)'].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-lg text-gray-700">
                  <div className="mt-1 bg-white rounded-full p-1 shadow-sm"><CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /></div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-50 fade-in-up">
            <h2 className="text-3xl font-serif mb-8 text-gray-900">Apa yang Kamu Dapatkan?</h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: User, text: 'Praktik Langsung (Hands-on)' },
                { icon: BookOpen, text: 'Modul Digital PDF' },
                { icon: Star, text: 'Sertifikat Kehadiran' },
                { icon: ImageIcon, text: 'Foto Dokumentasi Profesional' },
                { icon: Activity, text: 'Sesi Konsultasi Personal' },
                { icon: CreditCard, text: 'Voucher Diskon Lunilooks' },
              ].map((benefit, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F5EFE6] flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-[#2D2A26]" />
                  </div>
                  <span className="font-medium text-sm text-gray-900 leading-tight">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Section */}
      <section id="mentor" className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 order-2 md:order-1 fade-in-up">
            <Badge className="mb-6">Mentor Expert</Badge>
            <h2 className="text-4xl font-serif mb-2 text-gray-900">Clara Henita Leluni</h2>
            <p className="text-xl text-[#D4AF37] mb-8 font-medium">Professional Makeup Artist</p>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>Dengan pengalaman lebih dari 5 tahun di industri kecantikan, Clara percaya bahwa setiap wanita memiliki kecantikan uniknya masing-masing.</p>
              <p>"Makeup bukanlah alat untuk menutupi wajahmu menjadi orang lain, melainkan untuk menonjolkan fitur terbaik yang sudah kamu miliki."</p>
              <p>Dalam kelas ini, Clara akan membimbing kamu secara personal dengan pendekatan yang hangat dan sabar untuk menemukan gaya makeup yang paling sesuai.</p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <a href="https://instagram.com/lunilooks" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#D4AF37] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg> 
                @lunilooks
              </a>
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2 w-full fade-in-up">
            <div className="relative">
              <div className="absolute inset-0 bg-[#E8C7C8] rounded-[3rem] transform rotate-3 scale-105 opacity-50"></div>
              <img 
                src="/image/mentor.webp?auto=format&fit=crop&q=80" 
                alt="Clara Henita Leluni" 
                className="relative rounded-[3rem] w-full h-[750px] object-cover shadow-2xl border-4 border-white" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery - Pinterest Layout */}
      <section id="gallery" className="py-24 px-4 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-serif mb-4 text-gray-900">Hasil & Suasana Kelas</h2>
            <p className="text-gray-500 text-lg">Intip keseruan belajar makeup bersama Lunilooks.</p>
          </div>
          
          {gallery.length > 0 ? (
            <div className="masonry-grid fade-in-up">
              {gallery.map((img, i) => (
                <div key={i} onClick={() => setLightboxImage(img)} className="masonry-item group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-3 rounded-full text-black transform scale-75 group-hover:scale-100 transition-all duration-300">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">Belum ada foto galeri yang diunggah.</div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif mb-16 text-center text-gray-900 fade-in-up">Kata Mereka yang Sudah Ikut</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {mockTestimonials.map((t, i) => (
              <Card key={i} className="p-8 bg-[#FDFBF7] border-none flex flex-col justify-between fade-in-up" style={{animationDelay: `${i*0.2}s`}}>
                <div>
                  <Quote className="w-10 h-10 text-[#E8C7C8] mb-4 opacity-50" />
                  <p className="text-gray-700 leading-relaxed mb-6 italic">"{t.text}"</p>
                </div>
                <div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />)}
                  </div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 bg-[#FDFBF7]">
        <div className="max-w-3xl mx-auto fade-in-up">
          <h2 className="text-4xl font-serif mb-12 text-center text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {mockFaqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <button 
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-[#2D2A26] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-3xl mx-auto relative z-10 fade-in-up">
          <h2 className="text-5xl font-serif mb-6 leading-tight">Siap Tampil Beda dan Percaya Diri?</h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Slot sangat terbatas untuk menjaga kualitas pembelajaran (maksimal 10 orang per kelas). Amankan tempatmu sekarang dan dapatkan harga khusus Early Bird.
          </p>
          <Button size="lg" className="bg-[#ff5d62] text-black hover:bg-[#ffadb0] text-lg px-10" onClick={() => onNavigate('/booking')}>
            Booking Jadwal Sekarang
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="font-serif text-2xl font-bold mb-4">Lunilooks.</div>
            <p className="text-gray-500 text-sm max-w-sm mb-6">Membantu setiap wanita menemukan versi terbaik dari dirinya melalui seni makeup yang natural dan elegan.</p>
            <div className="flex gap-4">
              <a href="https://instagram.com/lunilooks" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#E8C7C8] hover:text-[#2D2A26] cursor-pointer transition-colors"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg></a>
              <a href="mailto:lunilooks@gmail.com" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#E8C7C8] hover:text-[#2D2A26] cursor-pointer transition-colors"><Mail className="w-5 h-5"/></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Links</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#materi" onClick={(e) => scrollToSection(e, 'materi')} className="hover:text-black cursor-pointer transition-colors">Kurikulum</a></li>
              <li><a href="#mentor" onClick={(e) => scrollToSection(e, 'mentor')} className="hover:text-black cursor-pointer transition-colors">Mentor</a></li>
              <li><a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-black cursor-pointer transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4"/> +62 895 7008 29066</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Palangkaraya, Studio</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-400 border-t border-gray-50 pt-8 pb-4">
          <p>© 2026 Lunilooks Beauty. All rights reserved.</p>
          <p className="mt-2">Developed by <a href="https://www.solusilokal.id" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors underline decoration-dotted font-medium">solusilokal.id</a></p>
          <button onClick={() => onNavigate('/admin')} className="mt-4 underline text-xs text-gray-300 hover:text-gray-500">Admin Area</button>
        </div>
      </footer>

      <a href="https://wa.me/62895700829066?text=Halo%20Admin%20Lunilooks,%20saya%20ingin%20konsultasi%20mengenai%20kelas%20makeup." target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 group flex items-center gap-0 hover:gap-3 overflow-hidden">
        <Phone className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium text-sm">Konsultasi Gratis</span>
      </a>

      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}><X className="w-6 h-6" /></button>
          <img src={lightboxImage} alt="Enlarged gallery view" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl fade-in-up" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

const BookingWizard = ({ onNavigate }: any) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', wa: '', email: '', age: '', job: '', scheduleId: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const [schedules, setSchedules] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: progData } = await supabase.from('programs').select('*').eq('active', true);
      if (progData) setPrograms(progData);

      const { data: schedData } = await supabase.from('schedules').select('*').order('date', { ascending: true });
      if (schedData) setSchedules(schedData);
    };
    fetchData();
  }, []);

  const isEarlyBird = CURRENT_DATE <= EARLY_BIRD_END;
  const activeProgram = programs[0] || { name: 'Self Makeup Class', price: 600000, earlyBird: 499000 };
  const price = isEarlyBird ? activeProgram.earlyBird : activeProgram.price;

  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Nama wajib diisi';
      if (!formData.wa) newErrors.wa = 'Nomor WhatsApp wajib diisi';
      else if (!/^[0-9+]+$/.test(formData.wa)) newErrors.wa = 'Format nomor tidak valid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => s + 1);
      window.scrollTo(0, 0);
    }
  };
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const code = `LUNI-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
      const schedule = schedules.find(s => s.id === formData.scheduleId);
      
      const payload = {
        code,
        name: formData.name,
        wa: formData.wa,
        email: formData.email,
        age: parseInt(formData.age || '0'),
        job: formData.job,
        scheduleId: formData.scheduleId,
        status: 'pending',
        price: price
      };

      const { error } = await supabase.from('bookings').insert([payload]);
      if (error) throw error;
      
      if (schedule) {
          await supabase.from('schedules').update({ booked: (schedule.booked || 0) + 1 }).eq('id', schedule.id);
      }

      setBookingResult({ ...payload, scheduleStr: schedule?.date });
      setStep(4);
      window.scrollTo(0, 0);
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan booking. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWaLink = (data) => {
    const msg = `Halo Admin Lunilooks.%0A%0ASaya sudah melakukan booking Self Makeup Class.%0A%0A*Kode Booking:* ${data.code}%0A*Nama:* ${data.name}%0A*Jadwal Tanggal:* ${data.scheduleStr}%0A%0AMohon konfirmasi pembayaran.`;
    return `https://wa.me/62895700829066?text=${msg}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-10 fade-in-up">
          <button onClick={() => onNavigate('/')} className="flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Home
          </button>
          <div className="font-serif text-2xl font-bold">Lunilooks.</div>
        </div>

        <Card className="p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none fade-in-up" style={{ animationDelay: '0.1s' }}>
          {step < 4 && (
            <div className="mb-10">
              <div className="flex items-center justify-between relative px-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center relative z-10 bg-white px-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${step >= i ? 'bg-[#2D2A26] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                      {step > i ? <Check className="w-5 h-5" /> : i}
                    </div>
                  </div>
                ))}
                <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-100 -z-0">
                  <div className="h-full bg-[#2D2A26] transition-all duration-700 ease-in-out" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                </div>
              </div>
              <h2 className="text-3xl font-serif mt-10 text-center text-gray-900">
                {step === 1 ? 'Data Diri' : step === 2 ? 'Pilih Jadwal' : 'Review & Finalisasi'}
              </h2>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 fade-in-up">
              <Input label="Nama Lengkap *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} error={errors.name} placeholder="Contoh: Jane Doe" />
              <Input label="Nomor WhatsApp *" type="tel" value={formData.wa} onChange={(e) => setFormData({...formData, wa: e.target.value})} error={errors.wa} placeholder="Contoh: 08123456789" />
              <Input label="Email (Opsional)" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" />
              <div className="grid grid-cols-2 gap-6">
                <Input label="Umur" type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} placeholder="25" />
                <Input label="Pekerjaan" value={formData.job} onChange={(e) => setFormData({...formData, job: e.target.value})} placeholder="Karyawan" />
              </div>
              <div className="pt-6">
                <Button className="w-full" size="lg" onClick={handleNext}>Lanjutkan</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 fade-in-up">
              <div className="bg-[#F5EFE6] p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Calendar className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="font-serif font-bold text-lg text-[#2D2A26]">{activeProgram?.name || 'Self Makeup Class'}</div>
                  <div className="text-gray-600 text-sm mt-1">Pilih tanggal jadwal yang masih tersedia.</div>
                </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {schedules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Belum ada jadwal kelas yang tersedia saat ini.</div>
                ) : (
                  schedules.map((schedule) => {
                    const isFull = schedule.booked >= schedule.capacity;
                    const isSelected = formData.scheduleId === schedule.id;
                    return (
                      <div key={schedule.id} onClick={() => !isFull && setFormData({...formData, scheduleId: schedule.id})} className={`border p-5 rounded-2xl flex items-center justify-between transition-all duration-300 ${isFull ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300 bg-white'} ${isSelected ? 'border-[#2D2A26] bg-[#FDFBF7] ring-1 ring-[#2D2A26] shadow-md transform scale-[1.02]' : ''}`}>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">{new Date(schedule.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                        <div className="text-right">
                          {isFull ? <Badge variant="default" className="bg-gray-300 text-gray-500 border-none">Full Booked</Badge> : <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Sisa {schedule.capacity - (schedule.booked || 0)} slot</div>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" size="lg" className="w-1/3" onClick={handlePrev}>Kembali</Button>
                <Button size="lg" className="w-2/3" onClick={handleNext} disabled={!formData.scheduleId}>Lanjutkan</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 fade-in-up">
              <div className="bg-gray-50 p-8 rounded-3xl space-y-6 border border-gray-100">
                <h3 className="font-serif text-2xl border-b border-gray-200 pb-4 text-gray-900">Ringkasan Reservasi</h3>
                <div className="grid grid-cols-3 gap-y-4 text-sm">
                  <div className="text-gray-500">Program</div>
                  <div className="col-span-2 font-semibold text-gray-900">{activeProgram?.name || 'Self Makeup Class'}</div>
                  <div className="text-gray-500">Nama Lengkap</div>
                  <div className="col-span-2 font-semibold text-gray-900">{formData.name}</div>
                  <div className="text-gray-500">WhatsApp</div>
                  <div className="col-span-2 font-semibold text-gray-900">{formData.wa}</div>
                  <div className="text-gray-500">Jadwal Tanggal</div>
                  <div className="col-span-2 font-semibold text-gray-900">
                    {schedules.find(s => s.id === formData.scheduleId)?.date}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 flex items-end justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Pembayaran</div>
                    {isEarlyBird && <div className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded inline-block">Mendapat Early Bird Promo!</div>}
                  </div>
                  <div className="text-3xl font-serif font-bold text-gray-900">
                    Rp{price.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center bg-blue-50 p-4 rounded-xl text-blue-800">
                Data Anda dilindungi secara aman. Dengan klik submit, Anda menyetujui syarat & ketentuan berlaku.
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" size="lg" className="w-1/3" onClick={handlePrev} disabled={isSubmitting}>Kembali</Button>
                <Button size="lg" className="w-2/3 relative overflow-hidden" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? <span className="flex items-center gap-2"><Clock className="w-5 h-5 animate-spin" /> Memproses...</span> : 'Submit Booking'}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && bookingResult && (
            <div className="text-center py-10 fade-in-up space-y-8">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-12 h-12 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-4xl font-serif mb-2 text-gray-900">Booking Berhasil!</h2>
                <p className="text-gray-600 text-lg">Terima kasih, tempat Anda telah direservasi sementara.</p>
              </div>
              
              <div className="bg-white border-2 border-dashed border-gray-200 p-8 rounded-3xl inline-block w-full max-w-sm mx-auto shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Kode Booking Anda</div>
                <div className="text-2xl font-bold font-mono tracking-widest text-[#2D2A26] bg-gray-50 py-2 rounded-lg">{bookingResult.code}</div>
                <Badge variant="warning" className="mt-6 text-sm px-4 py-1.5 shadow-sm">Status: Menunggu Konfirmasi</Badge>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl text-sm text-left max-w-md mx-auto flex gap-4 items-start shadow-sm">
                <div className="bg-white p-2 rounded-full shadow-sm mt-0.5"><Clock className="w-5 h-5 text-amber-600" /></div>
                <div className="text-amber-900 leading-relaxed">
                  <strong>Langkah Terakhir Penting:</strong> Harap lakukan konfirmasi pembayaran melalui WhatsApp Admin untuk mengamankan slot Anda secara permanen.
                </div>
              </div>

              <a href={generateWaLink(bookingResult)} target="_blank" rel="noopener noreferrer" className="block w-full max-w-md mx-auto pt-4">
                <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-green-500/30 text-lg">
                  Chat Admin WhatsApp Sekarang
                </Button>
              </a>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const AdminDashboard = ({ onNavigate, onLogout }: any) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [bookings, setBookings] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [modal, setModal] = useState({ isOpen: false, type: '', payload: null });
  const [formData, setFormData] = useState({});

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [bookRes, progRes, schedRes, galRes] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('programs').select('*'),
        supabase.from('schedules').select('*').order('date', { ascending: false }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false })
      ]);
      if (bookRes.data) setBookings(bookRes.data);
      if (progRes.data) setPrograms(progRes.data);
      if (schedRes.data) setSchedules(schedRes.data);
      if (galRes.data) setGallery(galRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Hanya format JPG, PNG, dan WEBP yang diperbolehkan.');
      return;
    }
    
    setUploadError('');
    setFormData({ ...formData, file });
  };

  const openModal = (type, payload = null) => {
    setModal({ isOpen: true, type, payload });
    if (type === 'add_program') setFormData({ name: '', slug: '', price: '', earlyBird: '' });
    if (type === 'edit_program') setFormData({ ...payload });
    if (type === 'add_schedule') setFormData({ date: '', capacity: '10' });
    if (type === 'add_gallery') setFormData({ file: null });
  };
  const closeModal = () => setModal({ isOpen: false, type: '', payload: null });

  const handleAction = async () => {
    try {
      if (modal.type === 'confirm_booking') {
        await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', modal.payload);
      } 
      else if (modal.type === 'complete_booking') {
        await supabase.from('bookings').update({ status: 'completed' }).eq('id', modal.payload);
      }
      else if (modal.type === 'delete_booking') {
        await supabase.from('bookings').delete().eq('id', modal.payload);
      }
      else if (modal.type === 'add_program') {
        await supabase.from('programs').insert([{ 
          name: formData.name, slug: formData.slug, active: true, 
          price: Number(formData.price), earlyBird: Number(formData.earlyBird) 
        }]);
      }
      else if (modal.type === 'edit_program') {
        await supabase.from('programs').update({ 
          name: formData.name, slug: formData.slug, 
          price: Number(formData.price), earlyBird: Number(formData.earlyBird) 
        }).eq('id', formData.id);
      }
      else if (modal.type === 'delete_program') {
        await supabase.from('programs').delete().eq('id', modal.payload);
      }
      else if (modal.type === 'add_schedule') {
        await supabase.from('schedules').insert([{ 
          date: formData.date, capacity: Number(formData.capacity), booked: 0, programId: 'p1' 
        }]);
      }
      else if (modal.type === 'delete_schedule') {
        await supabase.from('schedules').delete().eq('id', modal.payload);
      }
      else if (modal.type === 'add_gallery' && formData.file) {
        setUploading(true);
        const fileExt = formData.file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('gallery').upload(fileName, formData.file);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(fileName);
        await supabase.from('gallery').insert([{ url: publicUrlData.publicUrl }]);
        setUploading(false);
      }
      else if (modal.type === 'delete_gallery') {
        const item = gallery.find(g => g.id === modal.payload);
        if (item) {
          const fileName = item.url.split('/').pop();
          await supabase.storage.from('gallery').remove([fileName]);
          await supabase.from('gallery').delete().eq('id', modal.payload);
        }
      }
      
      await fetchDashboardData();
      closeModal();
    } catch (err) {
      console.error("Action error:", err);
      alert("Terjadi kesalahan saat memproses permintaan.");
      setUploading(false);
    }
  };

  const toggleProgramStatus = async (p) => {
    await supabase.from('programs').update({ active: !p.active }).eq('id', p.id);
    fetchDashboardData();
  };

  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const displayedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const StatCard = ({ title, value, sub }: any) => (
    <Card className="p-6 bg-white border-none shadow-sm">
      <div className="text-sm font-medium text-gray-500 mb-3">{title}</div>
      <div className="text-4xl font-serif font-bold text-gray-900">{value}</div>
      {sub && <div className="text-sm font-medium text-emerald-600 mt-3 bg-emerald-50 inline-block px-2 py-1 rounded">{sub}</div>}
    </Card>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
      
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <span className="font-serif font-bold text-xl text-gray-900">Lunilooks Admin</span>
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}><X className="w-5 h-5"/></button>
        </div>
        <div className="p-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Menu Utama</div>
          <nav className="space-y-1">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'bookings', icon: Users, label: 'Data Bookings' },
              { id: 'programs', icon: BookOpen, label: 'Programs & Kelas' },
              { id: 'schedules', icon: Calendar, label: 'Jadwal Batch' },
              { id: 'gallery', icon: ImageIcon, label: 'Manage Gallery' },
            ].map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-[#F5EFE6] text-[#2D2A26] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <item.icon className="w-4 h-4" /> {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 mt-auto border-t border-gray-100">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut className="w-4 h-4" /> Logout Admin
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[#FDFBF7] relative w-full">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 w-full">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2 mr-2 text-gray-600 rounded-lg hover:bg-gray-100" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-serif font-semibold capitalize text-gray-900">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#2D2A26] text-white flex items-center justify-center text-sm font-bold shadow-md">AD</div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24">
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Clock className="w-8 h-8 text-gray-400 animate-spin"/></div>
          ) : (
            <>
              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8 fade-in-up">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Revenue" value={`Rp ${(bookings.reduce((acc, curr) => curr.status === 'confirmed' || curr.status === 'completed' ? acc + curr.price : acc, 0) / 1000000).toFixed(1)}M`} sub="Confirmed Bookings" />
                    <StatCard title="Total Bookings" value={bookings.length.toString()} sub={`${bookings.filter(b => b.status === 'pending').length} Pending`} />
                    <StatCard title="Active Classes" value={programs.filter(p => p.active).length.toString()} />
                    <StatCard title="Available Schedules" value={schedules.length.toString()} />
                  </div>
                  <Card className="p-0 border-none shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                      <h3 className="text-lg font-serif font-bold text-gray-900">Recent Bookings</h3>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('bookings')}>View All</Button>
                    </div>
                    <div className="overflow-x-auto bg-white">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 font-semibold whitespace-nowrap">Booking Code</th>
                            <th className="px-6 py-4 font-semibold whitespace-nowrap">Customer</th>
                            <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {bookings.slice(0, 5).map((b, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs font-medium text-gray-600 whitespace-nowrap">{b.code}</td>
                              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{b.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'completed' ? 'default' : 'warning'}>{b.status}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB: BOOKINGS */}
              {activeTab === 'bookings' && (
                <div className="fade-in-up">
                  <div className="flex justify-between items-center mb-6">
                    <Input placeholder="Search by name or code..." className="max-w-md bg-white w-full" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                  </div>
                  <Card className="p-0 overflow-hidden border-none shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left bg-white">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 whitespace-nowrap">Booking Info</th>
                            <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                            <th className="px-6 py-4 whitespace-nowrap">Schedule ID</th>
                            <th className="px-6 py-4 whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {displayedBookings.map((b, i) => (
                            <tr key={i} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-mono text-xs font-bold text-gray-900">{b.code}</div>
                                <div className="text-xs font-medium text-gray-500 mt-1">Rp{b.price?.toLocaleString('id-ID')}</div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{b.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{b.scheduleId}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'completed' ? 'default' : 'warning'}>{b.status}</Badge>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-900" onClick={() => openModal('view_booking_detail', b)}><Eye className="w-4 h-4"/></Button>
                                {b.status === 'pending' && <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => openModal('confirm_booking', b.id)}>Confirm</Button>}
                                {b.status === 'confirmed' && <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => openModal('complete_booking', b.id)}>Complete</Button>}
                                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-600" onClick={() => openModal('delete_booking', b.id)}><Trash2 className="w-4 h-4"/></Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Tampilkan:</span>
                        <select className="border border-gray-200 rounded p-1 bg-white focus:outline-none" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                          <option value={10}>10</option><option value={30}>30</option><option value={50}>50</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">Hal {currentPage} dari {totalPages || 1}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-2 h-8"><ChevronLeft className="w-4 h-4" /></Button>
                          <Button size="sm" variant="outline" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-2 h-8"><ChevronRight className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB: PROGRAMS */}
              {activeTab === 'programs' && (
                <div className="fade-in-up space-y-6">
                   <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif text-gray-900">Daftar Program Kelas</h2>
                    <Button onClick={() => openModal('add_program')}><Plus className="w-4 h-4 md:mr-2"/> <span className="hidden md:inline">Tambah Program</span></Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {programs.map((p, i) => (
                      <Card key={i} className={`p-6 bg-white border-gray-200 flex flex-col justify-between transition-all ${!p.active ? 'opacity-70 grayscale' : ''}`}>
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <button onClick={() => toggleProgramStatus(p)}>
                              <Badge variant={p.active ? 'success' : 'default'} className={`cursor-pointer ${!p.active ? 'bg-gray-200 text-gray-500' : ''}`}>
                                {p.active ? 'Active (Click to Draft)' : 'Draft (Click to Active)'}
                              </Badge>
                            </button>
                            <div className="flex gap-2">
                               <button onClick={() => openModal('edit_program', p)} className="p-1 text-gray-400 hover:text-gray-900"><Edit2 className="w-4 h-4"/></button>
                               <button onClick={() => openModal('delete_program', p.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          </div>
                          <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{p.name}</h3>
                          <p className="text-sm text-gray-500 font-mono mb-4">/{p.slug}</p>
                        </div>
                        <div className="border-t border-gray-100 pt-4 mt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Normal Price:</span><span className="font-medium">Rp{p.price?.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-500">Early Bird:</span><span className="font-medium text-emerald-600">Rp{p.earlyBird?.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SCHEDULES */}
              {activeTab === 'schedules' && (
                <div className="fade-in-up">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif text-gray-900">Manajemen Jadwal Batch</h2>
                    <Button onClick={() => openModal('add_schedule')}><Plus className="w-4 h-4 md:mr-2"/> <span className="hidden md:inline">Tambah Jadwal Baru</span></Button>
                  </div>
                  <Card className="p-0 overflow-hidden border-none shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left bg-white">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 whitespace-nowrap">Tanggal Kelas</th>
                            <th className="px-6 py-4 text-center whitespace-nowrap">Kapasitas</th>
                            <th className="px-6 py-4 text-center whitespace-nowrap">Terisi</th>
                            <th className="px-6 py-4 text-center whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 text-right whitespace-nowrap">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {schedules.map((s, i) => {
                            const isFull = s.booked >= s.capacity;
                            return (
                              <tr key={i} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{s.date}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">{s.capacity} Slot</td>
                                <td className="px-6 py-4 text-center font-bold text-gray-900 whitespace-nowrap">{s.booked}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap"><Badge variant={isFull ? 'default' : 'success'}>{isFull ? 'Full Booked' : 'Available'}</Badge></td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                   <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-600" onClick={() => openModal('delete_schedule', s.id)}><Trash2 className="w-4 h-4"/></Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="fade-in-up space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-serif text-gray-900">Manage Gallery</h2>
                      <p className="text-sm text-gray-500 mt-1">Kelola foto yang tampil di halaman utama</p>
                    </div>
                    <Button onClick={() => openModal('add_gallery')}><Plus className="w-4 h-4 mr-2"/> Upload Foto</Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {gallery.map((img, i) => (
                      <div key={i} className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                        <img src={img.url} alt={`Gallery`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button onClick={() => openModal('delete_gallery', img.id)} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transform scale-75 group-hover:scale-100 transition-all shadow-lg">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* MODALS */}
        {modal.isOpen && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden fade-in-up max-h-[90vh] flex flex-col">
              
              {modal.type === 'view_booking_detail' && modal.payload && (
                <div className="p-6 overflow-y-auto">
                  <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-gray-900">Detail Peserta</h3>
                      <div className="text-sm font-mono text-gray-500 mt-1">{modal.payload.code}</div>
                    </div>
                    <Badge variant={modal.payload.status === 'confirmed' ? 'success' : modal.payload.status === 'completed' ? 'default' : 'warning'}>{modal.payload.status}</Badge>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Nama</span><span className="col-span-2 font-medium">{modal.payload.name}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">WhatsApp</span><span className="col-span-2 font-medium">{modal.payload.wa || '-'}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Umur/Kerja</span><span className="col-span-2 font-medium">{modal.payload.age}th / {modal.payload.job}</span></div>
                    <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Harga</span><span className="col-span-2 font-medium">Rp{modal.payload.price?.toLocaleString('id-ID')}</span></div>
                  </div>
                  <div className="mt-8 flex justify-end"><Button onClick={closeModal}>Tutup Profil</Button></div>
                </div>
              )}

              {modal.type === 'confirm_booking' && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Konfirmasi Booking</h3>
                  <p className="text-gray-500 mb-6">Tandai booking ini sebagai lunas dan terkonfirmasi?</p>
                  <div className="flex gap-3 justify-end"><Button variant="ghost" onClick={closeModal}>Batal</Button><Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAction}>Konfirmasi</Button></div>
                </div>
              )}

              {modal.type === 'complete_booking' && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Selesaikan Kelas</h3>
                  <p className="text-gray-500 mb-6">Tandai kelas telah selesai diikuti?</p>
                  <div className="flex gap-3 justify-end"><Button variant="ghost" onClick={closeModal}>Batal</Button><Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAction}>Selesai</Button></div>
                </div>
              )}

              {(modal.type === 'delete_booking' || modal.type === 'delete_program' || modal.type === 'delete_schedule' || modal.type === 'delete_gallery') && (
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4"><Trash2 className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold mb-2">Hapus Data?</h3>
                  <p className="text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
                  <div className="flex gap-3 justify-end"><Button variant="ghost" onClick={closeModal}>Batal</Button><Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleAction}>Hapus</Button></div>
                </div>
              )}

              {(modal.type === 'add_program' || modal.type === 'edit_program') && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{modal.type === 'add_program' ? 'Tambah Program' : 'Edit Program'}</h3>
                  <div className="space-y-4 mb-6">
                    <Input label="Nama Kelas" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <Input label="Slug (URL)" value={formData.slug || ''} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Harga Normal" type="number" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                      <Input label="Harga Early Bird" type="number" value={formData.earlyBird || ''} onChange={(e) => setFormData({...formData, earlyBird: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end"><Button variant="ghost" onClick={closeModal}>Batal</Button><Button onClick={handleAction} disabled={!formData.name}>Simpan</Button></div>
                </div>
              )}

              {modal.type === 'add_schedule' && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Tambah Jadwal Baru</h3>
                  <div className="space-y-4 mb-6">
                    <Input label="Tanggal" type="date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                    <Input label="Kapasitas Slot" type="number" value={formData.capacity || ''} onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
                  </div>
                  <div className="flex gap-3 justify-end"><Button variant="ghost" onClick={closeModal}>Batal</Button><Button onClick={handleAction} disabled={!formData.date}>Simpan</Button></div>
                </div>
              )}

              {modal.type === 'add_gallery' && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Upload Foto Galeri</h3>
                  <div className="space-y-4 mb-6">
                    <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} className="block w-full text-sm" />
                    {uploading && <div className="text-sm text-amber-600 flex items-center gap-2"><Clock className="w-4 h-4 animate-spin"/> Mengunggah ke Supabase...</div>}
                    {uploadError && <div className="text-sm text-red-500 font-medium">{uploadError}</div>}
                  </div>
                  <div className="flex gap-3 justify-end"><Button variant="ghost" onClick={closeModal}>Batal</Button><Button onClick={handleAction} disabled={!formData.file || uploading}>Upload</Button></div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const AdminLogin = ({ onLogin, onNavigate }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === '1111') onLogin();
    else { setError('PIN Admin salah.'); setPin(''); }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4">
      <div className="mb-8 text-center cursor-pointer fade-in-up" onClick={() => onNavigate('/')}>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Lunilooks.</h1>
        <p className="text-sm text-gray-500 mt-2">Admin Workspace</p>
      </div>
      <Card className="w-full max-w-md p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Masukkan PIN Akses" type="password" placeholder="****" value={pin} onChange={(e) => { setPin(e.target.value); setError(''); }} error={error} autoFocus />
          <Button type="submit" className="w-full" size="lg">Masuk Dashboard</Button>
        </form>
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <button onClick={() => onNavigate('/')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 w-full"><ChevronLeft className="w-4 h-4" /> Kembali ke Website</button>
        </div>
      </Card>
    </div>
  );
};

export default function LunilooksApp() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('adminAuth') === 'true';
    return false;
  });

  useEffect(() => {
    injectStyles();
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(hash);
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    setIsAdminAuth(true);
    sessionStorage.setItem('adminAuth', 'true');
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('adminAuth');
    navigate('/');
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#E8C7C8] selection:text-black">
      {currentRoute === '/' && <LandingPage onNavigate={navigate} />}
      {currentRoute === '/booking' && <BookingWizard onNavigate={navigate} />}
      {currentRoute.startsWith('/admin') && (
        isAdminAuth ? <AdminDashboard onNavigate={navigate} onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} onNavigate={navigate} />
      )}
    </div>
  );
}