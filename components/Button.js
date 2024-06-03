const Button = ({ onClick, children, type = 'button', className = 'bg-black text-white px-4 py-2 rounded shadow' }) => (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
  
  export default Button;
  