import Table from './Table';

const DebtDetailsTable = ({ debts, onEdit, onDelete }) => {
  const headers = [
    'Name',
    'Type',
    // 'Detail',
    'Amount',
    'Period',
    'Paid',
    // 'Balance',
    'Interest',
    'TransactionDate',
  ];

  const data = debts.map((debt) => ({
    Id : debt._id,
    Name: debt.name,
    Type: debt.type == 'credit card' ? 'CC' : '',
    // Detail: debt.detail,
    Amount: debt.amount,
    Period: `${debt.currentPeriod}/${debt.allPeriod}`,
    Paid: debt.paid.toFixed(2),
    // Balance: `$${debt.balance.toFixed(2)}`,
    Interest: debt.interest,
    TransactionDate: debt.transactionDate.split('T')[0],
  }));

  const actions = [
    { label: 'Edit', onClick: onEdit, className: 'text-blue-500 mr-2' },
    { label: 'Delete', onClick: onDelete, className: 'text-red-500' },
  ];

  return <Table headers={headers} data={data} actions={actions} />;
};

export default DebtDetailsTable;
