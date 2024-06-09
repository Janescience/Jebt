import Table from './Table';
import { FaRegEdit, FaRegTrashAlt, FaTrash } from 'react-icons/fa';

const DebtDetailsTable = ({ debts, onEdit, onDelete , onDeleteAll}) => {
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
    { label: '', icon: FaRegEdit ,onClick: onEdit, className: 'mr-5' },
    { label: '', icon: FaRegTrashAlt ,onClick: onDelete, className: 'mr-5' },
    { label: '', icon: FaTrash ,onClick: onDeleteAll, className: '' },
  ];

  return <Table headers={headers} data={data} actions={actions} />;
};

export default DebtDetailsTable;
