import { useState, useEffect } from 'react';
import Input from './Input';
import Card from './Card';

const CreditCardForm = ({ onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [color, setColor] = useState('bg-yellow-500');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, dueDate, finishDate , color});
  };

  useEffect(() => {
    setColor(initialData?.color || 'bg-yellow-500')
    setDueDate(initialData?.dueDate || '')
    setFinishDate(initialData?.finishDate || '')
    setName(initialData?.name || '')
  },[initialData])

  return (
    <Card> 
        <h1 className='text-2xl font-bold'>Create Credit Card</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-white p-3 rounded shadow">
          <div className="col-span-2">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="w-full max-w-lg">
            <label className="block text-gray-700 mb-2">Due Date</label>
            <input
              type="number"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="w-full max-w-lg ">
            <label className="block text-gray-700 mb-2">Finish Date</label>
            <input
              type="number"
              value={finishDate}
              onChange={(e) => setFinishDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className='grid grid-flow-col auto-cols-max gap-2'>
          <div className={'mt-9 w-8 h-8 rounded-full shadow-md '+ color}></div>
            <Input label="Color" type="select"  name="type" value={color}  onChange={(e) => setColor(e.target.value)}
              required options={[
              { value: 'bg-yellow-500', label: 'Yellow' },
              { value: 'bg-lime-500', label: 'Lime' },
              { value: 'bg-black', label: 'Black' },
              { value: 'bg-cyan-800', label: 'Cyan' },
              { value: 'bg-green-500', label: 'Green' },
              { value: 'bg-gray-600', label: 'Gray' },
            ]} />
          </div>
          
          <button type="submit" className="w-full h-10 mt-5 bg-black p-2 text-white rounded-md shadow">
            Save
          </button>
        </form>
    </Card>
    
  );
};

export default CreditCardForm;
