import React from 'react';
import { Line } from 'react-chartjs-2';


export function LineChartComponent({ options, data }) {
      return (
        <div className='col-lg-6 ml-12 mt-5'>
            <Line options={options} data={data} />
        </div>
      )
}

export default LineChartComponent;