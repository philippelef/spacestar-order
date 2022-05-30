import addressDistance from "../../helpers/addressDistance";

export default async function handler(req, res) {
    return res.status(200).json({ success: await addressDistance(req.body.shippingInfo) });
}