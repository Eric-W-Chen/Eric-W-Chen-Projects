import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function MyChart({users}) {
    // console.log(users)
    let data = users.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)).map(el => new Date(el.timestamp).toLocaleDateString())
    // console.log(data)
    let obj = {}
    data.forEach(date => {
        if (obj[date] === undefined) {
            obj[date] = 1
        } else {
            obj[date] += 1
        }
    })
    // console.log(obj)
    
    
    const [options, setOptions] = useState({
        chart: {
            height: 380,
            type: "area",
            stacked: true,
            scroller: {
                enabled: true
            },
        },
        colors: ["#008FFB", "#00E396", "#CED4DC"],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: "smooth"
        },
        xaxis: {
            categories: Object.keys(obj),
            // min: 1,
            // max: 7,
            title: {
                text: 'Date',
                offsetX: 0,
                offsetY: 0,
                style: {
                    // color: undefined,
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    cssClass: 'apexcharts-xaxis-title',
                },
            },
        },
    });
    const [series, setSeries] = useState([
        {
            name: 'New Users',
            data: Object.values(obj)
        },
    ]);
    return (
        <div className='chart ml-3 mt-5'>
            <Chart options={options} series={series} type='line' />
        </div>
    );
}