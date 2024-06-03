import dbConnect from '../../../lib/mongodb';
import CreditCard from '../../../models/CreditCard';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const creditCards = await CreditCard.find({});
    res.status(200).json({ success: true, data: creditCards });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
}
