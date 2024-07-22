import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { useRouter } from 'next/router';

const Sidebar = ({ show, setShow }) => {
  const router = useRouter()
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, setShow]);

  const handleLinkClick = (path) => {
    router.push(path);
    setShow(false);
  };

  return (
    <div ref={sidebarRef} className={`fixed top-0 left-0 h-screen overflow-auto w-48 bg-black text-white p-5 transition-transform transform ${show ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
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
            <span onClick={() => handleLinkClick('/')} className="cursor-pointer">
              Summary
            </span>
          </li>
          <li className="flex items-center text-white">
            <span onClick={() => handleLinkClick('/credit-cards')} className="cursor-pointer">
              Credit Cards
            </span>
          </li>
          <li className="flex items-center text-white">
            <span onClick={() => handleLinkClick('/debts')} className="cursor-pointer">
              Debts
            </span>
          </li>
          <li className="flex items-center text-white">
            <span onClick={() => handleLinkClick('/regular')} className="cursor-pointer">
              Regular
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;