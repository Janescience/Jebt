import dbConnect from '@/lib/mongodb';
import CreditCard from '@/models/CreditCard';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const creditCards = await CreditCard.find({});
        res.status(200).json({ success: true, data: creditCards });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case 'POST':
      try {
        const creditCard = await CreditCard.create(req.body);
        res.status(201).json({ success: true, data: creditCard });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
