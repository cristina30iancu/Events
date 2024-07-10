import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Spinner } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { toast } from 'react-toastify';

const Statistics = () => {
  const [chartData, setChartData] = useState({});
  const [selectedOption, setSelectedOption] = useState('hall-occupancy');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData(selectedOption);
  }, [selectedOption]);

  const fetchChartData = async (option) => {
    setLoading(true);
    try {
      let response;
      if (option === 'hall-occupancy') {
        response = await axios.get('http://localhost:8080/statistics/hall-occupancy');
        const data = response.data;
        if (data && data.length) {
          setChartData({
            labels: data.map(item => item.name),
            datasets: [{
              label: 'Rezervări per salon',
              data: data.map(item => item.occupiedDays),
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1
            }]
          });
        } else {
          toast.error("Nu există date disponibile.");
        }
      } else if (option === 'restaurant-occupancy') {
        response = await axios.get('http://localhost:8080/statistics/restaurant-occupancy');
        const data = response.data;
        if (data && data.length) {
          setChartData({
            labels: data.map(item => item.name),
            datasets: [{
              label: 'Rezervări per restaurant',
              data: data.map(item => item.occupiedHalls),
              backgroundColor: 'rgba(153,102,255,0.4)',
              borderColor: 'rgba(153,102,255,1)',
              borderWidth: 1
            }]
          });
        } else {
          toast.error("Nu există date disponibile.");
        }
      } else if (option === 'monthly-occupancy') {
        response = await axios.get('http://localhost:8080/statistics/monthly-occupancy');
        const data = response.data;
        if (data && data.length) {
          setChartData({
            labels: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
            datasets: [{
              label: 'Rezervări per lună',
              data: data,
              backgroundColor: 'rgba(255,159,64,0.4)',
              borderColor: 'rgba(255,159,64,1)',
              borderWidth: 1
            }]
          });
        } else {
          toast.error("Nu există date disponibile.");
        }
      }
    } catch (error) {
      toast.error('Eroare la preluarea datelor.');
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='card p-5'>
      <h2>Statistici</h2>
      <Form.Group controlId="statisticSelect" className="mb-4">
        <Form.Label>Selectează tipul de statistică</Form.Label>
        <Form.Control as="select" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="hall-occupancy">Grad de ocupare per salon</option>
          <option value="restaurant-occupancy">Grad de ocupare per restaurant</option>
          <option value="monthly-occupancy">Grad de ocupare per lună</option>
        </Form.Control>
      </Form.Group>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          {selectedOption === 'hall-occupancy' && chartData.labels && <Bar data={chartData} />}
          {selectedOption === 'restaurant-occupancy' && chartData.labels && <Bar data={chartData} />}
          {selectedOption === 'monthly-occupancy' && chartData.labels && <Line data={chartData} />}
        </>
      )}
    </Container>
  );
};

export default Statistics;
