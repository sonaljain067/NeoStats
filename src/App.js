import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from 'react';
// import { LineChart } from './components/LineChart';

import React from 'react';
import './App.css';
import LineChart from './components/LineChart';

function App() {
  const [data, setData] = useState([]);
  const [startingdate, setStartingDate] = useState(new Date());
  const [endingdate, setEndingDate] = useState(new Date());
  const [isSDOpen, setIsSDOpen] = useState(false);
  const [isEDOpen, setIsEDOpen] = useState(false);

  let startingDate = startingdate.toLocaleDateString('en-GB').split('/').reverse().join('-');
  let endingDate = endingdate.toLocaleDateString('en-GB').split('/').reverse().join('-');

  useEffect (() => {
    var diffDays = endingdate.getDate() - startingdate.getDate(); 
    if(diffDays > 7){
      setEndingDate(startingdate)
    }
  }, endingDate)

  const handleSubmit = () => {
    fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startingDate}&end_date=${endingDate}&api_key=dE1d6Zasi9ThRhxNcbq1fU0mF2SryNiinTtHVz3o`)
    .then(response => response.json())
    .then(data => {
      setData(data["near_earth_objects"])
    });
  }
  const handleStartDateCalendar = (date) => {
    setStartingDate(date);
    setIsSDOpen(false);
  };
  const handleEndDateCalendar = (date) => {
    setEndingDate(date);
    setIsEDOpen(false);
  };
  const toggleSD = () => {
    setIsSDOpen(!isSDOpen)
  }
  const toggleED = () => {
    setIsEDOpen(!isEDOpen)
  }
  
  return (

    <div className="App">
      <h1 className='m-4'>NeoStats</h1>
      <div className='container'>
        <div className='m-3'>
          <button onClick={toggleSD} type="button/text" className='btn btn-primary m-3'>
          {isSDOpen ? 'Close calender' : 'Select Starting Date'}
          </button>
          <button onClick={toggleED} type="button/text" className='btn btn-primary'>
            {isEDOpen ? 'Close calender' : 'Select Ending Date'}
        </button>
        </div>
        <div className='row m-2'>
          <div className='col-lg-3'></div>
          <div className='col-lg-3'>{startingdate ? <h5>Starting Date: {startingDate}</h5> : ''}</div>
          <div className='col-lg-3'>{endingdate ? <h5>Ending Date: {endingDate}</h5> : ''}</div>
          <div className='col-lg-3'></div>
        </div>
        <div className='m-4'>
          <button onClick={handleSubmit} type="button" class="btn btn-primary">Submit</button>
        </div>

        <div className='row d-flex justify-content-center align-items-center'>
          {isSDOpen ? 
          <Calendar onChange={handleStartDateCalendar} value={startingdate}/>: ''}
          {isEDOpen ? <Calendar onChange={handleEndDateCalendar} value={endingdate}/> : ''}
        </div>
      
      </div>
      <h6>Note: Select Starting and Ending dates(upto 7 days interval)</h6>
      <p>[Single click on submit button for 1st chart while double click for all charts]</p>
      <LineChart neodata={data} />
      
    </div>
  );
}

export default App;
