// controllers/PortofolioPrivateController.js
const PortofolioPrivate = require('../../models/dashboard/PortofolioPrivate');

exports.index = async (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect('/login');
  
    const data = await PortofolioPrivate.findAll({
        order: [
            ['tahun_anggaran', 'DESC'], // urut berdasarkan tahun dulu
            ['id', 'ASC']               // lalu urutkan berdasarkan ID
        ]
    });
  
    const formattedData = data.map(item => {
      const formatTanggal = (tgl) =>
        tgl ? new Date(tgl).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }) : '-';
  
      return {
        ...item.dataValues,
        tanggal_kontrak: formatTanggal(item.tanggal_kontrak),
        tanggal_selesai_kontrak: formatTanggal(item.tanggal_selesai_kontrak),
        tanggal_ba_serah_terima: formatTanggal(item.tanggal_ba_serah_terima),
        nilai_kontrak: item.nilai_kontrak
        ? item.nilai_kontrak.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          })
        :'Rp0'
      };
    });
  
    res.render('dashboard/adminpage/portofolioprivate/index', {
      layout: 'dashboard/layouts/main',
      title: 'Portofolio Private',
      user,
      portofolioprivates: formattedData,
    });
};  
