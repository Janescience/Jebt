import dbConnect from '@/lib/mongodb';
import CreditCard from '@/models/CreditCard';
import Debt from '@/models/Debt';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const creditCard = await CreditCard.findById(id);
        if (!creditCard) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: creditCard });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const creditCard = await CreditCard.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!creditCard) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: creditCard });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const debts = await Debt.find({creditCard:id});
        if(debts.length === 0){
          const deletedCreditCard = await CreditCard.deleteOne({ _id: id });
          if (!deletedCreditCard) {
            return res.status(404).json({ success: false });
          }
          res.status(200).json({ success: true, data: {} });
        }else{
          res.status(400).json({ success: false , message : 'Can not delete credit card used'});
        }
        
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
