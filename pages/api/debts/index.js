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
        const { name, type, creditCard, detail, amount,paid, flag, monthStart,yearStart, allPeriod, balance, interest, transactionDate ,user} = req.body;
        const paidPerMonth = amount / allPeriod;
        const debts = [];
        
        if(type == 'credit card'){
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
                  transactionDate:new Date(transactionDate),
                  user
              });
          }

          await Debt.insertMany(debts);
        }else if(type == 'cash'){
          const date = new Date(transactionDate);
          const debt = {
              name,
              type,
              creditCard:null,
              detail,
              amount,
              flag,
              month:date.getMonth(), 
              year:date.getFullYear(),
              currentPeriod:1,
              allPeriod:1,
              paid:amount,
              balance: 0,
              interest: 0,
              transactionDate:date,
              user
          }
          await Debt.create(debt);
        }
        
        res.status(201).json({ success: true, data: debts });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case 'DELETE':
      try {
        const { name, type , user, amount , creditCard ,allPeriod, flag , detail} = req.body;
        await Debt.deleteMany({ name, type, user, amount , creditCard ,allPeriod, flag, detail});
        res.status(200).json({ success: true, message: 'Debts deleted successfully' });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete debts' });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
