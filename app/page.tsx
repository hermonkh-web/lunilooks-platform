"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Check, ChevronRight, Clock, Star, Users, MapPin, 
  User, BookOpen, Heart, Activity, Settings, 
  LayoutDashboard, Menu, X, CheckCircle2, ChevronLeft, CreditCard,
  Image as ImageIcon, Quote, ChevronDown, Plus, Edit2, Trash2,
  Mail, Phone, Eye
} from 'lucide-react';

const injectStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('lunilooks-styles')) return; // Prevent duplicate injection
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
    
    /* Elegant Custom Scrollbar */
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
    
    /* Animations */
    .fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
    
    /* Masonry Grid for Gallery */
    .masonry-grid { column-count: 1; column-gap: 1rem; }
    @media (min-width: 640px) { .masonry-grid { column-count: 2; } }
    @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
    .masonry-item { break-inside: avoid; margin-bottom: 1rem; }
  `;
  document.head.appendChild(style);
};

// =========================================================================
// ⚠️ MOCKUP DATA AREA (START) ⚠️
// =========================================================================
// AREA INI HANYA UNTUK KEPERLUAN PREVIEW / PROTOTYPE DI PLATFORM INI.
// SAAT MIGRASI KE VS CODE & SUPABASE: 
// 1. Hapus seluruh data array statis di bawah ini.
// 2. Nantinya, data ini akan ditarik (fetch) secara asinkron dari Supabase.
// =========================================================================

// Simulated current date for Early Bird logic (Bisa diganti dengan new Date() asli)
const CURRENT_DATE = new Date('2026-07-27');
const EARLY_BIRD_END = new Date('2026-08-03');

const mockPrograms = [
  { id: 'p1', name: 'Self Makeup Class', slug: 'self-makeup-class', active: true, price: 600000, earlyBird: 499000 },
  { id: 'p2', name: 'Bridal Makeup Class', slug: 'bridal-makeup', active: false, price: 5000000, earlyBird: 4500000 },
  { id: 'p3', name: 'Private 1-on-1', slug: 'private-class', active: true, price: 1500000, earlyBird: 1200000 },
];

const mockSchedules = [
  { id: 's1', date: '2026-08-05', time: '09:00', capacity: 10, booked: 10, programId: 'p1' }, // Full
  { id: 's2', date: '2026-08-05', time: '13:00', capacity: 10, booked: 2, programId: 'p1' },
  { id: 's3', date: '2026-08-06', time: '09:00', capacity: 10, booked: 5, programId: 'p1' },
  { id: 's4', date: '2026-08-06', time: '16:00', capacity: 10, booked: 0, programId: 'p1' },
  { id: 's5', date: '2026-08-15', time: '13:00', capacity: 10, booked: 8, programId: 'p1' },
];

let globalBookings = [
  { id: 'b1', code: 'LUNI-20260726-001', name: 'Alya Rahma', wa: '08123456789', email: 'alya@mail.com', age: 24, job: 'Mahasiswi', skinType: 'Kombinasi', experience: 'Bisa basic (Cuma bedak & lipstik)', goal: 'Ingin bisa makeup untuk hangout tanpa terlihat dempul.', schedule: '2026-08-05 09:00', status: 'confirmed', price: 499000 },
  { id: 'b2', code: 'LUNI-20260727-002', name: 'Nisa Sabyan', wa: '08987654321', email: '', age: 26, job: 'Karyawan Swasta', skinType: 'Kering', experience: 'Sama sekali belum pernah (Pemula murni)', goal: 'Buat daily ngantor biar lebih fresh.', schedule: '2026-08-06 16:00', status: 'pending', price: 499000 },
  { id: 'b3', code: 'LUNI-20260727-003', name: 'Citra Kirana', wa: '08561231231', email: 'citra@mail.com', age: 28, job: 'Wiraswasta', skinType: 'Berminyak', experience: 'Sering tapi ingin memperhalus teknik (Upgrade skill)', goal: 'Belajar complexion yang nahan minyak seharian.', schedule: '2026-08-15 13:00', status: 'completed', price: 499000 }
];

let globalGallery = [
  "https://images.unsplash.com/photo-1512496015851-a1dc8a474649?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80"
];

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
// =========================================================================
// ⚠️ MOCKUP DATA AREA (END) ⚠️
// =========================================================================

// =========================================================================
// 📁 EXTRACT TO: components/ui/Button.tsx
// =========================================================================
const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }: any) => {
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
    <button className={`${base} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// =========================================================================
