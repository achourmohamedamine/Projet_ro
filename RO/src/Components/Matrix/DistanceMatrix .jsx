import React, { useState, useEffect } from 'react';
import { Table, Input, Button } from 'reactstrap';
import './DistanceMatrix.css'

const DistanceMatrix = ({ cities = [], onSubmit }) => {
  const [distances, setDistances] = useState({});

  // Initialize or update distances when cities change
  useEffect(() => {
    const newDistances = {};
    cities.forEach((city1, i) => {
      cities.forEach((city2, j) => {
        if (i < j) {
          newDistances[`${city1}-${city2}`] = '';
        }
      });
    });
    setDistances(newDistances);
  }, [cities]);

  const handleDistanceChange = (city1, city2, value) => {
    setDistances(prev => ({
      ...prev,
      [`${city1}-${city2}`]: value
    }));
  };

  const handleSubmit = () => {
    // Convert the distances object to the desired JSON format
    const formattedDistances = {};
    Object.entries(distances).forEach(([key, value]) => {
      const [city1, city2] = key.split('-');
      formattedDistances[`${city1}_${city2}`] = Number(value);
    });
    // Send the distances back to the parent component
    onSubmit(formattedDistances);
  };

  if (cities.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="mb-3">Matrice des distances</h4>
      <div className="table-responsive">
        <Table bordered size="sm">
          <thead>
            <tr>
              <th></th>
              {cities.map(city => (
                <th key={city} className="text-center">{city}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cities.map((city1, i) => (
              <tr key={city1}>
                <th>{city1}</th>
                {cities.map((city2, j) => (
                  <td key={`${city1}-${city2}`} className="text-center">
                    {i < j ? (
                      <Input
                        type="number"
                        min="0"
                        value={distances[`${city1}-${city2}`]}
                        onChange={(e) => handleDistanceChange(city1, city2, e.target.value)}
                        className="text-center"
                        style={{ width: '80px', margin: '0 auto' }}
                      />
                    ) : i === j ? (
                      '0'
                    ) : (
                      distances[`${cities[j]}-${cities[i]}`] || '-'
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="text-center mt-3">
        <Button color="primary" onClick={handleSubmit}>
          Submit Distances
        </Button>
      </div>
    </div>
  );
};

export default DistanceMatrix;
