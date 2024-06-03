import dbConnect from '@/lib/mongodb';
import Debt from '@/models/Debt';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const oneYearAgo = new Date();

        const debts = await Debt.find({ year: oneYearAgo.getFullYear()  });

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
    case 'POST':
      try {
        const { name, type, creditCard, detail, amount,paid, flag, monthStart,yearStart, allPeriod, balance, interest, transactionDate } = req.body;
        const paidPerMonth = amount / allPeriod;
        const debts = [];

        for (let i = 0; i < allPeriod; i++) {
            const currentDate = new Date(yearStart,monthStart-1,1)//start from transaction date
            currentDate.setMonth(i+(monthStart - 1));

            debts.push({
                name,
                type,
                creditCard,
                detail,
                amount,
                flag,
                month:currentDate.getMonth(), 
                year:currentDate.getFullYear(),
                currentPeriod:i+1,
                allPeriod,
                paid,
                balance: balance - (paidPerMonth * (i + 1)),
                interest,
                transactionDate:new Date(transactionDate)
            });
        }

        await Debt.insertMany(debts);
        res.status(201).json({ success: true, data: debts });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
