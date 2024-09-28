// src/components/DataDisplay.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataDisplay = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://<98->:5000/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Data from MongoDB</h1>
      <ul>
        {data.map(item => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataDisplay;

