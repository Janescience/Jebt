const Card = ({ title, children }) => (
    <div className="bg-white md:p-5 p-2 rounded-md shadow-lg w-full h-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
  
  export default Card;
  