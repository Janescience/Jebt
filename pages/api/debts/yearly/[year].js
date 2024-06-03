import dbConnect from '@/lib/mongodb';
import Debt from '@/models/Debt';

export default async function handler(req, res) {
  const {
    query: { year },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        
        const debts = await Debt.find({
          year: year,
        });

        const sums = debts.reduce((acc, debt) => {
          const month = debt.month;
          const year = debt.year;
          const key = `${year}-${month + 1}`;

          if (!acc[key]) {
            acc[key] = 0;
          }

          acc[key] += debt.paid;

          return acc;
        }, {});

        res.status(200).json({ success: true, data: sums });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false, message: 'Invalid request method' });
      break;
  }
}
