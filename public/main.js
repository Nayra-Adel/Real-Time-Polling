const form = document.getElementById('vote-form');

// Form Submit Event
form.addEventListener('submit', (e) => {
	const choice = document.querySelector('input[name=laptop]:checked').value;
	const data = {laptop: choice};

	fetch('http://localhost:3000/poll', {
		method: 'post',
		body: JSON.stringify(data),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})
	.then(res => res.json())
	.then(data => console.log(data))
	.catch(err => console.log(err));

	e.preventDefault();	
});


fetch('http://localhost:3000/poll')
.then(res => res.json())
.then(data => {
	const votes = data.votes;
	const totalVotes = votes.length;
	// Count vote points - acc/current
	const voteCounts = votes.reduce((acc, vote) => 
		((acc[vote.laptop] = (acc[vote.laptop] || 0) + parseInt(vote.points)
	), acc), {});

let dataPoints = [
	{ label: 'HP', y:voteCounts.HP},
	{ label: 'Lenovo', y:voteCounts.Lenovo},
	{ label: 'Dell', y:voteCounts.Dell},
	{ label: 'Asus', y:voteCounts.Asus},
	{ label: 'Apple', y:voteCounts.Apple},
	{ label: 'Acer', y:voteCounts.Acer},
	{ label: 'Microsoft', y:voteCounts.Microsoft},
	{ label: 'Toshiba', y:voteCounts.Toshiba}
];

const chartContainer = document.querySelector('#chart');
if(chartContainer){
    const newChart = new CanvasJS.Chart('chart', {
        animationEnabled: true,
        theme: 'theme1',
        title: {
        	text: `Total Votes ${totalVotes}`
        },
        data:[
            {
                type: 'column',
                dataPoints: dataPoints
            }
        ]
    });
    newChart.render();

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('83965bf70f8dbd9e0e84', {
      cluster: 'eu',
      forceTLS: true
    });

    var channel = pusher.subscribe('laptop-poll');
    channel.bind('laptop-vote', function(data) {
      dataPoints = dataPoints.map(x => {
      	if(x.label == data.laptop){
      		x.y += data.points;
      		return x;
      	} else {
      		return x;
      	}
      });
	    newChart.render();
    });
}
});
