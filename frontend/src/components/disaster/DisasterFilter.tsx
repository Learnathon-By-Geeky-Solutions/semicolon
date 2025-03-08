import { useDisasterContext } from '../../providers/DisasterContextProvider';

const DisasterFilter = () => {
  const { availableTypes, filterType, setFilterType } = useDisasterContext();

  return (
    <div className="disaster-filter" style={{ padding: '10px', background: '#f8f9fa' }}>
      <label htmlFor="disasterType" style={{ marginRight: '10px' }}>
        Filter by Disaster Type:
      </label>
      <select 
        id="disasterType" 
        value={filterType} 
        onChange={(e) => setFilterType(e.target.value)}
        className="filter-select"
      >
        <option value="all">All</option>
        {availableTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

export default DisasterFilter;