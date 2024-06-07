import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import DebtForm from '@/components/DebtForm';
import DebtDetails from '@/components/DebtDetails';

import { FaPlus } from 'react-icons/fa';


const Debts = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [sums, setSums] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [debtDetails, setDebtDetails] = useState([]);
  const [editingDebt, setEditingDebt] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [creditCards, setCreditCards] = useState([]);
  const [formValues, setFormValues] = useState({
    name: 'Advance',
    type: 'credit card',
    creditCard: '',
    detail: '',
    amount: 10000,
    flag: 'installment',
    monthStart: 5,
    yearStart:new Date().getFullYear(),
    allPeriod: 10,
    paid: '',
    balance: '',
    interest: 0.74,
    transactionDate: '',
    user : 'Jane'
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
    fetchSums(selectedYear);
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

    fetchSums(selectedYear);

    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      fetchDebtDetails(year, month);
    }
    setEditingDebt(null);
    setFormValues({
      name: 'Advance',
      type: 'credit card',
      creditCard: '',
      detail: '',
      amount: 10000,
      flag: 'installment',
      monthStart: 5,
      yearStart:new Date().getFullYear(),
      allPeriod: 10,
      paid: '',
      balance: '',
      interest: 0.74,
      transactionDate: '',
      user : 'Jane'
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

  const deleteDebt = async (debt) => {
    const res = await fetch(`/api/debts/${debt.id}`, {
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
      creditCard: debt.creditCard._id,
      detail: debt.detail,
      amount: debt.amount,
      flag: debt.flag,
      monthStart: debt.month,
      yearStart: debt.year,
      allPeriod: debt.allPeriod,
      paid: debt.paid,
      balance: debt.balance,
      interest: debt.interest,
      transactionDate: debt.transactionDate.split('T')[0],
      user : debt.user
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
      yearStart:new Date().getFullYear(),
      allPeriod: '',
      paid: '',
      balance: '',
      interest: '',
      transactionDate: '',
      user : 'Jane'
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
      const user = debt.user ? debt.user.name : 'No User';  // Assuming debt has a user field
      const creditCard = debt.creditCard ? debt.creditCard.name : 'No Credit Card';
      const flag = debt.flag;
  
      if (!groups[user]) {
        groups[user] = { sum: 0, creditCards: {} };
      }
      if (!groups[user].creditCards[creditCard]) {
        groups[user].creditCards[creditCard] = { sum: 0, flags: {} };
      }
      if (!groups[user].creditCards[creditCard].flags[flag]) {
        groups[user].creditCards[creditCard].flags[flag] = { sum: 0, debts: [] };
      }
  
      groups[user].sum += debt.paid;
      groups[user].creditCards[creditCard].sum += debt.paid;
      groups[user].creditCards[creditCard].flags[flag].sum += debt.paid;
      groups[user].creditCards[creditCard].flags[flag].debts.push(debt);
    });

    console.log('groupDebts : ',groups)
  
    return groups;
  };
  

  const groupedDebts = groupDebts();

  const sortedMonthKeys = Object.keys(sums).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
  });

  return (
    <Card title="">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Debts</h1>
        <Button onClick={handleAddClick}><FaPlus/></Button>
      </div>
      <div className="mb-4 flex justify-between">
        <Input
          label=""
          type="select"
          name="year"
          value={selectedYear}
          onChange={handleYearChange}
          options={getYearsOptions().map((year) => ({ value: year, label: year }))}
        />
      </div>
      {showForm && (
        <DebtForm
          formValues={formValues}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          editingDebt={editingDebt}
          getYearsOptions={getYearsOptions}
          creditCards={creditCards}
        />
      )}
      <DebtDetails
        sums={sums}
        debtSorted={sortedMonthKeys}
        handleMonthClick={handleMonthClick}
        selectedMonth={selectedMonth}
        currentYear={currentYear}
        currentMonth={currentMonth}
        formatMonthYear={formatMonthYear}
        groupedDebts={groupedDebts}
        toggleGroup={toggleGroup}
        expandedGroups={expandedGroups}
        handleEditClick={handleEditClick}
        deleteDebt={deleteDebt}
      />
      
    </Card>
  );
};

export default Debts;
