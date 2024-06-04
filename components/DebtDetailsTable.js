import Table from './Table';

const DebtDetailsTable = ({ debts, onEdit, onDelete }) => {
  const headers = [
    'name',
    'type',
    // 'Detail',
    'amount',
    'period',
    'paid',
    // 'Balance',
    'interest',
    'transactionDate',
    'user'
  ];

  const data = debts.map((debt) => ({
    id : debt._id,
    name: debt.name,
    type: debt.type == 'credit card' ? 'CC' : '',
    // Detail: debt.detail,
    amount: debt.amount,
    period: `${debt.currentPeriod}/${debt.allPeriod}`,
    paid: debt.paid.toFixed(2),
    // Balance: `$${debt.balance.toFixed(2)}`,
    interest: debt.interest,
    transactionDate: debt.transactionDate.split('T')[0],
    user : debt.user,
    debt : debt
  }));

  const actions = [
    { label: 'Edit', onClick: onEdit, className: 'text-blue-500 mr-2' },
    { label: 'Delete', onClick: onDelete, className: 'text-red-500' },
  ];

  return <Table headers={headers} data={data} actions={actions} />;
};

export default DebtDetailsTable;
