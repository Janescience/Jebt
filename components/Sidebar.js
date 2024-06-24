import Link from 'next/link';
import { FaCreditCard, FaMoneyBill, FaChartPie, FaBars } from 'react-icons/fa';
import { useRouter } from 'next/router';

const Sidebar = ({ show, setShow }) => {
  const router = useRouter()
  return (
    <div className={`fixed top-0 left-0 h-screen overflow-y-auto w-48 bg-black text-white p-5 transition-position transition-transform transform ${show ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
      <div className="flex justify-between mb-5">
        <div className="flex justify-start  cursor-pointer" onClick={() => router.push("/")}>
            <img src="/icon-192x192.png" alt="logo" className="w-8 mr-2"/>
            <h1 className="text-2xl mr-2">Jebt</h1>
        </div>
        <button onClick={() => setShow(!show)} className="md:hidden">
          <FaBars size={20} />
        </button>
      </div>
      <nav>
        <ul className="space-y-4">
          <li className="flex items-center text-white">
            <Link href="/credit-cards">
              Credit Cards
            </Link>
          </li>
          <li className="flex items-center  text-white">
            <Link href="/debts">
              Debts
            </Link>
          </li>
          <li className="flex items-center text-white">
            <Link href="/regular">
              Regular
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;