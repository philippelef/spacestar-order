import checkStock from "../../helpers/checkStock";

export default async function handler(req, res) {
    return res.status(200).json({ success: await checkStock() });
}