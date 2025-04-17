function chartSingleLine(chartId, data, label){
    const ctx = document.getElementById(chartId).getContext('2d');
    const oldChart = AppState.charts[chartId];

    if (oldChart){
        oldChart.destroy();
    }
    AppState.charts[chartId] = new Chart(ctx, {
        type: 'line',  
        data: {
            labels: datasets["times"],  
            datasets: [{
                label: label,  
                data: datasets[data],  
                borderColor: '#87CEEB', 
                fill: false,  
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',  
                    title: {
                        display: true,
                        text: 'Time'  
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: label
                    }
                }
            }
        }
    })
}

function chartDoubleLine(chartId, data1, data2, label1, label2, yaxis){
    const ctx = document.getElementById(chartId).getContext('2d');
    const oldChart = AppState.charts[chartId];

    if (oldChart){
        oldChart.destroy();
    }
    AppState.charts[chartId] = new Chart(ctx, {
        type: 'line',  
        data: {
            labels: datasets["times"],  
            datasets: [{
                label: label1,  
                data: datasets[data1],  
                borderColor: '#001f3d', 
                fill: false,  
            },
            {
                label: label2,  
                data: datasets[data2],  
                borderColor: '#87CEEB',  
                fill: false,  
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',  
                    title: {
                        display: true,
                        text: 'Time'  
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: yaxis
                    }
                }
            }
        }
    })
}



function chartBar(chartId, data, label){
    const ctx = document.getElementById(chartId).getContext('2d');
    const oldChart = AppState.charts[chartId];

    if (oldChart){
        oldChart.destroy();
    }
    AppState.charts[chartId] = new Chart(ctx, {
        type: 'bar',  
        data: {
            labels: datasets["times"],
            datasets: [{
                label: label,
                data: AppState.datasets[data],
                backgroundColor: '#001f3d',  
                borderColor: '#001f3d', 
                borderWidth: 2,
                hoverBackgroundColor: '#001f3d',  
                hoverBorderColor: 'rgba(255, 99, 132, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333', 
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',  
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    padding: 10
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Time',
                        color: '#444',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false  
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: label,
                        color: '#444',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.3)' 
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1  
                    }
                }
            }
        }
    })
}