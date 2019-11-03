
const myChart = document.getElementById('myChartOn').getContext('2d');

let immigration_years = new Chart (myChart, {
    type:'bar',
    data:{
        labels:['United States', 'Germany', 'Saudi Arabia', 'United Kingdom', 'Australia', 'Canada', 'Switzerland', 'Portugal', 'Belgium',
        'Austria', 'Brazil', 'Poland', 'Latvia', 'Bolivia', 'Angola', 'Monaco', 'Gibraltar', 'British Virgin Islands', 'Anguilla', 'San Marino', 'Chile',
        'Mexico', 'Belarus', 'Philippines', 'India', 'China'],
        datasets:[{
            label: 'Immigrants',
            data:[
                14.3,
                14.9,
                31.4,
                13.2,
                19.93,
                21.9,
                28.9,
                7.5,
                12.9,
                15.2,
                0.9,
                1.6,
                13.8,
                1.4,
                0.4,
                64.2,
                33.3,
                32.3,
                45.6,
                15.4,
                5.5,
                0.9,
                11.6,
                5.01,
                0.5,
                0.2944
            ],
            backgroundColor:[
                'rgba(51,153,204,0.8)',
                'rgba(51,102,255,0.8)',
                'rgba(255,204,0,0.8)',
                'rgba(0,102,51,0.8)',
                'rgba(102,51,0,0.8)',
                'rgba(0,0,0,0.8)',
                'rgba(102,255,255,0.8)',
                'rgba(204,255,204,0.8)',
                'rgba(102,0,255,0.8)',
                'rgba(153,51,51,0.8)',
                'rgba(0,51,204,0.8)',
                'rgba(255,0,0,0.8)',
                'rgba(255,0,204,0.8)',
                'rgba(204,204,0,0.8)',
                'rgba(152,204,0,0.8)',
                'rgba(130,244,0,0.8)',
                'rgba(203,100,0,0.8)',
                'rgba(203,10,0,0.8)',
                'rgba(30,210,0,0.8)',
                'rgba(10,40,0,0.8)',
                'rgba(40,120,0,0.8)',
                'rgba(30,214,0,0.8)',
                'rgba(200,42,0,1.0)',
                'rgba(32,102,0,1.8)',
                'rgba(39,203,0,0.3)',
                'rgba(30,214,0,0.8)',
            ],
            borderWidth: 2,
            borderColor: 'rgba(51,51,51,0.7)',
            hoverBorderWidth: 4,
            hoverBorderColor: 'rgba(51,51,51,1)',
        }]
    },
    options:{
        title:{
            display:true,
            text: 'Ratio of Immigrants In Each Country',
            fontSize:30,
        },
        legend:{
            display:false,
        },
        layout: {
            padding:{
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                width: 50,
                height: 1,
            },
        },
        tooltips:{
            enabled: true,
        },
        scales: {
            xAxes: [{
                stacked: false,
                beginAtZero: true,
                scaleLabel: {
                    labelString: 'Month'
                },
                ticks: {
                    stepSize: 1,
                    min: 0,
                    autoSkip: false
                }
            }]
        }
    },
    

});

// CHAT BUILD

var socket;
socket = io('http://localhost:8000');

function renderMessages(message) {
    $('.messages').append('<div class="message"><strong>' + message.author +
        '</strong>: <br>' + message.message + '</div');
    console.log(message);
}

socket.on('receivedMessage', (message) => {
    renderMessages(message);
})

socket.on('previousMessages', (messages) => {
    for (message of messages) {
        renderMessages(message);
    }
})

$('#chat').submit(function (event) {
    event.preventDefault();
    var author = $('input[name=username]').val();
    var message = $('input[name=message]').val();

    if (author.length && message.length) {
        var messageObject = {
            author: author,
            message: message,
        };
        renderMessages(messageObject);
        socket.emit('sendMessage', messageObject);
    }
});

function openForm() {
    document.getElementById('myform').style.display = "block";
}
function closeForm() {
    document.getElementById('myform').style.display = "none";
}

const today = new Date();
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let date = months[today.getMonth()] + " " + today.getDate() + " " + today.getFullYear();
document.getElementById("date").innerHTML = date;

// 

