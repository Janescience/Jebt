import Link from 'next/link';
import { FaCreditCard, FaMoneyBillWave, FaChartPie, FaBars } from 'react-icons/fa';

const Sidebar = ({ show, setShow }) => {
  return (
    <div className={`fixed top-0 left-0 h-screen w-48 bg-black text-white p-5 transition-transform transform ${show ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl">Jebt</h1>
        <button onClick={() => setShow(!show)} className="md:hidden">
          <FaBars size={24} />
        </button>
      </div>
      <nav>
        <ul className="space-y-4">
          <li className="flex items-center text-white">
            <Link href="/credit-cards">
              Credit Cards
            </Link>
          </li>
          <li className="flex items-center text-white">
            <Link href="/debts">
              Debts
            </Link>
          </li>
          <li className="flex items-center text-white">
            <Link href="/summary">
              Summary
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;