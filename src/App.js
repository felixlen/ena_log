import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import DiagnosisKeys from './features/diagnosisKeys'
import Info from './features/info'
import { resetENA } from './features/diagnosisKeysSlice'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const dispatch = useDispatch()

  const enastatus = useSelector(state => state.diagnosisKeys.enastatus)

  const [naviState, setNaviState] = useState({
    'home': true,
    'info': false
  })

  const activateNaviItem = item => {
    setNaviState(s => (Object.entries(s).reduce((acc, cur) => ({...acc, [cur[0]]: cur[0]===item}), {})))
  }

  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>CWA Begegnungsüberprüfungen</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => activateNaviItem('home')}>Home</Nav.Link>
            <Nav.Link onClick={() => activateNaviItem('info')}>Information</Nav.Link>
            { enastatus !== 'uninitialized' && <Nav.Link onClick={() => dispatch(resetENA())}>Zurücksetzen</Nav.Link> }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      { naviState.home && <DiagnosisKeys /> }
      { naviState.info && <Info /> }
    </Container>
  );
}

export default App;
