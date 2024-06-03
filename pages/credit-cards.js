import { useState, useEffect } from 'react';
import CreditCardForm from '@/components/CreditCardForm';
import CreditCardList from '@/components/CreditCardList';
import { toast } from 'react-toastify';

const CreditCards = () => {
  const [editingCard, setEditingCard] = useState(null);
  const [creditCards, setCreditCards] = useState([]);


  const fetchCreditCards = async () => {
    const res = await fetch('/api/credit-cards');
    const data = await res.json();
    setCreditCards(data.data);
  };

  useEffect(() => {
    fetchCreditCards();
  }, []);

  const handleAdd = async (card) => {
    const resp = await fetch('/api/credit-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(card),
    });
    if (resp.ok) {
        toast.success('Credit card added successfully');
        fetchCreditCards();
      } else {
        toast.error('Failed to add credit card');
      }
  };

  const handleUpdate = async (card) => {
   const resp = await fetch(`/api/credit-cards/${editingCard._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(card),
    });
    if (resp.ok) {
        toast.success('Credit card updated successfully');
        setEditingCard(null);
        fetchCreditCards();
    } else {
        toast.error('Failed to update credit card');
    }
  };

  const handleDelete = async (id) => {
    const resp = await fetch(`/api/credit-cards/${id}`, {
      method: 'DELETE',
    });
    if (resp.ok) {
        toast.success('Credit card deleted successfully');
        fetchCreditCards();
      } else {
        toast.error('Failed to delete credit card');
      }
  };

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="">
        <CreditCardForm onSubmit={editingCard ? handleUpdate : handleAdd} initialData={editingCard} />
      </div>
      <div className="">
        <CreditCardList creditCards={creditCards} onEdit={setEditingCard} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default CreditCards;
