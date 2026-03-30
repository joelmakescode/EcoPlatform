function auth(req, res, next) {
    const authHeader = req.headers["authorization"];

    const skipAuth = [
        "/api/ecoplatform-user",
    ];

    if (skipAuth.some(path => req.originalUrl.startsWith(path))) {
        return next();
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    if (token !== process.env.API_TOKEN) {
        return res.status(403).json({ error: "Invalid Token" });
    }

    next();
}

module.exports = auth;