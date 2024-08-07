const express = require('express');
const cors = require('cors');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const unitRoutes = require('./routes/unitRoutes');
const visitRoutes = require('./routes/visitRoutes');

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/admin', adminRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/visits', visitRoutes);

const PORT = process.env.PORT || 3000;

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running in port http://localhost:${PORT}`);
});