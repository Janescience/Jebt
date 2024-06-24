import Card from "@/components/Card";
import { useEffect,useState } from "react";

export default function Home() {
  const [debtDetails, setDebtDetails] = useState([]);
  const [regulars, setRegulars] = useState([]);
  const [groupCreditCard,setGroupCreditCard] = useState({})
  const [groupName,setGroupName] = useState({})
  const [sumGroupName,setSumGroupName] = useState(0)
  const [sumGroupCredit,setSumGroupCredit] = useState(0)
  const [loading, setLoading] = useState(true);
  const [month,setMonth] = useState(new Date().getMonth()+1)
  const [year,setYear] = useState(new Date().getFullYear())

  useEffect(()=>{
    fetchDebtDetails(year,month)
    fetchRegular() 
  },[])

  useEffect(() => {
    groupDebtsByCreditCard(debtDetails)
  },[debtDetails])

  useEffect(() => {
    groupRegularByName(regulars)
  },[regulars])

  const fetchDebtDetails = async (year, month) => {
    setLoading(true);
    const res = await fetch(`/api/debts/monthly/${year}/${month}`);
    const data = await res.json();
    setDebtDetails(data.data);
    setLoading(false);
  };

  const fetchRegular = async () => {
    setLoading(true);
    const res = await fetch(`/api/regular`);
    const data = await res.json();
    setRegulars(data.data);
    setLoading(false);
  };

  const groupDebtsByCreditCard = (details) => {
    const groups = {};
    let sum = 0;

    details.forEach((debt) => {
      const creditCard = debt.creditCard ? debt.creditCard.name : 'No Credit Card';
  
      if (!groups[creditCard]) {
        groups[creditCard] = { sum: 0 };
      }

      groups[creditCard].sum += debt.paid;
      sum += debt.paid

    });
    setGroupCreditCard(groups)
    setSumGroupCredit(sum)
  };

  const groupRegularByName = (regulars) => {
    const groups = {};
    let sum = 0;
  
    regulars.forEach((reg) => {
      const name = reg.name ;
  
      if (!groups[name]) {
        groups[name] = { sum: 0 };
      }

      groups[name].sum += reg.amount;
      sum += reg.amount

    });
    setGroupName(groups)
    setSumGroupName(sum)
  }

  const formatMonth = () => {
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', {month: 'long' });
  };

  return (
    <div>
      <Card>
        <h1 className="text-2xl font-bold mb-3 ">Dashboard</h1>
          <div className="grid grid-cols-2 gap-3 mb-3 text-lg bg-gray-800 text-white font-bold rounded-md ">
            <div className="p-2">{formatMonth()} {year}</div>
            <div className="text-end p-2">{(sumGroupCredit + sumGroupName).toFixed(2)} </div>
          </div>
          <div className="rounded-md shadow bg-gray-200 p-1 mb-3">
            <h2 className="font-bold">Credit Cards Summary</h2>
            {Object.keys(groupCreditCard).map((key) => (
              <div key={key} className="p-1 flex justify-between">
                <div>{key}</div> 
                <div>{groupCreditCard[key].sum.toFixed(2)}</div>
              </div>
            ))}
            <div className="p-1 flex justify-between font-bold ">
              <div>Sum</div>
              <div className="underline decoration-2">{sumGroupCredit.toFixed(2)}</div>
            </div>
          </div>
          <div className="rounded-md shadow bg-gray-200 p-1">
            <h2 className="font-bold">Regular Expense Summary</h2>
            {Object.keys(groupName).map((key) => (
              <div key={key} className="p-1 flex justify-between">
                <div>{key}</div> 
                <div>{groupName[key].sum.toFixed(2)}</div>
              </div>
            ))}
            <div className="p-1 flex justify-between font-bold">
              <div>Sum</div>
              <div className="underline decoration-2">{sumGroupName.toFixed(2)}</div>
            </div>
          </div>
          
      </Card>
      
    </div>
  );
}