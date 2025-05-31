import app from "./server";

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(
            `📡 API available at http://localhost:${PORT}/api/packages`
        );
    });
}

export default app;
