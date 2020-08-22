import React from 'react';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import DiagnosisKeys from './features/diagnosisKeys'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Container>
      <Navbar bg="light">
        <Navbar.Brand>Corona Exposure Notification Log Analysis</Navbar.Brand>
      </Navbar>
      <DiagnosisKeys />
    </Container>
  );
}

export default App;
