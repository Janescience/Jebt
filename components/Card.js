const Card = ({ title, children }) => (
    <div className="bg-white p-5 rounded shadow w-full h-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
  
  export default Card;
  