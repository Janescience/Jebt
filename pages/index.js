import Card from "@/components/Card";
import UserAvatar from "@/components/UserAvatar";
import { useEffect,useState } from "react";
import Loading from '@/components/Loading';


export default function Home() {
  const [debtDetails, setDebtDetails] = useState([]);
  const [regulars, setRegulars] = useState([]);
  const [debtFinish, setDebtFinish] = useState([]);
  const [groupCreditCard,setGroupCreditCard] = useState({})
  const [groupName,setGroupName] = useState({})
  const [groupDebtFinish,setGroupDebtFinish] = useState({})
  const [sumDebtFinish,setSumDebtFinish] = useState(0)

  const [sumGroupName,setSumGroupName] = useState(0)
  const [sumGroupCredit,setSumGroupCredit] = useState(0)
  const [loading2, setLoading2] = useState(true);
  const [month,setMonth] = useState(new Date().getMonth()+1)
  const [year,setYear] = useState(new Date().getFullYear())
  const [loading1,setLoading1] = useState(true)
  const [loading3,setLoading3] = useState(true)

  useEffect(()=>{
    fetchDebtDetails(new Date().getFullYear(),new Date().getMonth()+1)
    fetchRegular() 
  },[])

  useEffect(() => {
    groupDebtsByCreditCard()
    filterPaidFinished()
  },[debtDetails])

  useEffect(() => {
    groupDebtFinishByUser()
  },[debtFinish])

  useEffect(() => {
    groupRegularByName()
  },[regulars])

  const fetchDebtDetails = async (year, month) => {
    setLoading1(true);
    const res = await fetch(`/api/debts/monthly/${year}/${month}`);
    const data = await res.json();
    setDebtDetails(data.data);
    setLoading1(false);
  };

  const fetchRegular = async () => {
    setLoading3(true);
    const res = await fetch(`/api/regular`);
    const data = await res.json();
    setRegulars(data.data);
    setLoading3(false);
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
    setLoading2(true);

    const debts = []
    let sum = 0;
    if(debtDetails && debtDetails.length > 0){
      debtDetails.map((debt) => {
        if(debt.currentPeriod == debt.allPeriod){
          sum += debt.paid
          debts.push(debt)
        }
      })
    }
    setDebtFinish(debts)
    setSumDebtFinish(sum)
    setLoading2(false);


  }

  const groupRegularByName = () => {
    const groups = {};
    let sum = 0;
  
    if(regulars && regulars.length > 0){
      regulars.forEach((reg) => {
        const name = reg.name ;
    
        if (!groups[name]) {
          groups[name] = { sum: 0 };
        }

        groups[name].sum += reg.amount;
        sum += reg.amount

      });
    }
    setGroupName(groups)
    setSumGroupName(sum)
  }

  const groupDebtFinishByUser = () => {
    const groups = {};
  
    debtFinish.forEach((debt) => {
      const user = debt.user ? debt.user : 'No User';  // Assuming debt has a user field
      const creditCard = debt.creditCard ? debt.creditCard.name : 'Cash';
  
      if (!groups[user]) {
        groups[user] = { sum: 0, creditCards: {} };
      }
      if (!groups[user].creditCards[creditCard]) {
        groups[user].creditCards[creditCard] = { sum: 0 , debts: []};
      }
  
      groups[user].sum += debt.paid;
      groups[user].creditCards[creditCard].sum += debt.paid;
      groups[user].creditCards[creditCard].debts.push(debt);
    });
    
    setGroupDebtFinish(groups)
  }

  const formatMonth = () => {
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', {month: 'long' });
  };

  return (
    <div>
      <Card>
        <h1 className="text-2xl font-bold mb-1">Summary</h1>
          <div className="grid md:grid-cols-2 grid-cols-1 ">
            <div className="p-2">{formatMonth()} {year}</div>
            <div className="flex text-sm justify-end p-2">
              <div className="">
                Debt <span className="underline decoration-2 font-bold">{(sumGroupCredit + sumGroupName).toFixed(2)}</span> / 
                Reduce <span className="underline decoration-2 font-bold">{(sumDebtFinish).toFixed(2)}</span>  
              </div>
            </div>
          </div>
          <div className="rounded-md shadow text-sm bg-gray-200 p-1 mb-3">
          {loading2 ? (
            <Loading />
          ) : (
              <div>
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
          )}
          </div>
          <div className="rounded-md shadow text-sm bg-gray-200 p-1 mb-3">
          {loading2 ? (
            <Loading />
          ) : (
              <div>
            <h2 className="bg-gray-800 text-white rounded-md p-1 mb-1">Credit card paid finished</h2>
            {Object.keys(groupDebtFinish).map((user) => (
                <div key={user} className="mb-1 text-xs">
                    <div className=" p-1 mb-1 font-bold border  flex justify-between " onClick={() => toggleGroup(user)}>
                        <span>
                        <UserAvatar  
                            username={user} 
                            avatar={'https://api.dicebear.com/7.x/avataaars/svg?seed='+user}
                            className=""
                        />
                        {user}
                        </span>
                        <span>{groupDebtFinish[user].sum.toFixed(2)}</span>
                    </div>
                    <div className="">
                        {Object.keys(groupDebtFinish[user].creditCards).map((creditCard) => (
                            <div key={creditCard} className="mb-2">
                              <div className="p-1 border mb-2 underline font-bold flex justify-between " onClick={() => toggleGroup(`${user}-${creditCard}`)}>
                                  <span>{creditCard}</span>
                                  <span>{groupDebtFinish[user].creditCards[creditCard].sum.toFixed(2)}</span>
                              </div>
                              <div className="ml-2 ">
                                {groupDebtFinish[user].creditCards[creditCard].debts.map((debt) => (
                                  
                                  <div key={debt._id} className="text-xs grid p-1 grid-cols-4 grid-flow-row-dense gap-1 border border-gray-300">
                                    <div className="col-span-2">{debt.name}</div> 
                                    {/* <div className="col-span-2 hidden md:block">{debt.creditCard.name}</div>  */}
                                    <div className="text-end">{debt.currentPeriod}/{debt.allPeriod}</div> 
                                    {/* <div className="text-center">{debt.user}</div> */}
                                    <div className="text-end">{debt.paid.toFixed(2)}</div>
                                  </div>
                              
                                ))}
                              </div>
                                
                            </div>
                        ))}
                    </div>
                    
                </div>
            ))}
            {/* {debtFinish.map((debt) => (
              <div key={debt._id} className="text-xs grid p-1 md:grid-cols-7 grid-cols-4 grid-flow-row-dense gap-1 border border-gray-300">
                <div className="col-span-2">{debt.name}</div> 
                <div className="col-span-2 hidden md:block">{debt.creditCard.name}</div> 
                <div className="text-end hidden md:block">{debt.currentPeriod}/{debt.allPeriod}</div> 
                <div className="text-center">{debt.user}</div>
                <div className="text-end">{debt.paid.toFixed(2)}</div>
              </div>
            ))} */}
            <div className="p-1 flex justify-between font-bold ">
              <div>Total</div> 
              <div className="underline decoration-2">{sumDebtFinish.toFixed(2)}</div>
            </div>
            </div>
          )}
          </div>
          <div className="rounded-md shadow text-sm bg-gray-200 p-1">
          {loading3 ? (
            <Loading />
          ) : (
              <div>
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
          )}
          </div>
          
      </Card>
      
    </div>
  );
}