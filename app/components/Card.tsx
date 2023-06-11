const Card = ({ children, name, }: { children: React.ReactNode, name: string, }) => {
  return (
    <div className="p-6 mx-2 mb-6 bg-white rounded-lg shadow-md">
      { name && <h2 className="mb-4 text-xl font-semibold">{ name }</h2> }
      {children}
      {/*<h2 className="mb-4 text-xl font-semibold">Card Title</h2>*/}
      {/*<p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at quam turpis. Mauris consectetur ante id lectus convallis fringilla.</p>*/}
      {/*<button className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Learn More</button>*/}
    </div>
  );
};

export default Card;
