import { rateLimit } from "../config/upstash.js";

export const rateLimiter = async (req, res, next) => {
	try {
		const { success } = await rateLimit.limit("walleto-api-call-rate-limit");

		if (!success) {
			return res.status(429).json({ message: "Too Many Requests" });
		}

		next();
	} catch (error) {
		console.log("Rate Limit Error", error);
		next(error);
	}
};
