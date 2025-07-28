const express = require('express');
const router = express.Router();

// Route list berita
router.get('/berita', (req, res) => {
  // Render list berita di views/news.ejs
  res.render('news'); 
});

// Route detail berita
router.get('/berita/:slug', (req, res) => {
  // Data dummy detail berita
  const berita = {
    title: "Webinar Keamanan Siber: Edukasi Pelanggan Korporat",
    date: "10 Juli 2025",
    category: "Event",
    image: "/images/webinar-keamanan.jpg",
    content: `
      <p>Perusahaan kami baru saja menyelenggarakan webinar keamanan siber untuk pelanggan korporat dengan antusiasme yang tinggi.</p>
      <p>Webinar ini membahas strategi terkini untuk menjaga data perusahaan tetap aman dari potensi ancaman siber yang semakin kompleks.</p>
      <p>Acara ini diikuti oleh lebih dari 500 peserta dari berbagai industri, dan menghadirkan pembicara ahli dari dalam dan luar negeri.</p>
      <p>Ke depan, kami akan terus berkomitmen untuk membantu transformasi digital bisnis melalui edukasi, inovasi, dan solusi teknologi yang aman.</p>
    `
  };

  res.render('news-detail', { berita });
});

module.exports = router;
