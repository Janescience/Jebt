const Button = ({ onClick, children, type = 'button', className}) => (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
  
  export default Button;
  