import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import { X } from 'lucide-react';
import { API_BASE } from '../api';

const posts = [
  {
    id: 1,
    title: 'The Cotton-Jersey Zip-Up Hoodie',
    excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard...',
    content: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard tattooed actually pabst. Swag meggings cornhole, chillwave poutine kombucha man bun. You probably haven\'t heard of them sartorial before they sold out gastropub. Pitchfork locavore ugh, activated charcoal post-ironic fam fixie humblebrag. Aesthetic viral artisan flexitarian. Everyday carry listicle narwhal retro street art single-origin coffee. Sustainable craft beer woke lo-fi vexillologist actually retro.',
    date: '13/01',
    image: '/images/products/WhatsApp Image 2026-03-18 at 3.19.46 PM.jpeg',
  },
  {
    id: 2,
    title: 'How to Style a Quiff',
    excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard...',
    content: 'Mastering the quiff is essential for modern men\'s grooming. Start with clean, damp hair. Apply a pre-styling product like sea salt spray or a volumizing mousse. Use a hair dryer on medium heat, brushing your hair upwards and backwards to create volume. Once dry, rub a small amount of pomade or clay between your palms and work it through your hair, shaping the front upwards. Finish with a light hairspray to hold the style all day.',
    date: '13/01',
    image: '/images/products/WhatsApp Image 2026-03-18 at 3.19.55 PM.jpeg2.jpeg',
  },
  {
    id: 3,
    title: 'Must-Have Skater Girl Items',
    excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard...',
    content: 'The skater girl aesthetic is all about comfort blending seamlessly with edgy street style. Key items include oversized graphic tees, durable cargo pants, and classic canvas sneakers. Layering is crucial—think flannel shirts over crop tops or baggy hoodies. Don\'t forget accessories like beanies, chunky belts, and retro sunglasses. It\'s a look that prioritizes mobility while making a strong fashion statement.',
    date: '13/01',
    image: '/images/products/WhatsApp Image 2026-03-18 at 3.19.58 PM.jpeg11.jpeg',
  },
  {
    id: 4,
    title: 'Runway-Inspired Trends',
    excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard...',
    content: 'Translating high fashion runway looks into everyday wear can seem daunting, but it\'s all about isolating key elements. This season, we\'re seeing a resurgence of bold geometric patterns and oversized silhouettes. To make this wearable, pair a statement geometric blouse with tailored, neutral trousers. Or, embrace the oversized trend with a voluminous coat over a fitted outfit. Remember, fashion is about personal expression, so adapt these trends to fit your unique style.',
    date: '13/01',
    image: '/images/products/WhatsApp Image 2026-03-18 at 3.20.00 PM.jpeg',
  },
  {
    id: 5,
    title: 'AW20 Menswear Trends',
    excerpt: 'Kickstarter man braid godard coloring book. Raclette waistcoat selfies yr wolf chartreuse hexagon irony. godard...',
    content: 'The Autumn/Winter 2020 menswear collections brought a fresh perspective to classic tailoring. Expect to see a lot of rich, earthy tones like rust, mustard, and deep forest green. Layering is more prominent than ever, with roll-neck sweaters worn under sharp blazers or heavy overcoats. Texture also plays a massive role, with corduroy, tweed, and heavy wool dominating the racks. It\'s a season that balances rugged masculinity with refined elegance.',
    date: '13/01',
    image: '/images/products/WhatsApp Image 2026-03-18 at 3.20.01 PM.jpeg18.jpeg',
  },
  {
    id: 6,
    title: 'Top 10 Casual Outfits for Spring',
    excerpt: 'Discover the best casual wear for the spring season. From lightweight jackets to trendy sneakers, this guide covers all essentials...',
    content: 'Spring is the season of renewal, and your wardrobe should reflect that. Embrace lighter fabrics and brighter colors. A classic denim jacket paired with a floral dress or white chinos is a fail-safe option. Pastel colored knitwear is perfect for those breezy spring evenings. Don\'t underestimate the power of a clean, white sneaker—it goes with almost everything and instantly refreshes your look. Mix and match these essentials for effortless spring style.',
    date: '20/02',
    image: '/images/products/WhatsApp Image 2026-03-18 at 3.20.02 PM.jpeg',
  },
  {
    id: 7,
    title: 'Street Style Essentials for Men',
    excerpt: 'Street style has evolved into a global fashion movement. Learn how to incorporate bold prints, layered looks, and statement accessories...',
    content: 'Street style is inherently democratic, constantly evolving based on urban culture. Essential items include high-quality hoodies, distressed denim, and limited-edition sneakers. Accessories are crucial for elevating a simple outfit—think cross-body bags, bucket hats, or layered silver chains. The key to successful street style is confidence and mixing high-end pieces with affordable basics to create a look that is uniquely yours.',
    date: '05/03',
    image: '/images/products/WhatsApp Image 2026-03-18 at 3.20.02 PM.jpeg21.jpeg',
  },
  {
    id: 8,
    title: 'How to Build a Capsule Wardrobe',
    excerpt: 'A capsule wardrobe is all about quality over quantity. Learn how to curate a versatile collection that works for every occasion...',
    content: 'Building a capsule wardrobe requires discipline and a clear understanding of your personal style. Start by decluttering and keeping only the items you truly love and wear frequently. Focus on a cohesive color palette—usually neutrals like black, white, navy, and beige—so everything mixes and matches easily. Invest in high-quality basics: a tailored blazer, a perfect white tee, well-fitting jeans, and a versatile dress. The goal is maximum outfit combinations with minimal items.',
    date: '12/03',
    image: '/images/products/WhatsApp Image 2026-03-18 at 3.19.49 PM.jpeg',
  },
  {
    id: 9,
    title: 'Summer Fashion Lookbook 2026',
    excerpt: 'Get inspired with our summer 2026 lookbook featuring breezy linens, vibrant prints, and the hottest accessories of the season...',
    content: 'Summer 2026 is all about bold optimism and relaxed elegance. Linen is the fabric of the season, seen in relaxed tailoring and breezy sundresses. Vibrant, tropical prints are making a huge comeback, bringing a sense of joy and escapism. For accessories, oversized straw hats, colorful beaded jewelry, and chic slides are essential. Embrace the heat with style that is both effortless and striking.',
    date: '15/03',
    image: '/images/products/WhatsApp Image 2026-03-18 at 3.19.56 PM.jpeg5.jpeg',
  },
  {
    id: 10,
    title: 'Sustainable Fashion: A Complete Guide',
    excerpt: 'Sustainable fashion is more than a trend — it\'s a movement. Discover eco-friendly brands, upcycling tips, and how to shop responsibly...',
    content: 'The fashion industry is shifting towards sustainability, and as consumers, we have the power to drive this change. Start by researching brands that prioritize ethical manufacturing and eco-friendly materials like organic cotton or recycled polyester. Embrace "slow fashion" by buying fewer, higher-quality items. Learn basic mending skills to extend the life of your clothes, or try upcycling old pieces into something new. Every small conscious choice contributes to a more sustainable future.',
    date: '18/03',
    image: '/images/products/WhatsApp Image 2026-03-18 at 3.19.59 PM.jpeg17.jpeg',
  },
];

