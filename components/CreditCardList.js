import { useState, useEffect } from 'react';
import { FaRegEdit, FaRegTrashAlt} from 'react-icons/fa';
import Card from './Card';

const CreditCardList = ({ onEdit, onDelete,creditCards }) => {
  // const [creditCards, setCreditCards] = useState([]);
  // const fetchCreditCards = async () => {
  //   const res = await fetch('/api/credit-cards');
  //   const data = await res.json();
  //   setCreditCards(data.data);
  // };

  // useEffect(() => {
  //   fetchCreditCards();
  // }, []);

  return (
    <Card title="Credit Cards">
      <ul>
        {creditCards.map((card) => (
          <li key={card._id} className="flex justify-between items-center mb-2 p-2 border rounded shadow">
            <div>
              <div className='flex'>
                <p className={card.color + ' rounded-full shadow-md h-4 w-4 mr-1'}></p>
                <p className="font-bold">{card.name}</p>
              </div>
              
              <p>Due Date: {card.dueDate}</p>
              <p>Finish Date: {card.finishDate}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => onEdit(card)} className='bg-black rounded-md p-2 text-white'>
                <FaRegEdit size={15} />
              </button>
              <button onClick={() => onDelete(card._id)} className='bg-black rounded-md p-2 text-red-600'>
                <FaRegTrashAlt  size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default CreditCardList;
