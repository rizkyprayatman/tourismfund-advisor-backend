const { formatDateTime, formatDateTimeVisit } = require('../utils/formatDateTime');
const { Visit, Unit } = require('../models');
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');

AWS.config.update({
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    region: process.env.R2_REGION,
});

const s3 = new AWS.S3();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateVisitNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month starts from 0
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `KDAK${year}${month}${date}${hours}${minutes}${seconds}`;
};

const registerVisit = async (req, res) => {
    try {
        const { nama, email, nomor_telepon, tanggal_berkunjung } = req.body;
        const fileUrl = req.file;

        const no_kunjungan = generateVisitNumber();

        const urlDocument = `${process.env.R2_PUBLIC_URL}/${fileUrl.key}`

        const newVisit = {
            nama,
            email,
            nomor_telepon,
            tanggal_berkunjung,
            file: urlDocument,
            key_file: fileUrl.key,
            status: "pending",
            no_kunjungan,
        };

        await Visit.create(newVisit)

        const dateVisit = formatDateTimeVisit(tanggal_berkunjung)

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `${nama}, Pendaftaran Kunjungan Anda Sedang Diproses`,
            html: `
                <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px;">
                    <h4>Hai ${nama}</h4>
                    <p style="margin-bottom: 20px;">Detail Pendaftaran Sebagai Berikut:</p>
                    <table>
                        <tr>
                        <td>No Pendaftaran</td>
                        <td>:</td>
                        <td>${no_kunjungan}</td>
                        </tr>
                        <tr>
                        <td>Nama</td>
                        <td>:</td>
                        <td>${nama}</td>
                        </tr>
                        <tr>
                        <td>Email</td>
                        <td>:</td>
                        <td>${email}</td>
                        </tr>
                        <tr>
                        <td>Nomor Telepon</td>
                        <td>:</td>
                        <td>${nomor_telepon}</td>
                        </tr>
                        <tr>
                        <td>Tanggal Berkunjung</td>
                        <td>:</td>
                        <td>${dateVisit}</td>
                        </tr>
                        <tr>
                        <td>File</td>
                        <td>:</td>
                        <td><a style="text-decoration: none;" href="${urlDocument}">${no_kunjungan}.pdf</a></td>
                        </tr>
                    </table>
                    <p>
                        Pendaftaran kunjungan Anda sedang diproses. Kami menginformasikan bahwa Kami tidak memungut Biaya/Tarif.
                    </p>
                    <p>
                        Informasi/jawaban pelaksanaan konsultasi disampaikan maksimal 10 (sepuluh) hari kerja sejak surat permohonan diterima oleh Menteri /Sekretaris Kementerian/Deputi Bidang yang bersangkutan/Inspektur Utama
                    </p>
                    <p>
                        Kami akan menghubungi Anda terkait pendaftaran Anda.
                    </p>
                    <p>
                        Jika Anda merasa tidak pernah mendaftar pada platform ini, abaikan email ini.
                    </p>
                    <h4>Terima Kasih</h4>
                    <div style="text-align: center; background-color: #0000ff; padding: 10px 0;">
                        <h1 style="color: white;">Butuh Bantuan?</h1>
                        <p style="color: white;">Silakan tanya kami melalui <a style="color: white;" href="mailto:kdak@gmail.com">kdak@gmail.com</a></p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Pendaftaran berhasil, sedang diproses.' });
    } catch (error) {
        console.error('Error saat pendaftaran:', error);
        res.status(500).json({ message: 'Gagal melakukan pendaftaran.' });
    }
};

const updateVisit = async (req, res) => {
    try {
        const visitId = req.params.id;
        const { unitId, tanggal } = req.body;

        const visit = await Visit.findByPk(visitId);

        if (!visit) {
            return res.status(404).json({ message: 'Kunjungan tidak ditemukan.' });
        }

        const unitKerja = await Unit.findByPk(unitId)
        console.log(unitKerja)
        if (!unitKerja) {
            return res.status(404).json({ message: 'Unit Kerja tidak ditemukan.' });
        }

        visit.status = 'approved';
        visit.unitId = unitId;
        visit.tanggal_berkunjung = tanggal;

        await visit.save();


        const dateVisit = formatDateTime(visit.tanggal_berkunjung)


        const mailOptionsUser = {
            from: process.env.EMAIL_USER,
            to: visit.email,
            subject: `${visit.nama}, Pendaftaran Kunjungan Anda Telah Disetujui`,
            html: `
            <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px;">
                <h4>Hai <strong>${visit.nama}</strong>,</h4>
                <p style="margin-top: 10px;">
                    Pendaftaran kunjungan Anda dengan No Pendaftaran <strong>${visit.no_kunjungan}</strong>, pada tanggal <strong>${dateVisit}</strong> telah disetujui.
                </p>
                <p>
                    Anda diarahkan ke unit kerja <strong>${unitKerja.nama}</strong>. Mohon untuk datang tepat waktu.
                </p>
                <p>
                    Anda dapat melakukan verifikasi pendaftaran melalui Bidang Pelayanan Informasi dan kemudian akan diarahkan kepada satuan kerja/deputi terkait.
                </p>
                <p>
                    Jika Anda merasa tidak pernah mendaftar pada platform ini, abaikan email ini.
                </p>
                <h4>Terima Kasih</h4>
                <div style="text-align: center; background-color: #0000ff; padding: 10px 0;">
                    <h1 style="color: white;">Butuh Bantuan?</h1>
                    <p style="color: white;">Silakan hubungi kami melalui <a style="color: white;" href="mailto:kdak@gmail.com">kdak@gmail.com</a></p>
                </div>
            </div>
            `,
        };

        if (unitId) {
            const unit = await Unit.findByPk(unitId);

            if (unit && unit.email_pic) {
                const mailOptionsUnit = {
                    from: process.env.EMAIL_USER,
                    to: unit.email_pic,
                    subject: `Pendaftaran Kunjungan Baru`,
                    html: `
                        <div>
                            <p>Hai <strong>${unit.pic}</strong>,</p>
                            <p>Telah terjadwal kunjungan baru pada <strong>${dateVisit}</strong> dari <strong>${visit.nama}</strong>.</p>
                            <p style="margin-bottom: 20px;">Detail Kunjungan Sebagai Berikut:</p>
                            <table>
                                <tr>
                                <td>No Pendaftaran</td>
                                <td>:</td>
                                <td>${visit.no_kunjungan}</td>
                                </tr>
                                <tr>
                                <td>Nama</td>
                                <td>:</td>
                                <td>${visit.nama}</td>
                                </tr>
                                <tr>
                                <td>Email</td>
                                <td>:</td>
                                <td>${visit.email}</td>
                                </tr>
                                <tr>
                                <td>Nomor Telepon</td>
                                <td>:</td>
                                <td>${visit.nomor_telepon}</td>
                                </tr>
                                <tr>
                                <td>Tanggal Berkunjung</td>
                                <td>:</td>
                                <td>${visit.tanggal_berkunjung}</td>
                                </tr>
                                <tr>
                                <td>File</td>
                                <td>:</td>
                                <td><a style="text-decoration: none;" href="${visit.urlDocument}">${visit.no_kunjungan}.pdf</a></td>
                                </tr>
                            </table>
                            <p>Silakan persiapkan untuk menyambut kedatangan mereka.</p>
                            <h4>Terima Kasih</h4>
                            <div style="text-align: center; background-color: #0000ff; padding: 10px 0;">
                                <h1 style="color: white;">Butuh Bantuan?</h1>
                                <p style="color: white;">Silakan hubungi kami melalui <a style="color: white;" href="mailto:kdak@gmail.com">kdak@gmail.com</a></p>
                            </div>
                        </div>
                    `,
                };

                await transporter.sendMail(mailOptionsUnit);
            }
        }

        await transporter.sendMail(mailOptionsUser);

        res.status(200).json({ message: 'Status kunjungan berhasil diupdate.' });
    } catch (error) {
        console.error('Error saat mengupdate kunjungan:', error);
        res.status(500).json({ message: 'Gagal mengupdate status kunjungan.' });
    }
};


module.exports = {
    registerVisit,
    updateVisit,
};
