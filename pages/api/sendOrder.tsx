import sendOrder from "../../helpers/sendOrder";

export default async function handler(req, res) {
    return res.status(200).json({ success: await sendOrder(req.body.orderInfo) });
}