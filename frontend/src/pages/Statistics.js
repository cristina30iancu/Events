import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Row, Spinner, Button } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'chart.js/auto';
import { toast } from 'react-toastify';

const formatDate = (date) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      weekday: 'long'
    };
  
    const formattedDate = new Date(date).toLocaleDateString('en-UK', options);
    return formattedDate.replace(/\//g, '.');
  };
  

const Statistics = () => {
  const [chartData, setChartData] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [clients, setClients] = useState([]);
  const [selectedOption, setSelectedOption] = useState('hall-occupancy');
  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(true);

  useEffect(() => {
    fetchChartData(selectedOption);
    fetchRevenueData();
    fetchClients();
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

  const fetchRevenueData = async () => {
    setRevenueLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/statistics/monthly-revenue');
      const data = response.data;
      if (data && data.length) {
        setRevenueData({
          labels: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
          datasets: [{
            label: 'Încasări per lună',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        });
      } else {
        toast.error("Nu există date disponibile pentru încasări.");
      }
    } catch (error) {
      toast.error('Eroare la preluarea datelor pentru încasări.');
      console.error('Error fetching revenue data:', error);
    } finally {
      setRevenueLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/statistics/clients');
      const data = response.data;
      setClients(data);
      console.log(data)
    } catch (error) {
      toast.error('Eroare la preluarea datelor despre clienți.');
      console.error('Error fetching clients data:', error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nume", "Email", "Telefon", "Eveniment", "Data eveniment", "Status"];
    const tableRows = [];

    clients.forEach(client => {
      client.Reservations.forEach(reservation => {
        const reservationData = [
          client.name,
          client.email,
          client.phone,
          reservation.eventName,
          formatDate(reservation.eventDate).replace("ș","s").replace("ț", "t").replace("ă", "a").replace("â", "a").replace("î","i"),
          reservation.status.replace("ș","s").replace("ț", "t").replace("ă", "a").replace("â", "a").replace("î","i")
        ];
        tableRows.push(reservationData);
      });
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Lista clientilor si rezervarile lor", 14, 15);
    doc.save("lista_clientilor.pdf");
  };

  return (
    <Container className='card p-5'>
      <Row>
        <div className='col-6'>
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
        </div>
        <div className='col-6'>
          <h3 className='mt-5'>Încasări per lună</h3>
          {revenueLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <Line data={revenueData} />
          )}
        </div>
      </Row>
      <Button variant="primary" onClick={exportPDF} className="mt-4">Exportă lista clienților în PDF</Button>
    </Container>
  );
};

export default Statistics;
