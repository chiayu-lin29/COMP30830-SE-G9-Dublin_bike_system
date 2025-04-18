/**
 * A module for rendering chart visualizations using Chart.js.
 * Provides utility functions for rendering single-line, double-line, and bar charts.
 * @module Chart
 * @example
 * // Draw a line chart for temperature
 * chartSingleLine("weatherChart", "temperatures", "Temperature °C");
 *
 * // Draw a dual line chart for temperature and feels like
 * chartDoubleLine("weatherChart", "temperatures", "feelsLike", "Temperature", "Feels Like", "°C");
 *
 * // Draw a bar chart for wind speed
 * chartBar("windChart", "windSpeeds", "Wind Speed (m/s)");
 */


/**
 * Creates and renders a single-line chart.
 * @function
 * @param {string} chartId - The ID of the canvas element for the chart.
 * @param {string} data - The key in AppState.datasets to use as the data source.
 * @param {string} label - The label for the dataset (shown in the legend and Y-axis).
 */
function chartSingleLine(chartId, data, label) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const oldChart = AppState.charts[chartId];

    if (oldChart) {
        oldChart.destroy();
    }

    AppState.charts[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datasets["times"],
            datasets: [{
                label: label,
                data: AppState.datasets[data],
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
    });
}


/**
 * Creates and renders a double-line chart.
 * Useful for comparing two data series over time (e.g., temperature vs. feels like).
 * @function
 * @param {string} chartId - The ID of the canvas element for the chart.
 * @param {string} data1 - The first dataset key in AppState.datasets.
 * @param {string} data2 - The second dataset key in AppState.datasets.
 * @param {string} label1 - The label for the first dataset.
 * @param {string} label2 - The label for the second dataset.
 * @param {string} yaxis - The title for the Y-axis.
 */
function chartDoubleLine(chartId, data1, data2, label1, label2, yaxis) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const oldChart = AppState.charts[chartId];

    if (oldChart) {
        oldChart.destroy();
    }

    AppState.charts[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datasets["times"],
            datasets: [
                {
                    label: label1,
                    data: AppState.datasets[data1],
                    borderColor: '#001f3d',
                    fill: false,
                },
                {
                    label: label2,
                    data: datasets[data2],
                    borderColor: '#87CEEB',
                    fill: false,
                }
            ]
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
    });
}


/**
 * Creates and renders a bar chart.
 * Suitable for visualizing categorical or discrete values over time (e.g., wind speeds).
 * @function
 * @param {string} chartId - The ID of the canvas element for the chart.
 * @param {string} data - The dataset key in AppState.datasets.
 * @param {string} label - The label for the dataset and Y-axis title.
 */
function chartBar(chartId, data, label) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const oldChart = AppState.charts[chartId];

    if (oldChart) {
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
    });
}
