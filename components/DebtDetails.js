import React from 'react';
import DebtDetailsTable from './DebtDetailsTable';
const DebtDetails = ({ sums, debtSorted,handleMonthClick, selectedMonth, currentYear, currentMonth, formatMonthYear, groupedDebts, toggleGroup, expandedGroups, handleEditClick, deleteDebt }) => (
    <ul>
        {debtSorted.map((key) => {
            const [year, month] = key.split('-');
            const isCurrentMonth = currentYear === parseInt(year) && currentMonth === parseInt(month);
            return (
                <div key={key}>
                    <li
                        className={`mb-2 p-2 text-lg border rounded shadow cursor-pointer ${isCurrentMonth ? 'bg-slate-200 font-bold' : ''}`}
                        onClick={() => handleMonthClick(year, month)}
                    >
                        <div className="flex justify-between">
                            <span>{formatMonthYear(key)}</span>
                            <span>${sums[key].toFixed(2)}</span>
                        </div>
                    </li>
                    {selectedMonth === `${year}-${month}` && (
                        <div className="p-2 mb-2 bg-gray-100">
                            <h3 className="ml-2 font-bold mb-2">Details for {formatMonthYear(selectedMonth)}</h3>
                            {Object.keys(groupedDebts).map((user) => (
                                <div key={user} className="mb-4">
                                    <div className="ml-2 p-2 mb-2 bg-white border rounded flex justify-between shadow cursor-pointer" onClick={() => toggleGroup(user)}>
                                        <span>{user}</span>
                                        <span>${groupedDebts[user].sum.toFixed(2)}</span>
                                    </div>
                                    {expandedGroups[user] && (
                                        <div className="ml-4">
                                            {Object.keys(groupedDebts[user].creditCards).map((creditCard) => (
                                                <div key={creditCard} className="mb-2">
                                                <div className="p-2 border mb-2 bg-white flex justify-between rounded shadow cursor-pointer" onClick={() => toggleGroup(`${user}-${creditCard}`)}>
                                                    <span>{creditCard}</span>
                                                    <span>${groupedDebts[user].creditCards[creditCard].sum.toFixed(2)}</span>
                                                </div>
                                                    {expandedGroups[`${user}-${creditCard}`] && (
                                                        <div className="ml-4">
                                                        {Object.keys(groupedDebts[user].creditCards[creditCard].flags).map((flag) => (
                                                            <div key={flag} className="mb-2">
                                                                <div className="p-2 border bg-white flex justify-between rounded shadow cursor-pointer" onClick={() => toggleGroup(`${user}-${creditCard}-${flag}`)}>
                                                                    <span>{flag}</span>
                                                                    <span>${groupedDebts[user].creditCards[creditCard].flags[flag].sum.toFixed(2)}</span>
                                                                </div>
                                                                {expandedGroups[`${user}-${creditCard}-${flag}`] && (
                                                                    <DebtDetailsTable
                                                                    debts={groupedDebts[user].creditCards[creditCard].flags[flag].debts}
                                                                    onEdit={handleEditClick}
                                                                    onDelete={deleteDebt}
                                                                    />
                                                                )}
                                                            </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}   
                        </div>
                    )}  
                </div>
            )
        })}
    </ul>
);

export default DebtDetails;
