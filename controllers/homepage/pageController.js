const Home = require('../../models/dashboard/Home');
const Services = require('../../models/dashboard/Services');
const About = require('../../models/dashboard/About');
const Portofolio = require('../../models/dashboard/Portofolio');
const News = require('../../models/dashboard/News');
const Visitor = require('../../models/dashboard/Visitor');
const sequelize = require('../../config/database'); // sesuaikan path-nya
const { QueryTypes } = require('sequelize');

// const berita = [
//   {
//     id: '1',
//     image: '/homepage/images/news1.jpg',
//     category: 'Keamanan Cyber',
//     date: '20 Juni 2025',
//     title: 'Mengamankan Infrastruktur IT dari Serangan Ransomware',
//     excerpt: 'Panduan lengkap bagi UKM untuk mengadopsi teknologi digital dalam meningkatkan keamanan sistem...'
//   },
//   {
//     id: '2',
//     image: '/homepage/images/news2.jpg',
//     category: 'General',
//     date: '8 Juli 2025',
//     title: 'Kolaborasi dengan Startup Lokal untuk Pengembangan AI',
//     excerpt: 'PT Pratama Solusi Teknologi menjalin kerja sama dengan startup lokal untuk mengembangkan aplikasi berbasis AI...'
//   },
//   {
//     id: '3',
//     image: '/homepage/images/news3.png',
//     category: 'Digital Marketing',
//     date: '2 Mei 2025',
//     title: 'Strategi Content Marketing untuk Meningkatkan Engagement',
//     excerpt: 'Panduan lengkap untuk mengembangkan strategi konten yang efektif dan meningkatkan keterlibatan pelanggan...'
//   }
// ];

exports.home = async (req, res) => {
  try {
    const homes = await Home.findOne({ order: [['createdAt', 'DESC']] });
    const services = await Services.findAll({ order: [['id', 'ASC']] });

    // ✅ Simpan data visitor ke PostgreSQL
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const agent = req.headers['user-agent'];
    await Visitor.create({
      ip_address: ip,
      user_agent: agent
    });

    res.render('homepage/home', {
      title: 'Home',
      layout: 'homepage/layouts/main',
      homes,
      services
    });
  } catch (err) {
    console.error(err);
    res.redirect('/home');
  }
};

// function profil(req, res) {
//   res.render('homepage/profil', { title: 'Profil', layout: 'homepage/layouts/main' });
// }

exports.profile = async (req, res) => {
  try {
    const abouts = await About.findOne({ order: [['createdAt', 'DESC']] });

    res.render('homepage/profil', {
      title: 'Profile',
      layout: 'homepage/layouts/main',
      abouts,
    });
  } catch (err) {
    console.error(err);
    res.redirect('/profile');
  }
};

// function services(req, res) {
//   res.render('homepage/services', { title: 'Services', layout: 'homepage/layouts/main' });
// }

exports.services = async (req, res) => {
  try {
    const services = await Services.findAll({ order: [['id', 'ASC']] });

    res.render('homepage/services', {
      title: 'Services',
      layout: 'homepage/layouts/main',
      services
    });
  } catch (err) {
    console.error(err);
    res.redirect('/services');
  }
};

// function portofolio(req, res) {
//   res.render('homepage/portofolio', { title: 'Portofolio', layout: 'homepage/layouts/main' });
// }

exports.portofolio = async (req, res) => {
  try {
    const portofolios = await Portofolio.findAll({ order: [['createdAt', 'DESC']] });

    res.render('homepage/portofolio', {
      title: 'Portofolio',
      layout: 'homepage/layouts/main',
      portofolios,
    });
  } catch (err) {
    console.error(err);
    res.redirect('/portofolio');
  }
};

// function news(req, res) {
//   res.render('homepage/news', { title: 'News', berita, layout: 'homepage/layouts/main' });
// }

exports.news = async (req, res) => {
  try {
    const news = await News.findAll({ order: [['id', 'ASC']] });

    const categories = [...new Set(news.map(item => item.category))];

    res.render('homepage/news', {
      title: 'News',
      layout: 'homepage/layouts/main',
      news,
      categories
    });
  } catch (err) {
    console.error(err);
    res.redirect('/news');
  }
};

exports.getBeritaById = async (req, res) => {
  try {
    const slug = req.params.slug;
    const berita = await News.findOne({ where: { slug: slug } });

    if (!berita) {
      return res.status(404).send('Berita tidak ditemukan');
    }

    res.render('homepage/berita-detail', {
      title: berita.title,
      layout: 'homepage/layouts/main',
      berita
    });
  } catch (err) {
    console.error(err);
    res.redirect('/news');
  }
};