import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import DebtDetailsTable from '@/components/DebtDetailsTable';

const Debts = () => {
  const [sums, setSums] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [debtDetails, setDebtDetails] = useState([]);
  const [editingDebt, setEditingDebt] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [creditCards, setCreditCards] = useState([]);
  const [formValues, setFormValues] = useState({
    name: '',
    type: 'credit card',
    creditCard: '',
    detail: '',
    amount: '',
    flag: 'installment',
    monthStart: '',
    allPeriod: '',
    paid: '',
    balance: '',
    interest: '',
    transactionDate: '',
  });

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    fetchSums(selectedYear);
  }, [selectedYear]);

  const fetchSums = async (year) => {
    const res = await fetch(`/api/debts/yearly/${year}`);
    const data = await res.json();
    setSums(data.data);
  };


  useEffect(() => {
    const fetchSums = async () => {
      const res = await fetch('/api/debts');
      const data = await res.json();
      setSums(data.data);
    };

    fetchSums();
  }, []);

  useEffect(() => {
    if (formValues.type === 'credit card') {
      const fetchCreditCards = async () => {
        const res = await fetch('/api/credit-cards/all');
        const data = await res.json();
        setCreditCards(data.data);
      };

      fetchCreditCards();
    }
  }, [formValues.type]);

  const fetchDebtDetails = async (year, month) => {
    const res = await fetch(`/api/debts/monthly/${year}/${month}`);
    const data = await res.json();
    setDebtDetails(data.data);
  };

  const handleMonthClick = (year, month) => {
    fetchDebtDetails(year, month);
    setSelectedMonth(`${year}-${month}`);
  };

  const formatMonthYear = (key) => {
    const [year, month] = key.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => {
      const newValues = { ...prev, [name]: value };
      if (name === 'amount' || name === 'interest' || name === 'period') {
        if (newValues.flag === 'installment') {
            newValues.balance = calculateBalance(newValues.amount, newValues.interest, newValues.allPeriod);
            newValues.paid = calculatePaidPerPeriod(newValues.amount, newValues.interest, newValues.allPeriod);
        }
      }
      return newValues;
    });
  };

  const calculateBalance = (amount, interest, allPeriod) => {
    if (!amount || !interest || !allPeriod) return '';
    const monthlyInterestRate = parseFloat(interest) / 100;
    const totalInterest = parseFloat(amount) * monthlyInterestRate * parseFloat(allPeriod);
    return parseFloat(amount) + totalInterest;
  };

  const calculatePaidPerPeriod = (amount, interest, allPeriod) => {
    if (!amount || !interest || !allPeriod) return '';
    const balance = calculateBalance(amount, interest, allPeriod);
    return balance / parseFloat(allPeriod);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        ...formValues,
        amount: parseFloat(formValues.amount),
        transactionDate: new Date(formValues.transactionDate),
      };
  
      if (formValues.flag === 'paid full') {
        // Set monthStart to the next month from the transaction date
        const transactionDate = new Date(formValues.transactionDate);
        payload.monthStart = transactionDate.getMonth() + 2; // JavaScript months are 0-indexed
        payload.allPeriod = 1;
        payload.paid = parseFloat(formValues.amount);
        payload.balance = 0;
        payload.interest = 0;
      } else {
        payload.allPeriod = parseFloat(formValues.allPeriod);
        payload.paid = parseFloat(formValues.paid);
        payload.balance = parseFloat(formValues.balance);
        payload.interest = parseFloat(formValues.interest);
      }
  
    if (editingDebt) {
      await updateDebt(editingDebt._id, payload);
    } else {
      await addDebt(payload);
    }
  
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      fetchDebtDetails(year, month);
    }
    setEditingDebt(null);
    setFormValues({
      name: '',
      type: 'credit card',
      creditCard: '',
      detail: '',
      amount: '',
      flag: 'installment',
      monthStart: '',
      allPeriod: '',
      paid: '',
      balance: '',
      interest: '',
      transactionDate: '',
    });
    setShowForm(false);
  };
  
  const addDebt = async (debt) => {
    const res = await fetch('/api/debts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(debt),
    });
    if (res.ok) {
      toast.success('Debt added successfully');
    } else {
      toast.error('Failed to add debt');
    }
  };

  const updateDebt = async (id, debt) => {
    const res = await fetch(`/api/debts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(debt),
    });
    if (res.ok) {
      toast.success('Debt updated successfully');
    } else {
      toast.error('Failed to update debt');
    }
  };

  const deleteDebt = async (id) => {
    const res = await fetch(`/api/debts/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      toast.success('Debt deleted successfully');
      if (selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        fetchDebtDetails(year, month);
      }
    } else {
      toast.error('Failed to delete debt');
    }
  };

  const handleEditClick = (debt) => {
    setEditingDebt(debt);
    setFormValues({
      name: debt.name,
      type: debt.type,
      creditCard: debt.creditCard || '',
      detail: debt.detail,
      amount: debt.amount,
      flag: debt.flag,
      monthStart: new Date(debt.transactionDate).getMonth(),
      allPeriod: debt.allPeriod,
      paid: debt.paid,
      balance: debt.balance,
      interest: debt.interest,
      transactionDate: debt.transactionDate.split('T')[0],
    });
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingDebt(null);
    setFormValues({
      name: '',
      type: 'credit card',
      creditCard: '',
      detail: '',
      amount: '',
      flag: 'installment',
      monthStart: '',
      allPeriod: '',
      paid: '',
      balance: '',
      interest: '',
      transactionDate: '',
    });
    setShowForm(true);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setShowForm(false)
    setSelectedMonth(false)
  };

  const getYearsOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      years.push(year);
    }
    return years;
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const groupDebts = () => {
    const groups = {};

    debtDetails.forEach((debt) => {
      const groupKey = `${debt.creditCard ? debt.creditCard.name : 'No Credit Card'} - ${debt.flag}`;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(debt);
    });

    return groups;
  };

  const groupedDebts = groupDebts();

  return (
    <Card title="Debts">
      <div className="mb-4 flex justify-between">
        <Button onClick={handleAddClick}>Create Debt</Button>
        <Input 
          label="" 
          type="select" 
          name="year" 
          value={selectedYear} 
          onChange={handleYearChange} 
          options={getYearsOptions().map((year)=> ({ value: year, label: year }))} 
        />
      </div>
      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-4 bg-gray-100 p-5 rounded shadow">
          <h3 className="text-xl font-bold mb-4">{editingDebt ? 'Edit Debt Details' : 'Input Debt Details'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Type"
              type="select"
              name="type"
              value={formValues.type}
              onChange={handleInputChange}
              required
              options={[
                {
                  value:'credit card',
                  label:'Credit Card'
                },                   
                {
                  value:'regular',
                  label:'Regular' 
                },                 
                {
                  value:'cash',
                  label:'Cash' 
                }, ]} 
            />
            {formValues.type === 'credit card' && (
              <Input
                label="Credit Card"
                type="select"
                name="creditCard"
                value={formValues.creditCard}
                onChange={handleInputChange}
                required
                options={[
                  {
                    value:'',
                    label:'Select Credit Card'
                  },                   
                  ...creditCards.map((card) => ({value:card._id,label:card.name}))  
                ]} 
              />
            )}
            <Input
              label="Detail"
              type="text"
              name="detail"
              value={formValues.detail}
              onChange={handleInputChange}
              
            />
            <Input
              label="Amount"
              type="number"
              name="amount"
              value={formValues.amount}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Flag"
              type="select"
              name="flag"
              value={formValues.flag}
              onChange={handleInputChange}
              required
              options={[
                {
                  value:'installment',
                  label:'Installment'
                },                   
                {
                  value:'paid full',
                  label:'Paid Full' 
                },                 
              ]} 
            />
            {formValues.flag === 'installment' && (
              <>
                <Input
                  label="Month Start"
                  type="number"
                  name="monthStart"
                  value={formValues.monthStart}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Period"
                  type="number"
                  name="allPeriod"
                  value={formValues.allPeriod}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Paid/Period"
                  type="number"
                  name="paid"
                  value={formValues.paid}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Balance"
                  type="number"
                  name="balance"
                  value={formValues.balance}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Interest"
                  type="number"
                  name="interest"
                  value={formValues.interest}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}
            <Input
                label="Transaction Date"
                type="date"
                name="transactionDate"
                value={formValues.transactionDate}
                onChange={handleInputChange}
                required
              />
          </div>
          <Button type="submit">{editingDebt ? 'Update':'Save'}</Button>
        </form>
      )}
      <ul>
        {Object.keys(sums).map((key) => {
          const [year, month] = key.split('-');
          return (
            <li
              key={key}
              className="mb-2 p-2 border rounded shadow cursor-pointer"
              onClick={() => handleMonthClick(year, month)}
            >
              <div className="flex justify-between">
                <span>{formatMonthYear(key)}</span>
                <span>${sums[key].toFixed(2)}</span>
              </div>
            </li>
          );
        })}
      </ul>
      {selectedMonth && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Details for {formatMonthYear(selectedMonth)}</h3>
            {Object.keys(groupedDebts).map((groupKey) => (
              <div key={groupKey} className="mb-2 p-2 border rounded shadow cursor-pointer" onClick={() => toggleGroup(groupKey)}>
                <div className="flex justify-between">
                  <span>{groupKey}</span>
                  <span>${groupedDebts[groupKey].reduce((acc, debt) => acc + debt.paid, 0).toFixed(2)}</span>
                </div>
                {expandedGroups[groupKey] && (
                  <DebtDetailsTable 
                    debts={groupedDebts[groupKey]}
                    onEdit={handleEditClick}
                    onDelete={(debt) => deleteDebt(debt._id)}
                  />
                )}
              </div>
            ))}
        </div>
      )}
    </Card>
  );
};

export default Debts;
