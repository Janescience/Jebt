import React from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';

const DebtForm = ({ formValues, handleInputChange, handleFormSubmit, editingDebt, getYearsOptions, creditCards }) => (
  <form onSubmit={handleFormSubmit} className="mb-4 bg-gray-100 p-5 rounded shadow">
    <h3 className="text-xl font-bold mb-4">{editingDebt ? 'Edit Debt' : 'Add Debt'}</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Input label="Name" type="text" name="name" value={formValues.name} onChange={handleInputChange} required />
      <Input label="Type" type="select" name="type" value={formValues.type} onChange={handleInputChange} required options={[
        { value: 'credit card', label: 'Credit Card' },
        { value: 'regular', label: 'Regular' },
        { value: 'cash', label: 'Cash' },
      ]} />
      {formValues.type === 'credit card' && (
        <Input label="Credit Card" type="select" name="creditCard" value={formValues.creditCard} onChange={handleInputChange} required options={[
          { value: '', label: 'Select Credit Card' },
          ...creditCards.map((card) => ({ value: card._id, label: card.name })),
        ]} />
      )}
      <Input label="Detail" type="text" name="detail" value={formValues.detail} onChange={handleInputChange} />
      <Input label="Amount" type="number" name="amount" value={formValues.amount} onChange={handleInputChange} required />
      <Input label="Flag" type="select" name="flag" value={formValues.flag} onChange={handleInputChange} required options={[
        { value: 'installment', label: 'Installment' },
        { value: 'paid full', label: 'Paid Full' },
      ]} />
      {formValues.flag === 'installment' && (
        <>
          <Input label="Month Start" type="number" name="monthStart" value={formValues.monthStart} onChange={handleInputChange} required />
          <Input label="Year Start" type="select" name="yearStart" value={formValues.yearStart} onChange={handleInputChange} options={getYearsOptions().map((year) => ({ value: year, label: year }))} required />
          <Input label="Period" type="number" name="allPeriod" value={formValues.allPeriod} onChange={handleInputChange} required />
          <Input label="Paid/Period" type="number" name="paid" value={formValues.paid} onChange={handleInputChange} required readOnly />
          <Input label="Balance" type="number" name="balance" value={formValues.balance} onChange={handleInputChange} required readOnly />
          <Input label="Interest" type="number" name="interest" value={formValues.interest} onChange={handleInputChange} required />
        </>
      )}
      <Input label="Transaction Date" type="date" name="transactionDate" value={formValues.transactionDate} onChange={handleInputChange} required />
      <Input label="User" type="text" name="user" value={formValues.user} onChange={handleInputChange} required />
      <div className='col-span-2 flex '>
        <Button type="submit" >{editingDebt ? 'Update' : 'Save'}</Button>
      </div>

    </div>
  </form>
);

export default DebtForm;
