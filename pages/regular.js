
import Input from "@/components/Input";
import Button from "@/components/Button";
import Table from "@/components/Table";
import ConfirmModal from "@/components/ConfirmModal";

import { FaRegEdit,FaRegTrashAlt } from "react-icons/fa";
import { useState,useEffect } from "react";
import { toast } from 'react-toastify';

const Regular = () => {
  const [edit, setEdit] = useState(null);
  const [regulars, setRegulars] = useState([]);
  const [regularToDelete, setRegularToDelete] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    name: '',
    detail: '',
    amount: '',
    user : 'Jane'
  });

  useEffect(() => {
    fetchDatas();
  }, []);


  const fetchDatas = async () => {
    const res = await fetch(`/api/regular`);
    const data = await res.json();
    setRegulars(data.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => {
      const newValues = { ...prev, [name]: value };
      return newValues;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formValues,
      amount: parseFloat(formValues.amount),
    };
  
    if (edit) {
      await update(edit._id, payload);
    } else {
      await create(payload);
    }

    fetchDatas();
    setEdit(null);
    setFormValues({
      name: '',
      detail: '',
      amount: '',
      user : 'Jane'
    });
  };

  const handleEditClick = (regular) => {
    setEdit(regular);
    setFormValues({
      name: regular.name,
      detail: regular.detail,
      amount: regular.amount,
      user : regular.user
    });
  };

  const handleDeleteClick = (regular) => {
    setRegularToDelete(regular);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (regularToDelete) {
      remove(regularToDelete.id);
    }
    setConfirmOpen(false);
    setRegularToDelete(null);
  };

  const create = async (payload) => {
    const res = await fetch('/api/regular', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success('Regular created successfully');
    } else {
      toast.error('Failed to created regular');
    }
  };

  const update = async (id, payload) => {
    const res = await fetch(`/api/regular/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success('Regular updated successfully');
    } else {
      toast.error('Failed to update regular');
    }
  };

  const remove = async (id) => {
    const res = await fetch(`/api/regular/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      toast.success('Debt deleted successfully');
    } else {
      toast.error('Failed to delete debt');
    }
  };

  const headers = [
    'name',
    'datail',
    'amount',
    'user'
  ];

  const data = regulars.map((regular) => ({
    id : regular._id,
    name: regular.name,
    detail: regular.detail,
    amount: regular.amount,
    user : regular.user,
  }));

  const actions = [
    { label: '', icon: FaRegEdit ,onClick: handleEditClick, className: 'mr-5' },
    { label: '', icon: FaRegTrashAlt ,onClick: handleDeleteClick, className: 'mr-5' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Regulars Expense</h1>

      <form onSubmit={handleFormSubmit} className="mb-4 bg-gray-100 p-5 rounded shadow">
        <h3 className="text-xl font-bold mb-4">{edit ? 'Edit Regular' : 'Create Regular'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Input label="Name" type="text" name="name" value={formValues.name} onChange={handleInputChange} required />
          <Input label="Detail" type="text" name="detail" value={formValues.detail} onChange={handleInputChange} />
          <Input label="Amount" type="number" name="amount" value={formValues.amount} onChange={handleInputChange} required />
          <Input label="User" type="text" name="user" value={formValues.user} onChange={handleInputChange} required />
          <div className='col-span-2 lg:col-span-1 flex mt-8'>
            <Button type="submit" >{edit ? 'Update' : 'Save'}</Button>
          </div>
        </div>
      </form>
      <Table headers={headers} data={data} actions={actions} />
      <ConfirmModal
        isOpen={confirmOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${regularToDelete?.name} ?`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
  };
  
  export default Regular;