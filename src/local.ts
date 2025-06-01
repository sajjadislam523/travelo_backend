import app from "./server";
// Only listen locally
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}
