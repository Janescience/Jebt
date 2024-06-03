import dbConnect from '../../../lib/mongodb';
import Debt from '../../../models/Debt';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const debt = await Debt.findById(id);
        if (!debt) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: debt });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const debt = await Debt.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!debt) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: debt });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const deletedDebt = await Debt.deleteOne({ _id: id });
        if (!deletedDebt) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
