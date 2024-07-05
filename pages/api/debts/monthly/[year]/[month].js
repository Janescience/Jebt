import dbConnect from '@/lib/mongodb';
import Debt from '@/models/Debt';
import CreditCard from '@/models/CreditCard';

export default async function handler(req, res) {
  const {
    query: { year, month },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      // try {
        console.log('year : ',year)
        console.log('month : ',month)

        const debts = await Debt.find({
          year: year,
          month: month-1
        }).populate('creditCard');

        res.status(200).json({ success: true, data: debts });
      // } catch (error) {
      //   res.status(400).json({ success: false, error });
      // }
      break;
    case 'DELETE':
      try {
        const result = await Debt.deleteMany({
          year: year,
          month: month-1
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'No debts found for the specified month and year' });
        }

        res.status(200).json({ success: true, message: 'Debts deleted successfully' });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;  
    default:
      res.status(400).json({ success: false });
      break;
  }
}
