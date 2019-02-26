import React from 'react';
import {Line} from 'react-chartjs-2';

const chart = props => {


    const data = {
        labels: props.time,
        datasets: [{
            label: '$',
            data: props.data,
            backgroundColor: [
                'rgba(178, 190, 232, 1)'
            ],
            borderColor: [
                'rgba(8,29,101,1)'
            ],
            borderWidth: 1,
            tension: 0,
        }]
    };

    const options = {
        onHover: function (event) {
            props.mouseEvent(event.type)
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: false,

            }],
            yAxes: [{
                display: false,
                ticks: {
                    beginAtZero: false,
                    stacked: true
                }
            }]
        },
        tooltips: {
            mode: 'nearest',
            intersect: false,
            custom: function (tooltip) {
                if (!tooltip) return;
                tooltip.displayColors = false;
            },
            callbacks: {
                label: function (tooltipItem) {
                    return props.dataMaker(tooltipItem) + ": $" + tooltipItem.yLabel;
                },
                title: function (tooltipItem, data) {
                    return;
                },

            }

        },




    };


    return (
        <Line data={data} options={options}/>
    )
};

export default chart;