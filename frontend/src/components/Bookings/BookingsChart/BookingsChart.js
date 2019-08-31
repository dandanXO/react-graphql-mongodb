import React from 'react';
import {Bar} from 'react-chartjs-2';

const BOOKINGS_BUCKETS = {
    'Cheap': {min:0,max:100},
    'Normal':  {min:101,max:200},
    'Expensive':  {min:201,max:100000},
}
const bookingsChart = props =>{
    let chartData = {labels:[],datasets:[]};
    let value = []
    for (const bucket in BOOKINGS_BUCKETS){
        const filteredBookings = props.boookings.reduce((prev, current) => {
            if(current.event.price >= BOOKINGS_BUCKETS[bucket].min && current.event.price <= BOOKINGS_BUCKETS[bucket].max){
                return prev + 1
            }else{
                return prev
            }
        },0)
        value.push(filteredBookings)
      
        chartData.labels.push(bucket)
        chartData.datasets.push({
          //  label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: value
        })
        value=[...value]
        value[value.length-1]=0
        console.log(chartData)
    }
    
    return <Bar data={chartData}></Bar>
}

export default bookingsChart