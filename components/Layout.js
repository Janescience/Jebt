import { useState } from 'react';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';


const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex ">
      <Sidebar show={showSidebar} setShow={setShowSidebar} />
      <div className="h-full w-full bg-gray-100 md:p-5 p-2">
        <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden mb-2 p-2 bg-black text-white rounded-md shadow-lg">
          <FaBars size={15} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Layout;