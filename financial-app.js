const DCFCalculator = () => {
  // State for input values
  const [cashFlows, setCashFlows] = useState(['', '', '', '', '']);
  const [terminalGrowthRate, setTerminalGrowthRate] = useState(2);
  const [discountRate, setDiscountRate] = useState(10);
  const [currentDebt, setCurrentDebt] = useState(0);
  const [cashEquivalents, setCashEquivalents] = useState(0);
  const [result, setResult] = useState(null);

  // Handle cash flow input changes
  const handleCashFlowChange = (index, value) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index] = value;
    setCashFlows(newCashFlows);
  };

  // Calculate DCF and Enterprise Value
  const calculateDCF = () => {
    // Convert inputs to numbers
    const numericCashFlows = cashFlows.map(cf => parseFloat(cf) || 0);
    const wacc = discountRate / 100;
    const perpetualGrowth = terminalGrowthRate / 100;
    const debt = parseFloat(currentDebt) || 0;
    const cash = parseFloat(cashEquivalents) || 0;

    // Calculate present value of explicit forecast period
    let dcfValue = 0;
    numericCashFlows.forEach((cf, index) => {
      dcfValue += cf / Math.pow(1 + wacc, index + 1);
    });

    // Calculate terminal value using perpetuity growth model
    const lastYearCF = numericCashFlows[numericCashFlows.length - 1];
    const terminalValue = lastYearCF * (1 + perpetualGrowth) / (wacc - perpetualGrowth);
    
    // Discount terminal value to present
    const discountedTerminalValue = terminalValue / Math.pow(1 + wacc, numericCashFlows.length);
    
    // Calculate enterprise and equity value
    const enterpriseValue = dcfValue + discountedTerminalValue;
    const equityValue = enterpriseValue - debt + cash;
    
    setResult({
      dcfValue: dcfValue.toFixed(2),
      terminalValue: terminalValue.toFixed(2),
      discountedTerminalValue: discountedTerminalValue.toFixed(2),
      enterpriseValue: enterpriseValue.toFixed(2),
      equityValue: equityValue.toFixed(2)
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">DCF Enterprise Value Calculator</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Projected Free Cash Flows</h2>
        <div className="grid grid-cols-5 gap-2">
          {cashFlows.map((cf, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Year {index + 1}
              </label>
              <input
                type="number"
                value={cf}
                onChange={(e) => handleCashFlowChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Discount Rate (WACC) %
          </label>
          <input
            type="number"
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.1"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Weighted Average Cost of Capital
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Terminal Growth Rate %
          </label>
          <input
            type="number"
            value={terminalGrowthRate}
            onChange={(e) => setTerminalGrowthRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.1"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Expected long-term growth rate
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Outstanding Debt
          </label>
          <input
            type="number"
            value={currentDebt}
            onChange={(e) => setCurrentDebt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Cash & Equivalents
          </label>
          <input
            type="number"
            value={cashEquivalents}
            onChange={(e) => setCashEquivalents(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            min="0"
          />
        </div>
      </div>
      
      <button
        onClick={calculateDCF}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Calculate Enterprise Value
      </button>
      
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Results</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="text-sm text-gray-600">PV of Forecast Period:</div>
            <div className="text-sm font-medium">${result.dcfValue}</div>
            
            <div className="text-sm text-gray-600">Terminal Value:</div>
            <div className="text-sm font-medium">${result.terminalValue}</div>
            
            <div className="text-sm text-gray-600">PV of Terminal Value:</div>
            <div className="text-sm font-medium">${result.discountedTerminalValue}</div>
            
            <div className="text-sm text-gray-600 font-semibold">Enterprise Value:</div>
            <div className="text-sm font-bold">${result.enterpriseValue}</div>
            
            <div className="text-sm text-gray-600 font-semibold">Equity Value:</div>
            <div className="text-sm font-bold">${result.equityValue}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DCFCalculator;
