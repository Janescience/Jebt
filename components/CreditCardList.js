import { useState, useEffect } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

const CreditCardList = ({ onEdit, onDelete }) => {
  const [creditCards, setCreditCards] = useState([]);
  const fetchCreditCards = async () => {
    const res = await fetch('/api/credit-cards');
    const data = await res.json();
    setCreditCards(data.data);
  };

  useEffect(() => {
    fetchCreditCards();
  }, []);

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Credit Cards</h2>
      <ul>
        {creditCards.map((card) => (
          <li key={card._id} className="flex justify-between items-center mb-2 p-2 border rounded shadow">
            <div>
              <p className="font-bold">{card.name}</p>
              <p>Due Date: {card.dueDate}</p>
              <p>Finish Date: {card.finishDate}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => onEdit(card)} >
                <FaRegEdit />
              </button>
              <button onClick={() => onDelete(card._id)} >
                <FaRegTrashAlt />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreditCardList;
