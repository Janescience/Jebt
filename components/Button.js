const Button = ({ onClick, children, type = 'button', className = 'bg-black text-white p-2 rounded-md shadow' }) => (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
  
  export default Button;
  