const Categories = () => {
    const categories = ["Electronics", "Fashion", "Home", "Toys", "Beauty"];
  
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-md text-center">
              {category}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Categories;
  