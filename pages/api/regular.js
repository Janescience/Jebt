import dbConnect from '@/lib/mongodb';
import Regular from '@/models/Regular';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const regulars = await Regular.find();
        res.status(200).json({ success: true, data: regulars });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case 'POST':
      try {
        await Regular.create(req.body);
        res.status(200).json({ success: true});
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    case 'DELETE':
      try {
        const id = req.params.id
        await Regular.deleteOne(id);
        res.status(200).json({ success: true, message: 'Regular deleted successfully' });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete regular' });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
