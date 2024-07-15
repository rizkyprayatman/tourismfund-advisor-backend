const express = require('express');
const app = express();

require('dotenv').config();

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