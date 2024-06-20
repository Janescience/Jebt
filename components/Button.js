const Button = ({ onClick, children, type = 'button', className = 'w-full h-10 items-center h-screen justify-center bg-black text-white p-2 rounded-md shadow' }) => (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
  
  export default Button;
  