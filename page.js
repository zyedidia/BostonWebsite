var resultData = ["No Results"];
var headerAmount = 0;
var numRows = 0;
var chart = null;
var data = null;
var currentYearDisplay = 1640;
$(document).on('change', 'input', changed)
function changed() {
	var year = $("#years").val();
	drawChart(year);
	pictureYears = [1640, 1795, 1852, 1880, 1934, 1950, 1995];
	year = parseInt(year);
	if (pictureYears.indexOf(year) != -1) {
		change_image('images/boston' + year + '.png');
		currentYearDisplay = year;
	}
	if (year < currentYearDisplay) {
		var newImageYear = pictureYears[pictureYears.indexOf(currentYearDisplay) - 1];
		change_image('images/boston' + newImageYear + '.png');
		currentYearDisplay = newImageYear;
	}
	if (year > pictureYears[pictureYears.indexOf(currentYearDisplay) + 1]) {
		var newImageYear = pictureYears[pictureYears.indexOf(currentYearDisplay) + 1];
		change_image('images/boston' + newImageYear + '.png');
		currentYearDisplay = newImageYear;
	}
}

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart(year) {
	if (headerAmount === 0 || resultData.length === 0) {
		return;
	}
	var data = new google.visualization.DataTable();

	for (i = 0; i <= headerAmount; i++) {
		data.addColumn('number', resultData[i]);
	}
	data.addRows(numRows);

	var next = headerAmount + 1;
	for (i = 0; i < numRows; i++) {
		for (j = 0; j <= headerAmount; j++) {
			var num = parseInt(resultData[next]);
			if (next % 3 === 0) {
				if (resultData[next] > year) {
					console.log(resultData[next] + " > " + year);
					i = numRows;
					break;
				}
			}
			data.setCell(i, j, num);
			next++;
		}
	}

	var options = {
		title: 'Things',
		hAxis: {
			format: '####',
			title: 'Year'
		},
		vAxis: {
			title: 'Amount'
		},
		dataOpacity: 1.0
	};


	if (chart === null) {
		chart = new google.visualization.LineChart(document.getElementById('linechart'));
	}

	chart.draw(data, options);
}

var sample_url = "https://docs.google.com/spreadsheets/d/16gXY8cb53luvbdu-aOyQ9iYFifbsbEXOYjMyqidj74U/pubhtml";
var url_parameter = document.location.search.split(/\?url=/)[1]
var url = url_parameter || sample_url;
var googleSpreadsheet = new GoogleSpreadsheet();
googleSpreadsheet.url(url);
googleSpreadsheet.load(function (result) {
	console.log(result.data);
	resultData = result.data;
	for (i = 1; i < resultData.length; i++) {
		if (Number(resultData[i]) % 1 === 0) {
			break;
		} else {
			headerAmount++;
		}
	}

	numRows = resultData.length / (headerAmount + 1) - 1;

	drawChart(1640);
});

function change_image(src) {
	console.log(src);
	$("#bostonImage").attr('src', src);
}
