import Table from './Table';
import { FaRegEdit, FaRegTrashAlt, FaRegWindowClose } from 'react-icons/fa';

const DebtDetailsTable = ({ debts, onEdit, onDelete , onDeleteAll}) => {
  const headers = [
    'name',
    // 'type',
    // 'Detail',
    'amount',
    'period',
    'paid',
    // 'Balance',
    // 'interest',
    'transactionDate',
    // 'user'
  ];

  const data = debts.map((debt) => ({
    id : debt._id,
    name: debt.name,
    // type: debt.type == 'credit card' ? 'CC' : '',
    // Detail: debt.detail,
    amount: debt.amount,
    period: `${debt.currentPeriod}/${debt.allPeriod}`,
    paid: debt.paid.toFixed(2),
    // Balance: `$${debt.balance.toFixed(2)}`,
    interest: debt.interest,
    transactionDate: debt.transactionDate.split('T')[0],
    // user : debt.user,
    debt : debt
  }));

  const actions = [
    { label: '', icon: FaRegEdit ,onClick: onEdit, className: 'bg-black text-white rounded-md p-2 shadow mr-2' },
    { label: '', icon: FaRegTrashAlt ,onClick: onDelete, className: 'bg-black text-red-500 rounded-md p-2 shadow mr-2' },
    { label: '', icon: FaRegWindowClose ,onClick: onDeleteAll, className: 'bg-black text-red-500 rounded-md p-2 shadow' },
  ];

  return <Table headers={headers} data={data} actions={actions} />;
};

export default DebtDetailsTable;
