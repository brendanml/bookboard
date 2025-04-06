const Exchanges = () => {
  return (
    <div className="flex flex-col items-center h-screen">
      {/* map 10 divs */}
      {Array.from({ length: 20 }, (_, index) => (
        <div
          key={index}
          className="flex flex-col items-center w-full h-16 border-b border-gray-300"
        >
          <h2 className="text-lg font-medium">Exchange {index + 1}</h2>
        </div>
      ))}
    </div>
  )
}
export default Exchanges