const Blog = () => {
  useEffect(() => {
    document.title = "Blog | Cipher Apparel";
  }, []);

  const POSTS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedPost(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-[#f8f9fa]">
      {/* Hero Section with abstract elements */}
      <div className="relative w-full min-h-[45vh] bg-gray-900 flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Image with neutral dark overlay */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${API_BASE}/static/store/images/banner/b19.jpg')` }}></div>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-4 max-w-3xl"
        >
          <span className="text-gray-300 font-semibold tracking-widest text-sm uppercase mb-3 block">Our Journal</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
            #Read<span className="text-primary">More</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-medium max-w-xl mx-auto drop-shadow-md">
            Dive into our latest styling tips, trend reports, and behind-the-scenes stories.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16">
        <div className="space-y-16">
          {visiblePosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col md:flex-row gap-8 items-center bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
            >
              <div className="w-full md:w-1/2 overflow-hidden rounded-[1.5rem] relative aspect-[4/3] sm:aspect-auto sm:h-[350px]">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => { e.target.src = '/hero-new.jpg'; }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="w-full md:w-1/2 relative py-4">
                <h1 className="absolute -top-12 sm:-top-16 -left-4 sm:-left-8 text-6xl sm:text-8xl font-black text-gray-50 opacity-80 -z-10 tracking-tighter select-none">{post.date}</h1>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">{post.excerpt}</p>
                <button 
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center font-bold text-gray-900 text-sm tracking-widest uppercase hover:text-primary transition-colors after:content-[''] after:block after:w-full after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                >
                  CONTINUE READING <span className="ml-2">&rarr;</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-20">
          {currentPage > 1 && (
            <button 
              onClick={() => {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md hover:shadow-lg hover:bg-primary-dark transition-all"
            >
              &larr;
            </button>
          )}
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl font-bold transition-all shadow-sm hover:shadow-md ${
                currentPage === page 
                  ? 'bg-primary text-white shadow-primary/30' 
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages && (
            <button 
              onClick={() => {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md hover:shadow-lg hover:bg-primary-dark transition-all"
            >
              &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Blog Post Modal with Blur Backdrop */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop Blur */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setSelectedPost(null)}
            ></div>

            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="w-full h-48 sm:h-64 relative flex-shrink-0">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-primary font-bold text-sm tracking-widest uppercase mb-1 block">
                    {selectedPost.date}
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                    {selectedPost.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto">
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-1 first-letter:float-left">
                  {selectedPost.content}
                </p>
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-xl transition-colors"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Blog;
