import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { LineChartComponent } from './LineChartComponent';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function LineChart({ neodata }) {
  const [fastestAsteroidList, setFastestAsteroidList] = useState([]);
  const [closestAsteroidList, setClosestAsteroidList] = useState([]);
  const [averageSizeAsteroidList, setAverageSizeAsteroidList] = useState([]);

    const getFastestAsteroid = () => {
      if(!neodata) return null;
      let fastestAsteroid = null; 
      for (const d in neodata){
        const asteroids = neodata[d]
        asteroids.forEach(asteroid => {
          if(!fastestAsteroid || asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour > fastestAsteroid.close_approach_data[0].relative_velocity.kilometers_per_hour)
            fastestAsteroid = asteroid;
        });

        if(fastestAsteroid){
          fastestAsteroidList.push(fastestAsteroid.close_approach_data[0].relative_velocity.kilometers_per_hour);
          fastestAsteroid = null;
        }
      }
      setFastestAsteroidList(fastestAsteroidList);
    }
    const getClosestAsteroid = () => {
      if(!neodata) return null;
      let closestAsteroid = null; 
      for (const d in neodata){
        const asteroids = neodata[d];

        asteroids.forEach(asteroid => {
          if(!closestAsteroid || asteroid.close_approach_data[0].miss_distance.kilometers < closestAsteroid.close_approach_data[0].miss_distance.kilometers)
            closestAsteroid = asteroid;
        });
        if(closestAsteroid){
          closestAsteroidList.push(closestAsteroid.close_approach_data[0].miss_distance.kilometers);
          closestAsteroid = null;
        }
      }
      setClosestAsteroidList(closestAsteroidList)
    }
    const getAverageSize = () => {
      if(!neodata) return null; 
      let totalSize = 0, totalAsteroids = 0;
      for(const d in neodata){
        const asteroids = neodata[d];
        asteroids.forEach(asteroid => {
          totalSize += asteroid.estimated_diameter.kilometers.estimated_diameter_max;
          totalAsteroids++;
        })
        if(totalSize){
          averageSizeAsteroidList.push(totalSize / totalAsteroids);
          totalSize = 0
          totalAsteroids = 0;
        }
      }
      setAverageSizeAsteroidList(averageSizeAsteroidList)
    }
    const options = {
        responsive: true,
        height: 400,
        width: 400,
        plugins: {
          legend: {
            position: 'top',
          },
        },
    };
    useEffect(() => {
        getFastestAsteroid();
        getClosestAsteroid();
        getAverageSize();
      
    }, [neodata])
    if(neodata){
      var labels = Object.keys(neodata);
      var theData = []
      Object.keys(neodata).reduce((acc, key) => {
        theData.push(neodata[key]?.length ?? 0)
      }, {})

      const data = {
        labels,
        datasets: [
          {
            label: 'Number of Asteroid each day',
            data: theData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };
      const fastestData = {
        labels, 
        datasets: [
            {
              label: 'Fastest Asteroid',
              data: fastestAsteroidList,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ]
      }
      const closestData = {
        labels, 
        datasets: [
          {
            label: 'Closest Asteroid',
            data: closestAsteroidList,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ]
      }
      const averageSizeData = {
        labels, 
        datasets: [
          {
            label: 'Average Size of Asteroid',
            data: averageSizeAsteroidList,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          }
        ]
      }
      
      return (
        <div className='container-fluid'>
          <div className='row'>
            {fastestAsteroidList && fastestAsteroidList.length > 0 && (
            <h5>Fastest Asteroid in km/h: {Math.max(...fastestAsteroidList.map(Number))}</h5>)
            }
            {closestAsteroidList && closestAsteroidList.length > 0 && (
              <h5>Closest Asteroid: {Math.max(...closestAsteroidList.map(Number))}</h5>
            )}
            {averageSizeAsteroidList && averageSizeAsteroidList.length > 0 && (
              <h5>Average Size of the Asteroids in kilometers: {Math.max(...averageSizeAsteroidList.map(Number))}</h5>
            )}
          </div>
          <div className='row'>
            <LineChartComponent options={options} data={data} />
            <LineChartComponent options={options} data={fastestData} />
          </div>
          <div className='row'>
            <LineChartComponent options={options} data={closestData} />
            <LineChartComponent options={options} data={averageSizeData} />
          </div>
        </div>
      )
    } 
    else return <h1>Enter Valid Date</h1>;
}

export default LineChart;