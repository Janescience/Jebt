import Card from "@/components/Card";
import { useEffect,useState } from "react";

export default function Home() {
  const [debtDetails, setDebtDetails] = useState([]);
  const [regulars, setRegulars] = useState([]);
  const [debtFinish, setDebtFinish] = useState([]);
  const [groupCreditCard,setGroupCreditCard] = useState({})
  const [groupName,setGroupName] = useState({})
  const [sumDebtFinish,setSumDebtFinish] = useState(0)

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
    groupDebtsByCreditCard()
    filterPaidFinished()
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

  const groupDebtsByCreditCard = () => {
    const groups = {};
    let sum = 0;

    if(debtDetails && debtDetails.length > 0){
      debtDetails.map((debt) => {
        const creditCard = debt.creditCard ? debt.creditCard.name : 'No Credit Card';
    
        if (!groups[creditCard]) {
          groups[creditCard] = { sum: 0 };
        }
  
        groups[creditCard].sum += debt.paid;
        sum += debt.paid
  
      });
    }
    
    setGroupCreditCard(groups)
    setSumGroupCredit(sum)
  };

  const filterPaidFinished = () => {
    const debts = []
    let sum = 0;
    debtDetails.map((debt) => {
      if(debt.currentPeriod == debt.allPeriod){
        sum += debt.paid
        debts.push(debt)
      }
    })
    setDebtFinish(debts)
    setSumDebtFinish(sum)
  }

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
        <h1 className="text-xl font-bold mb-3 ">Dashboard</h1>
          <div className="grid grid-cols-2 gap-3 mb-3  bg-black  rounded-md ">
            <div className="p-1 text-white">{formatMonth()} {year}</div>
            <div className="flex text-sm justify-end p-2">
              <div className="text-end text-rose-500 ">+ {(sumGroupCredit + sumGroupName).toFixed(2)} </div>
              <div className="text-end text-lime-500 ">- {(sumDebtFinish).toFixed(2)} </div>
            </div>
          </div>
          <div className="rounded-md shadow text-sm bg-gray-200 p-1 mb-3">
            <h2 className="bg-gray-800 text-white rounded-md p-1 mb-1">Credit card summary</h2>
            {Object.keys(groupCreditCard).map((key) => (
              <div key={key} className="p-1 flex justify-between text-xs border border-gray-300">
                <div>{key}</div> 
                <div>{groupCreditCard[key].sum.toFixed(2)}</div>
              </div>
            ))}
            <div className="flex p-1 justify-between font-bold ">
              <div>Total</div>
              <div className="underline decoration-2">{sumGroupCredit.toFixed(2)}</div>
            </div>
          </div>
          <div className="rounded-md shadow text-sm bg-gray-200 p-1 mb-3">
            <h2 className="bg-gray-800 text-white rounded-md p-1 mb-1">Credit card paid finished</h2>
            {debtFinish.map((debt) => (
              <div key={debt._id} className="text-xs grid p-1 md:grid-cols-7 grid-cols-4 grid-flow-row-dense gap-1 border border-gray-300">
                <div className="col-span-2">{debt.name}</div> 
                <div className="col-span-2 hidden md:block">{debt.creditCard.name}</div> 
                <div className="text-end hidden md:block">{debt.currentPeriod}/{debt.allPeriod}</div> 
                <div className="text-center">{debt.user}</div>
                <div className="text-end">{debt.paid.toFixed(2)}</div>
              </div>
            ))}
            <div className="p-1 flex justify-between font-bold ">
              <div>Total</div> 
              <div className="underline decoration-2">{sumDebtFinish.toFixed(2)}</div>
            </div>
          </div>
          <div className="rounded-md shadow text-sm bg-gray-200 p-1">
            <h2 className="bg-gray-800 text-white rounded-md p-1 mb-1">Regular expense summary</h2>
            {Object.keys(groupName).map((key) => (
              <div key={key} className=" text-xs p-1 flex justify-between border border-gray-300">
                <div>{key}</div> 
                <div>{groupName[key].sum.toFixed(2)}</div>
              </div>
            ))}
            <div className="p-1 flex justify-between font-bold">
              <div>Total</div>
              <div className="underline decoration-2">{sumGroupName.toFixed(2)}</div>
            </div>
          </div>
          
      </Card>
      
    </div>
  );
}