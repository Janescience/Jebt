import { useState, useEffect } from 'react';

const CreditCardForm = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [finishDate, setFinishDate] = useState(initialData?.finishDate || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, dueDate, finishDate });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded shadow">
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
      <div className="w-full max-w-lg mb-4">
        <label className="block text-gray-700 mb-2">Due Date</label>
        <input
          type="number"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="w-full max-w-lg mb-4">
        <label className="block text-gray-700 mb-2">Finish Date</label>
        <input
          type="number"
          value={finishDate}
          onChange={(e) => setFinishDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="col-span-2 bg-black p-2 text-white rounded-md shadow">
        Save
      </button>
    </form>
  );
};

export default CreditCardForm;