// 📁 EXTRACT TO: components/ui/Input.tsx
// =========================================================================
const Input = ({ className = '', error, label, ...props }: any) => (
  <div className="w-full space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input 
      className={`flex h-11 w-full rounded-lg border ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#E8C7C8] focus:ring-[#E8C7C8]'} bg-white/50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
      {...props} 
    />
    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
  </div>
);

// =========================================================================
// 📁 EXTRACT TO: components/ui/Card.tsx
// =========================================================================
const Card = ({ children, className = '', hover = false }: any) => (
  <div className={`rounded-2xl border border-gray-100 bg-white text-gray-950 shadow-sm ${hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
);

// =========================================================================
// 📁 EXTRACT TO: components/ui/Badge.tsx
// =========================================================================
const Badge = ({ children, variant = 'default', className = '' }: any) => {
  const variants = {
    default: "bg-[#2D2A26] text-white",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    pink: "bg-[#E8C7C8] text-[#2D2A26]"
  };
  return (
    <div className={`inline-flex items-center rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-wider ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </div>
  );
};

// =========================================================================
// 📁 EXTRACT TO: app/page.tsx (Landing Page Component)
// =========================================================================
const LandingPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const isEarlyBird = CURRENT_DATE <= EARLY_BIRD_END;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-nav z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-serif text-2xl font-bold tracking-tight cursor-pointer" onClick={() => window.scrollTo(0,0)}>Lunilooks.</div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <a href="#materi" onClick={(e) => scrollToSection(e, 'materi')} className="hover:text-black transition-colors cursor-pointer">Class Modules</a>
            <a href="#mentor" onClick={(e) => scrollToSection(e, 'mentor')} className="hover:text-black transition-colors cursor-pointer">Mentor</a>
            <a href="#gallery" onClick={(e) => scrollToSection(e, 'gallery')} className="hover:text-black transition-colors cursor-pointer">Gallery</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-black transition-colors cursor-pointer">FAQ</a>
          </div>
          
          <div className="hidden md:block">
            <Button size="sm" onClick={() => onNavigate('/booking')}>Book Class</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
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
            <Button variant="outline" size="lg" onClick={(e: any) => scrollToSection(e, 'materi')}>Lihat Detail Kelas</Button>
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
            <div className={`transition-all duration-300 ${isEarlyBird ? 'scale-110' : 'opacity-40 grayscale'}`}>
              <div className="text-xs font-bold text-red-500 tracking-widest uppercase mb-2">Early Bird (29 Juli - 3 Agustus)</div>
              <div className="text-5xl font-serif font-bold text-gray-900">Rp499k</div>
            </div>
            <div className="hidden md:block w-px h-20 bg-gray-100"></div>
            <div className={`transition-all duration-300 ${!isEarlyBird ? 'scale-110' : 'opacity-40'}`}>
              <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Normal Price</div>
              <div className="text-4xl font-serif font-bold text-gray-400">Rp600k</div>
            </div>
          </div>
          
          {isEarlyBird && (
            <div className="mt-10 inline-flex items-center gap-2 bg-red-50 text-red-700 px-5 py-2.5 rounded-full text-sm font-medium border border-red-100">
              <Clock className="w-4 h-4 animate-spin-slow" /> Promo Early Bird berakhir dalam 4 Hari!
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
              <p>
                Dengan pengalaman lebih dari 5 tahun di industri kecantikan, Clara percaya bahwa setiap wanita memiliki kecantikan uniknya masing-masing.
              </p>
              <p>
                "Makeup bukanlah alat untuk menutupi wajahmu menjadi orang lain, melainkan untuk menonjolkan fitur terbaik yang sudah kamu miliki."
              </p>
              <p>
                Dalam kelas ini, Clara akan membimbing kamu secara personal dengan pendekatan yang hangat dan sabar untuk menemukan gaya makeup yang paling sesuai.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <a href="https://instagram.com/lunilooks" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#D4AF37] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg> 
              @lunilooks
              </a>
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2 w-full fade-in-up">
            <div className="relative">
              <div className="absolute inset-0 bg-[#E8C7C8] rounded-[3rem] transform rotate-3 scale-105 opacity-50"></div>
              <img 
                src="/image/profil.webp?auto=format&fit=crop&q=90" 
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
          
          <div className="masonry-grid fade-in-up">
            {globalGallery.map((img, i) => (
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
              <a href="https://instagram.com/lunilooks" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#E8C7C8] hover:text-[#2D2A26] cursor-pointer transition-colors"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg></a>
              <a href="mailto:lunilooks@gmail.com" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#E8C7C8] hover:text-[#2D2A26] cursor-pointer transition-colors"><Mail className="w-5 h-5"/></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Links</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#materi" className="hover:text-black">Kurikulum</a></li>
              <li><a href="#mentor" className="hover:text-black">Mentor</a></li>
              <li><a href="#faq" className="hover:text-black">FAQ</a></li>
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
        <div className="text-center text-sm text-gray-400 border-t border-gray-50 pt-8">
          <p>© 2026 Lunilooks Beauty. All rights reserved.</p>
          <button onClick={() => {
            const pin = window.prompt("Masukkan PIN Admin:");
            if (pin === "1111") {
              onNavigate('/admin');
            } else if (pin !== null) {
              alert("PIN Salah!");
            }
          }} className="mt-4 underline text-xs text-gray-300 hover:text-gray-500">Admin Area</button>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/62895700829066?text=Halo%20Admin%20Lunilooks,%20saya%20ingin%20konsultasi%20mengenai%20kelas%20makeup." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 group flex items-center gap-0 hover:gap-3 overflow-hidden"
      >
        <Phone className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium text-sm">
          Konsultasi Gratis
        </span>
      </a>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}>
            <X className="w-6 h-6" />
          </button>
          <img src={lightboxImage} alt="Enlarged gallery view" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl fade-in-up" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 📁 EXTRACT TO: app/booking/page.tsx (Booking System)
// =========================================================================
const BookingWizard = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', wa: '', email: '', age: '', job: '',
    skinType: '', experience: '', goal: '',
    scheduleId: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const isEarlyBird = CURRENT_DATE <= EARLY_BIRD_END;
  const price = isEarlyBird ? mockPrograms[0].earlyBird : mockPrograms[0].price;

  const validateStep = () => {
    let newErrors: any = {};
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

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API Network Request
    setTimeout(() => {
      const code = `LUNI-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
      const schedule = mockSchedules.find(s => s.id === formData.scheduleId);
      const result = { ...formData, code, price, scheduleStr: `${schedule?.date} | ${schedule?.time}` };
      
      globalBookings.unshift({
        id: Math.random().toString(),
        code, name: formData.name, schedule: result.scheduleStr, status: 'pending', price,
        wa: formData.wa, email: formData.email, age: parseInt(formData.age), job: formData.job,
        skinType: formData.skinType, experience: formData.experience, goal: formData.goal
      });

      setBookingResult(result);
      setIsSubmitting(false);
      setStep(5);
      window.scrollTo(0, 0);
    }, 2000);
  };

  const generateWaLink = (data: any) => {
    const msg = `Halo Admin Lunilooks.%0A%0ASaya sudah melakukan booking Self Makeup Class.%0A%0A*Kode Booking:* ${data.code}%0A*Nama:* ${data.name}%0A*Jadwal:* ${data.scheduleStr}%0A%0AMohon konfirmasi pembayaran.`;
    return `https://wa.me/62895700829066?text=${msg}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 fade-in-up">
          <button onClick={() => onNavigate('/')} className="flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Home
          </button>
          <div className="font-serif text-2xl font-bold">Lunilooks.</div>
        </div>

        {/* Form Container */}
        <Card className="p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none fade-in-up" style={{ animationDelay: '0.1s' }}>
          {step < 5 && (
            <div className="mb-10">
              <div className="flex items-center justify-between relative px-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center relative z-10 bg-white px-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${step >= i ? 'bg-[#2D2A26] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                      {step > i ? <Check className="w-5 h-5" /> : i}
                    </div>
                  </div>
                ))}
                <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-100 -z-0">
                  <div className="h-full bg-[#2D2A26] transition-all duration-700 ease-in-out" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                </div>
              </div>
              <h2 className="text-3xl font-serif mt-10 text-center text-gray-900">
                {step === 1 ? 'Data Diri' : step === 2 ? 'Beauty Profile' : step === 3 ? 'Pilih Jadwal' : 'Review & Finalisasi'}
              </h2>
            </div>
          )}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 fade-in-up">
              <Input label="Nama Lengkap *" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} error={errors.name} placeholder="Contoh: Jane Doe" />
              <Input label="Nomor WhatsApp *" type="tel" value={formData.wa} onChange={(e:any) => setFormData({...formData, wa: e.target.value})} error={errors.wa} placeholder="Contoh: 08123456789" />
              <Input label="Email (Opsional)" type="email" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" />
              <div className="grid grid-cols-2 gap-6">
                <Input label="Umur" type="number" value={formData.age} onChange={(e:any) => setFormData({...formData, age: e.target.value})} placeholder="25" />
                <Input label="Pekerjaan" value={formData.job} onChange={(e:any) => setFormData({...formData, job: e.target.value})} placeholder="Karyawan" />
              </div>
              <div className="pt-6">
                <Button className="w-full" size="lg" onClick={handleNext}>Lanjutkan</Button>
              </div>
            </div>
          )}

          {/* STEP 2: Beauty Profile */}
          {step === 2 && (
            <div className="space-y-8 fade-in-up">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Apa jenis kulitmu?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Normal', 'Kering', 'Berminyak', 'Kombinasi'].map(type => (
                    <div key={type} 
                         className={`border rounded-xl p-4 text-center cursor-pointer text-sm font-medium transition-all ${formData.skinType === type ? 'border-[#2D2A26] bg-[#2D2A26] text-white shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'}`}
                         onClick={() => setFormData({...formData, skinType: type})}>
                      {type}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Seberapa sering kamu dandan?</label>
                <div className="space-y-3">
                  {['Sama sekali belum pernah (Pemula murni)', 'Bisa basic (Cuma bedak & lipstik)', 'Sering tapi ingin memperhalus teknik (Upgrade skill)'].map(exp => (
                    <div key={exp} 
                         className={`border rounded-xl p-4 cursor-pointer text-sm font-medium transition-all ${formData.experience === exp ? 'border-[#2D2A26] bg-[#F5EFE6] text-[#2D2A26]' : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'}`}
                         onClick={() => setFormData({...formData, experience: exp})}>
                      {exp}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Apa tujuan utamamu ikut kelas ini?</label>
                <textarea 
                  className="w-full rounded-xl border border-gray-200 bg-white/50 p-4 text-sm focus:border-[#E8C7C8] focus:ring-4 focus:ring-[#E8C7C8]/20 focus:outline-none transition-all"
                  rows={4} 
                  placeholder="Contoh: Ingin bisa makeup untuk ke kantor yang tahan lama dan nggak crack..."
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <Button variant="outline" size="lg" className="w-1/3" onClick={handlePrev}>Kembali</Button>
                <Button size="lg" className="w-2/3" onClick={handleNext} disabled={!formData.skinType || !formData.experience}>Lanjutkan</Button>
              </div>
            </div>
          )}

          {/* STEP 3: Schedule */}
          {step === 3 && (
            <div className="space-y-8 fade-in-up">
              <div className="bg-[#F5EFE6] p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Calendar className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="font-serif font-bold text-lg text-[#2D2A26]">Batch: Road to 17 Agustus</div>
                  <div className="text-gray-600 text-sm mt-1">Pilih slot jadwal yang masih tersedia. Kapasitas maksimal 10 orang/sesi.</div>
                </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {mockSchedules.map((schedule) => {
                  const isFull = schedule.booked >= schedule.capacity;
                  const isSelected = formData.scheduleId === schedule.id;
                  
                  return (
                    <div 
                      key={schedule.id}
                      onClick={() => !isFull && setFormData({...formData, scheduleId: schedule.id})}
                      className={`border p-5 rounded-2xl flex items-center justify-between transition-all duration-300
                        ${isFull ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300 bg-white'}
                        ${isSelected ? 'border-[#2D2A26] bg-[#FDFBF7] ring-1 ring-[#2D2A26] shadow-md transform scale-[1.02]' : ''}
                      `}
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{new Date(schedule.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        <div className="text-sm text-gray-500 mt-1.5 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#D4AF37]" /> Pukul {schedule.time}
                        </div>
                      </div>
                      <div className="text-right">
                        {isFull ? (
                          <Badge variant="default" className="bg-gray-300 text-gray-500 border-none">Full Booked</Badge>
                        ) : (
                          <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Sisa {schedule.capacity - schedule.booked} slot</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" size="lg" className="w-1/3" onClick={handlePrev}>Kembali</Button>
                <Button size="lg" className="w-2/3" onClick={handleNext} disabled={!formData.scheduleId}>Lanjutkan</Button>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-8 fade-in-up">
              <div className="bg-gray-50 p-8 rounded-3xl space-y-6 border border-gray-100">
                <h3 className="font-serif text-2xl border-b border-gray-200 pb-4 text-gray-900">Ringkasan Reservasi</h3>
                
                <div className="grid grid-cols-3 gap-y-4 text-sm">
                  <div className="text-gray-500">Program</div>
                  <div className="col-span-2 font-semibold text-gray-900">Self Makeup Class</div>
                  
                  <div className="text-gray-500">Nama Lengkap</div>
                  <div className="col-span-2 font-semibold text-gray-900">{formData.name}</div>
                  
                  <div className="text-gray-500">WhatsApp</div>
                  <div className="col-span-2 font-semibold text-gray-900">{formData.wa}</div>
                  
                  <div className="text-gray-500">Jadwal Dipilih</div>
                  <div className="col-span-2 font-semibold text-gray-900 flex flex-col">
                    <span>{mockSchedules.find(s => s.id === formData.scheduleId)?.date}</span>
                    <span className="text-[#D4AF37]">Pukul {mockSchedules.find(s => s.id === formData.scheduleId)?.time}</span>
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
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5 animate-spin" /> Memproses...
                    </span>
                  ) : 'Submit Booking'}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: Success */}
          {step === 5 && bookingResult && (
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

// =========================================================================
// 📁 EXTRACT TO: app/admin/page.tsx (Admin Dashboard)
// =========================================================================
const AdminDashboard = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // =========================================================================
  // ⚠️ STATE AWAL MENGGUNAKAN MOCKUP DATA (UBAH SAAT MIGRASI) ⚠️
  // Di VS Code nanti, kosongkan inisialisasi awalnya, misal: const [bookings, setBookings] = useState([]);
  // Lalu gunakan useEffect() untuk memanggil Supabase dan mengisi state ini.
  // =========================================================================
  const [bookings, setBookings] = useState(globalBookings);
  const [programs, setPrograms] = useState(mockPrograms);
  const [schedules, setSchedules] = useState(mockSchedules);
  const [gallery, setGallery] = useState(globalGallery);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State for Bookings
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Settings State
  const [settings, setSettings] = useState({
    siteName: 'Lunilooks Beauty',
    whatsapp: '+62 895 7008 29066',
    email: 'lunilooks@gmail.com',
    instagram: '@lunilooks',
    address: 'Palangkaraya, Studio'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Upload State for Gallery
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Hanya format JPG, PNG, dan WEBP yang diperbolehkan.');
      return;
    }
    
    setUploadError('');
    setUploading(true);
    
    try {
      // Simulasi Upload & Auto Resize (< 500kb) - Disinkronkan dengan logika Supabase Storage
      const processedImage = await new Promise((resolve) => {
        if (file.size <= 500 * 1024) {
           const reader = new FileReader();
           reader.onload = (evt: any) => resolve(evt.target.result);
           reader.readAsDataURL(file);
           return;
        }
        const reader = new FileReader();
        reader.onload = (evt: any) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            const max = 1200; // max dimension
            if (width > height && width > max) { height *= max / width; width = max; }
            else if (height > max) { width *= max / height; height = max; }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8)); // compress to 80%
          };
          img.src = evt.target.result as string;
        };
        reader.readAsDataURL(file);
      });
      
      setFormData({ ...formData, url: processedImage });
    } catch (err) {
      setUploadError('Gagal memproses gambar.');
    } finally {
      setUploading(false);
    }
  };

  // Unified Modal State
  const [modal, setModal] = useState<{isOpen: boolean, type: string, payload: any}>({ isOpen: false, type: '', payload: null });
  const [formData, setFormData] = useState<any>({});

  const openModal = (type: string, payload: any = null) => {
    setModal({ isOpen: true, type, payload });
    if (type === 'add_program') setFormData({ name: '', slug: '', price: '', earlyBird: '' });
    if (type === 'edit_program') setFormData({ ...payload });
    if (type === 'add_schedule') setFormData({ date: '', time: '', capacity: '10' });
    if (type === 'add_gallery') setFormData({ url: '' });
  };
  const closeModal = () => setModal({ isOpen: false, type: '', payload: null });

  // Action Handlers
  const handleAction = () => {
    if (modal.type === 'confirm_booking') {
      const updated = bookings.map(b => b.id === modal.payload ? { ...b, status: 'confirmed' } : b);
      globalBookings.length = 0; globalBookings.push(...updated);
      setBookings(updated);
    } 
    else if (modal.type === 'complete_booking') {
      const updated = bookings.map(b => b.id === modal.payload ? { ...b, status: 'completed' } : b);
      globalBookings.length = 0; globalBookings.push(...updated);
      setBookings(updated);
    }
    else if (modal.type === 'delete_booking') {
      const updated = bookings.filter(b => b.id !== modal.payload);
      globalBookings.length = 0; globalBookings.push(...updated);
      setBookings(updated);
    }
    else if (modal.type === 'add_program') {
      const newProg = { id: `p${Date.now()}`, active: true, ...formData, price: Number(formData.price), earlyBird: Number(formData.earlyBird) };
      mockPrograms.push(newProg);
      setPrograms([...mockPrograms]);
    }
    else if (modal.type === 'edit_program') {
      const updated = programs.map(p => p.id === formData.id ? { ...p, ...formData, price: Number(formData.price), earlyBird: Number(formData.earlyBird) } : p);
      mockPrograms.length = 0; mockPrograms.push(...updated);
      setPrograms(updated);
    }
    else if (modal.type === 'delete_program') {
      const updated = programs.filter(p => p.id !== modal.payload);
      mockPrograms.length = 0; mockPrograms.push(...updated);
      setPrograms(updated);
    }
    else if (modal.type === 'add_schedule') {
      const newSched = { id: `s${Date.now()}`, programId: 'p1', booked: 0, ...formData, capacity: Number(formData.capacity) };
      mockSchedules.push(newSched);
      setSchedules([...mockSchedules]);
    }
    else if (modal.type === 'delete_schedule') {
      const updated = schedules.filter(s => s.id !== modal.payload);
      mockSchedules.length = 0; mockSchedules.push(...updated);
      setSchedules(updated);
    }
    else if (modal.type === 'add_gallery' && formData.url) {
      globalGallery.unshift(formData.url);
      setGallery([...globalGallery]);
    }
    else if (modal.type === 'delete_gallery') {
      const updated = gallery.filter((_, idx) => idx !== modal.payload);
      globalGallery.length = 0; globalGallery.push(...updated);
      setGallery(updated);
    }
    closeModal();
  };

  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const displayedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleProgramStatus = (id: string) => {
    const updated = programs.map(p => p.id === id ? { ...p, active: !p.active } : p);
    mockPrograms.length = 0; mockPrograms.push(...updated);
    setPrograms(updated);
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const StatCard = ({ title, value, sub }: any) => (
    <Card className="p-6 bg-white border-none shadow-sm">
      <div className="text-sm font-medium text-gray-500 mb-3">{title}</div>
      <div className="text-4xl font-serif font-bold text-gray-900">{value}</div>
      {sub && <div className="text-sm font-medium text-emerald-600 mt-3 bg-emerald-50 inline-block px-2 py-1 rounded">{sub}</div>}
    </Card>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="font-serif font-bold text-xl text-gray-900">Lunilooks Admin</span>
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
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-[#F5EFE6] text-[#2D2A26] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 mt-auto border-t border-gray-100">
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-[#F5EFE6] text-[#2D2A26] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button onClick={() => onNavigate('/')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
              <ChevronLeft className="w-4 h-4" /> Back to Website
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[#FDFBF7] relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-serif font-semibold capitalize text-gray-900">{activeTab.replace('-', ' ')}</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-500">Super Admin</div>
            <div className="w-9 h-9 rounded-full bg-[#2D2A26] text-white flex items-center justify-center text-sm font-bold shadow-md">AD</div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto pb-24">
          
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
                        <th className="px-6 py-4 font-semibold">Booking Code</th>
                        <th className="px-6 py-4 font-semibold">Customer</th>
                        <th className="px-6 py-4 font-semibold">Schedule</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.slice(0, 5).map((b, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-medium text-gray-600">{b.code}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{b.name}</td>
                          <td className="px-6 py-4 text-gray-500">{b.schedule}</td>
                          <td className="px-6 py-4">
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
                <Input 
                  placeholder="Search by name or code..." 
                  className="max-w-md bg-white" 
                  value={searchTerm} 
                  onChange={(e:any) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
                />
              </div>
              <Card className="p-0 overflow-hidden border-none shadow-sm">
                <table className="w-full text-sm text-left bg-white">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Booking Info</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Schedule</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayedBookings.map((b, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs font-bold text-gray-900">{b.code}</div>
                          <div className="text-xs font-medium text-gray-500 mt-1">Rp{b.price.toLocaleString('id-ID')}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{b.name}</td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> {b.schedule}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'completed' ? 'default' : 'warning'}>{b.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-900" onClick={() => openModal('view_booking_detail', b)}><Eye className="w-4 h-4"/></Button>
                          {b.status === 'pending' && (
                            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => openModal('confirm_booking', b.id)}>Confirm</Button>
                          )}
                          {b.status === 'confirmed' && (
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => openModal('complete_booking', b.id)}>Complete</Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-600" onClick={() => openModal('delete_booking', b.id)}><Trash2 className="w-4 h-4"/></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Tampilkan:</span>
                    <select 
                      className="border border-gray-200 rounded p-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#E8C7C8]"
                      value={itemsPerPage}
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    >
                      <option value={10}>10</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                    </select>
                    <span>data</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      Halaman {currentPage} dari {totalPages || 1}
                    </span>
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
                <Button onClick={() => openModal('add_program')}><Plus className="w-4 h-4 mr-2"/> Tambah Program</Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {programs.map((p, i) => (
                  <Card key={i} className={`p-6 bg-white border-gray-200 flex flex-col justify-between transition-all ${!p.active ? 'opacity-70 grayscale' : ''}`}>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <button onClick={() => toggleProgramStatus(p.id)}>
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
                        <span className="text-gray-500">Normal Price:</span>
                        <span className="font-medium">Rp{p.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Early Bird:</span>
                        <span className="font-medium text-emerald-600">Rp{p.earlyBird.toLocaleString('id-ID')}</span>
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
                <Button onClick={() => openModal('add_schedule')}><Plus className="w-4 h-4 mr-2"/> Tambah Jadwal Baru</Button>
              </div>
              <Card className="p-0 overflow-hidden border-none shadow-sm">
                <table className="w-full text-sm text-left bg-white">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Tanggal Kelas</th>
                      <th className="px-6 py-4">Jam</th>
                      <th className="px-6 py-4 text-center">Kapasitas</th>
                      <th className="px-6 py-4 text-center">Terisi</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {schedules.map((s, i) => {
                      const isFull = s.booked >= s.capacity;
                      return (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold text-gray-900">{s.date}</td>
                          <td className="px-6 py-4 font-mono">{s.time}</td>
                          <td className="px-6 py-4 text-center">{s.capacity} Slot</td>
                          <td className="px-6 py-4 text-center font-bold text-gray-900">{s.booked}</td>
                          <td className="px-6 py-4 text-center">
                            <Badge variant={isFull ? 'default' : 'success'}>{isFull ? 'Full Booked' : 'Available'}</Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-600" onClick={() => openModal('delete_schedule', s.id)}><Trash2 className="w-4 h-4"/></Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* TAB: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="fade-in-up space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-serif text-gray-900">Manage Gallery</h2>
                  <p className="text-sm text-gray-500 mt-1">Kelola foto yang tampil di halaman utama</p>
                </div>
                <Button onClick={() => openModal('add_gallery')}>
                  <Plus className="w-4 h-4 mr-2"/> Upload Foto
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {gallery.map((img, i) => (
                  <div key={i} className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                        onClick={() => openModal('delete_gallery', i)}
                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transform scale-75 group-hover:scale-100 transition-all shadow-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="fade-in-up max-w-2xl">
              <h2 className="text-2xl font-serif text-gray-900 mb-6">Pengaturan Platform</h2>
              <Card className="p-8 bg-white border-none shadow-sm space-y-6">
                <div className="space-y-4">
                  <Input label="Nama Platform (Brand)" value={settings.siteName} onChange={(e:any) => setSettings({...settings, siteName: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                     <Input label="Kontak WhatsApp" value={settings.whatsapp} onChange={(e:any) => setSettings({...settings, whatsapp: e.target.value})} />
                     <Input label="Username Instagram" value={settings.instagram} onChange={(e:any) => setSettings({...settings, instagram: e.target.value})} />
                  </div>
                  <Input label="Email Kontak" type="email" value={settings.email} onChange={(e:any) => setSettings({...settings, email: e.target.value})} />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Alamat Studio / Lokasi</label>
                    <textarea 
                      className="flex w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-sm focus:border-[#E8C7C8] focus:ring-4 focus:ring-[#E8C7C8]/20 focus:outline-none transition-all"
                      rows={3}
                      value={settings.address}
                      onChange={(e) => setSettings({...settings, address: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  {settingsSaved ? (
                    <span className="text-emerald-600 flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 mr-2"/> Pengaturan Disimpan</span>
                  ) : <span></span>}
                  <Button onClick={handleSaveSettings}>Simpan Perubahan</Button>
                </div>
              </Card>
            </div>
          )}

        </div>

        {/* --- GLOBAL CUSTOM MODAL --- */}
        {modal.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden fade-in-up max-h-[90vh] flex flex-col" style={{ animationDuration: '0.3s' }}>
              
              {/* View Booking Detail Modal */}
              {modal.type === 'view_booking_detail' && modal.payload && (
                <div className="p-6 overflow-y-auto">
                  <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-gray-900">Detail Peserta</h3>
                      <div className="text-sm font-mono text-gray-500 mt-1">{modal.payload.code}</div>
                    </div>
                    <Badge variant={modal.payload.status === 'confirmed' ? 'success' : modal.payload.status === 'completed' ? 'default' : 'warning'}>
                      {modal.payload.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Nama Lengkap</span>
                      <span className="col-span-2 font-medium text-gray-900">{modal.payload.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">WhatsApp</span>
                      <span className="col-span-2 font-medium text-gray-900">{modal.payload.wa || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Email</span>
                      <span className="col-span-2 font-medium text-gray-900">{modal.payload.email || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Umur & Pekerjaan</span>
                      <span className="col-span-2 font-medium text-gray-900">{modal.payload.age ? `${modal.payload.age} tahun` : '-'} • {modal.payload.job || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50">
                      <span className="text-gray-500">Jenis Kulit</span>
                      <span className="col-span-2 font-medium text-gray-900">{modal.payload.skinType || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Pengalaman</span>
                      <span className="col-span-2 font-medium text-gray-900 leading-relaxed">{modal.payload.experience || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Tujuan Kelas</span>
                      <span className="col-span-2 font-medium text-gray-900 leading-relaxed">{modal.payload.goal || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50">
                      <span className="text-gray-500">Jadwal Kelas</span>
                      <span className="col-span-2 font-medium text-gray-900">{modal.payload.schedule}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Harga Dibayar</span>
                      <span className="col-span-2 font-medium text-gray-900">Rp{modal.payload.price?.toLocaleString('id-ID') || '0'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button onClick={closeModal}>Tutup Profil</Button>
                  </div>
                </div>
              )}

              {/* Confirm Booking Modal */}
              {modal.type === 'confirm_booking' && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Konfirmasi Booking</h3>
                  <p className="text-gray-500 mb-6">Tandai booking ini sebagai lunas dan sudah terkonfirmasi?</p>
                  <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeModal}>Batal</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAction}>Ya, Konfirmasi</Button>
                  </div>
                </div>
              )}

              {/* Complete Booking Modal */}
              {modal.type === 'complete_booking' && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Selesaikan Kelas</h3>
                  <p className="text-gray-500 mb-6">Tandai kelas ini telah selesai diikuti oleh peserta?</p>
                  <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeModal}>Batal</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAction}>Ya, Selesai</Button>
                  </div>
                </div>
              )}

              {/* Delete Modal (Generic) */}
              {(modal.type === 'delete_booking' || modal.type === 'delete_program' || modal.type === 'delete_schedule' || modal.type === 'delete_gallery') && (
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Hapus Data?</h3>
                  <p className="text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data ini dari sistem?</p>
                  <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeModal}>Batal</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleAction}>Ya, Hapus</Button>
                  </div>
                </div>
              )}

              {/* Add/Edit Program Modal */}
              {(modal.type === 'add_program' || modal.type === 'edit_program') && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{modal.type === 'add_program' ? 'Tambah Program Baru' : 'Edit Program'}</h3>
                  <div className="space-y-4 mb-6">
                    <Input label="Nama Kelas" placeholder="Misal: Private Masterclass" value={formData.name || ''} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
                    <Input label="Slug (URL)" placeholder="misal: private-masterclass" value={formData.slug || ''} onChange={(e:any) => setFormData({...formData, slug: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Harga Normal" type="number" placeholder="600000" value={formData.price || ''} onChange={(e:any) => setFormData({...formData, price: e.target.value})} />
                      <Input label="Harga Early Bird" type="number" placeholder="499000" value={formData.earlyBird || ''} onChange={(e:any) => setFormData({...formData, earlyBird: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeModal}>Batal</Button>
                    <Button onClick={handleAction} disabled={!formData.name || !formData.price}>Simpan Program</Button>
                  </div>
                </div>
              )}

              {/* Add Schedule Modal */}
              {modal.type === 'add_schedule' && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Tambah Jadwal Baru</h3>
                  <div className="space-y-4 mb-6">
                    <Input label="Tanggal" type="date" value={formData.date || ''} onChange={(e:any) => setFormData({...formData, date: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Jam (HH:MM)" type="time" value={formData.time || ''} onChange={(e:any) => setFormData({...formData, time: e.target.value})} />
                      <Input label="Kapasitas Slot" type="number" value={formData.capacity || ''} onChange={(e:any) => setFormData({...formData, capacity: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeModal}>Batal</Button>
                    <Button onClick={handleAction} disabled={!formData.date || !formData.time}>Simpan Jadwal</Button>
                  </div>
                </div>
              )}

              {/* Add Gallery Modal */}
              {modal.type === 'add_gallery' && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Upload Foto Galeri</h3>
                  <p className="text-sm text-gray-500 mb-4">Pilih file gambar (JPG, PNG, WEBP). Gambar di atas 500KB akan otomatis di-resize untuk optimalisasi (Disiapkan untuk Supabase Storage).</p>
                  <div className="space-y-4 mb-6">
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, image/webp" 
                      onChange={handleFileChange} 
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E8C7C8] file:text-[#2D2A26] hover:file:bg-[#DDBEA9] transition-all cursor-pointer"
                    />
                    {uploading && <div className="text-sm text-amber-600 flex items-center gap-2"><Clock className="w-4 h-4 animate-spin"/> Memproses & Mengunggah...</div>}
                    {uploadError && <div className="text-sm text-red-500 font-medium">{uploadError}</div>}
                    {formData.url && !uploading && (
                      <div className="mt-4 border rounded-xl overflow-hidden shadow-sm">
                         <img src={formData.url} alt="Preview" className="w-full h-48 object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={closeModal}>Batal</Button>
                    <Button onClick={handleAction} disabled={!formData.url || uploading}>Simpan ke Galeri</Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// =========================================================================
// 📁 EXTRACT TO: app/layout.tsx (Main Layout / Root Router)
// CATATAN: Di Next.js asli, Anda tidak perlu Router buatan sendiri seperti di bawah ini,
// melainkan memanfaatkan sistem routing folder Next.js (App Router).
// =========================================================================
export default function LunilooksApp() {
  const [currentRoute, setCurrentRoute] = useState<string>('/');

  useEffect(() => {
    injectStyles();
    
    // Simple hash-based router synchronization for the single file environment
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(hash);
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (path: string) => {
    // PROTEKSI PIN ADMIN via URL/Fungsi Navigate Utama
    if (path.startsWith('/admin')) {
      const pin = window.prompt("Masukkan PIN Admin:");
      if (pin !== "1111") {
        if (pin !== null) alert("PIN Salah!");
        return; // Batalkan navigasi jika PIN salah
      }
    }
    
    window.location.hash = path;
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Engine
  return (
    <div className="min-h-screen font-sans selection:bg-[#E8C7C8] selection:text-black">
      {currentRoute === '/' && <LandingPage onNavigate={navigate} />}
      {currentRoute === '/booking' && <BookingWizard onNavigate={navigate} />}
      {currentRoute.startsWith('/admin') && <AdminDashboard onNavigate={navigate} />}
    </div>
  );
}