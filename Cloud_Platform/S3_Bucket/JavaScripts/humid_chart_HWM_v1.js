var today = new Date();//stores the current date
var fakeWeek = new Date(2018, 3, 19);

var fakeDay = new Date("2018-05-18T12:59:00Z");//troubleshooting purposes
//var fakeDay = new Date("2018-05-18T12");

var thisWeek = getWeekNumber(today);
var lastWeek = getWeekNumber(today)-1;

var thisHour = today.getHours();//stores the current hour -1 for time difference
var thisDate = today.getDate();//stores the current month
var thisDate = today.getDate();//stores the current month
var thisMonth = today.getMonth()+1;//stores the current month

var dataWithNewDate = new Array();//variable that will contain data with date formatted as YYYY-MM-DD


var thisHourData = new Array();//variable to hold data from this hour
var todaysData = new Array();//variable to hold data from this hour
var thisMonthData = new Array();//variable to hold data from this month

var yesterdaysData = new Array();
var lastWeekData = new Array();//variable to hold data from last month
var thisWeekData = new Array();//variable to hold data from last month
var lastMonthData = new Array();//variable to hold data from last month


var aggregatedDayDataById_minute = new Array();
var aggregatedDayDataById_Hour = new Array();
var aggregatedThisWeeksDataById_Date = new Array();
var aggregatedThisMonthDataById_Date = new Array();

var aggregatedTodaysDataByHour = new Array();
var aggregatedYesterdaysDataByHour = new Array();
var aggregatedThisWeeksDataByDate = new Array();
var aggregatedLastWeeksDataByDate = new Array();
var aggregatedThisMonthsDataByDate = new Array();
var aggregatedLastMonthsDataByDate = new Array();


//variables for this hour chart
var timeArrHour = new Array();
var humid1ArrHour = new Array();
var humid2ArrHour = new Array();

//variables for today chart
var timeArrDay = new Array();
var humid1ArrDay = new Array();
var humid2ArrDay = new Array();

//variables for this week chart
var timeArrThisWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
var humid1ArrThisWeek = new Array();
var humid2ArrThisWeek = new Array();

//variables for this month chart
var timeArrThisMonth = new Array();
var humid1ArrThisMonth = new Array();
var humid2ArrThisMonth = new Array();

//variables for yesterday comparison chart
var timeDayComparison = new Array();
var todayComparison = new Array();
var yesterdayComparison = new Array();

//variables for last week comparison chart
var timeWeekComparison = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
var thisWeekComparison = new Array();
var lastWeekComparison = new Array();

//variables for last month comparison chart
var timeMonthComparison = new Array();
var thisMonthComparison = new Array();
var lastMonthComparison = new Array();

var ourRequest = new XMLHttpRequest();//initalise variable for HTTP request
//ourRequest.open('GET', 'http://db.smartsense.ie:3000/api/humidity');//set HTTP request to a GET REST API
ourRequest.open('GET', 'https://7aqkzr0h14.execute-api.us-west-2.amazonaws.com/HumidityData');//set HTTP request to a GET REST API
ourRequest.send();//send out the request


ourRequest.onload = function(){//loads data that will be used for charts

  var sensorData = JSON.parse(ourRequest.responseText);//loads data from API into sensorData var as JSON 
  dataWithNewDate = formatDateFromData(sensorData);//calls function to convert data from ISODate to YYYY-MM-DD
  //dataWithNewDateForDay = formatDateFromData(sensorData2);//calls function to convert data from ISODate to YYYY-MM-DD

  //console.log(dataWithNewDate);
  //console.log(today);


  //extracting and aggregating relevant datadata 
   
  thisMonthData = extractThisMonthsData(dataWithNewDate);//setting up data for last month chart
  aggregatedThisMonthDataById_Date = aggregateDataById_Date(thisMonthData);//aggregates data by date and ID if multiples occur


  //todays data
  todaysData = extractTodaysData(thisMonthData);//setting up data for last Week chart
  aggregatedDayDataById_Hour = aggregateDataById_Hour(todaysData);//aggregates data by date and ID if multiples occur
  //this hour data
  thisHourData = extractThisHoursData(todaysData);
  aggregatedDayDataById_minute = aggregateDataById_Minute(thisHourData);
  console.log(aggregatedDayDataById_minute);
  //this weeks data
  thisWeekData = extractThisWeeksData(dataWithNewDate);//setting up data for last Week chart
  aggregatedThisWeeksDataById_Date = aggregateDataById_Date(thisWeekData);//aggregates data by date and ID if multiples occur
  //this months data 
  thisMonthData = extractThisMonthsData(dataWithNewDate);//setting up data for this month chart
  aggregatedThisMonthsDataById_Date = aggregateDataById_Date(thisMonthData);//aggregates data by date and ID if multiples occur
  //yesterday data comparison-------------------------------------------------------------------------------------------------------------------------
  yesterdaysData = extractYesterdaysData(dataWithNewDate);//setting up data for last Week chart
  aggregatedTodaysDataByHour = aggregateDataByHour(todaysData);//aggregates data by date and ID if multiples occur
  aggregatedYesterdaysDataByHour = aggregateDataByHour(yesterdaysData);//aggregates data by date and ID if multiples occur  
  //last weeks data comparison
  lastWeekData = extractLastWeeksData(dataWithNewDate);//setting up data for last Week chart
  aggregatedThisWeeksDataByDate = aggregateDataByDate(thisWeekData);//aggregates data by date and ID if multiples occur
  aggregatedLastWeeksDataByDate = aggregateDataByDate(lastWeekData);//aggregates data by date and ID if multiples occur
  //last month data comparison
  lastMonthData = extractLastMonthsData(dataWithNewDate);//setting up data for last month chart
  aggregatedThisMonthsDataByDate = aggregateDataByDate(thisMonthData);//aggregates data by date and ID if multiples occur
  aggregatedLastMonthsDataByDate = aggregateDataByDate(lastMonthData);//aggregates data by date and ID if multiples occur


  //----------this hour-------------b
  console.log(todaysData);
  console.log(thisHour);
  console.log(aggregatedDayDataById_minute);

  for (var key in aggregatedDayDataById_minute.SmartSense0001){

      var lastTwo = key.substr(key.length - 2);//gets the last two elements of the date string (i.e. the date)
      var lastTwoInt = parseInt(lastTwo)//converts the value to an int
      timeArrHour.push(lastTwoInt);//pushes this value into the array for the time axis
      humid1ArrHour.push(aggregatedDayDataById_minute.SmartSense0001[key]);//pushes the humiderature values from sensor 1 into the the relevent humid axis
  }

  for (var key in aggregatedDayDataById_minute.SmartSense0002){
      humid2ArrHour.push(aggregatedDayDataById_minute.SmartSense0002[key]);
  }

  //console.log for troubleshooting purposes
  console.log(humid1ArrHour);
  console.log(humid2ArrHour);
  console.log(timeArrHour);


  //----------today-------------------
  console.log(aggregatedDayDataById_Hour);

  for (var key in aggregatedDayDataById_Hour.SmartSense0001){
      var lastTwo = key.substr(key.length - 2);//gets the last two elements of the date string (i.e. the date)
      var lastTwoInt = parseInt(lastTwo)//converts the value to an int
      timeArrDay.push(lastTwoInt);//pushes this value into the array for the time axis
      humid1ArrDay.push(aggregatedDayDataById_Hour.SmartSense0001[key]);//pushes the humiderature values from sensor 1 into the the relevent humid axis
  }

  for (var key in aggregatedDayDataById_Hour.SmartSense0002){
      humid2ArrDay.push(aggregatedDayDataById_Hour.SmartSense0002[key]);
  }

  //console.log for troubleshooting purposes
  console.log(humid1ArrDay);
  console.log(humid2ArrDay);
  console.log(timeArrDay);

  //----------this week-------------------
  console.log(aggregatedThisWeeksDataById_Date);

  for (var key in aggregatedThisWeeksDataById_Date.SmartSense0001){
      var lastTwo = key.substr(key.length - 2);//gets the last two elements of the date string (i.e. the date)
      var lastTwoInt = parseInt(lastTwo)//converts the value to an int
      //timeArrThisWeek.push(lastTwoInt);//pushes this value into the array for the time axis
      humid1ArrThisWeek.push(aggregatedThisWeeksDataById_Date.SmartSense0001[key]);//pushes the humiderature values from sensor 1 into the the relevent humid axis
  }

  for (var key in aggregatedThisWeeksDataById_Date.SmartSense0002){
      humid2ArrThisWeek.push(aggregatedThisWeeksDataById_Date.SmartSense0002[key]);
  }

  //console.log for troubleshooting purposes
  console.log(humid1ArrThisWeek);
  console.log(humid2ArrThisWeek);
  console.log(timeArrThisWeek);

  //----------this month-------------------
  console.log(aggregatedThisMonthsDataById_Date);

  for (var key in aggregatedThisMonthsDataById_Date.SmartSense0001){
      var lastTwo = key.substr(key.length - 2);//gets the last two elements of the date string (i.e. the date)
      var lastTwoInt = parseInt(lastTwo)//converts the value to an int
      timeArrThisMonth.push(lastTwoInt);//pushes this value into the array for the time axis
      humid1ArrThisMonth.push(aggregatedThisMonthsDataById_Date.SmartSense0001[key]);//pushes the humiderature values from sensor 1 into the the relevent humid axis
  }

  for (var key in aggregatedThisMonthsDataById_Date.SmartSense0002){
      humid2ArrThisMonth.push(aggregatedThisMonthsDataById_Date.SmartSense0002[key]);
  }

  //console.log for troubleshooting purposes
  console.log(humid1ArrThisMonth);
  console.log(humid2ArrThisMonth);
  console.log(timeArrThisMonth);


  //----------yesterday comparison-------------------
  console.log(aggregatedTodaysDataByHour);
  console.log(aggregatedYesterdaysDataByHour);

  for (var key in aggregatedTodaysDataByHour){
      var lastTwo = key.substr(key.length - 2);//gets the last two elements of the date string (i.e. the date)
      var lastTwoInt = parseInt(lastTwo)//converts the value to an int
      timeDayComparison.push(lastTwoInt);//pushes this value into the array for the time axis
      todayComparison.push(aggregatedTodaysDataByHour[key]);//pushes the humiderature values from sensor 1 into the the relevent humid axis
  }

  for (var key in aggregatedYesterdaysDataByHour){
      yesterdayComparison.push(aggregatedYesterdaysDataByHour[key]);
  }

  //console.log for troubleshooting purposes
  console.log(todayComparison);
  console.log(yesterdayComparison);
  console.log(timeDayComparison);

  //----------last week comparison-------------------
  console.log(aggregatedThisWeeksDataByDate);

  for (var key in aggregatedThisWeeksDataByDate){
      var lastTwo = key.substr(key.length - 2);//gets the last two elements of the date string (i.e. the date)
      var lastTwoInt = parseInt(lastTwo)//converts the value to an int
      //timeArrThisWeek.push(lastTwoInt);//pushes this value into the array for the time axis
      thisWeekComparison.push(aggregatedThisWeeksDataByDate[key]);//pushes the humiderature values from sensor 1 into the the relevent humid axis
  }

  for (var key in aggregatedLastWeeksDataByDate){
      lastWeekComparison.push(aggregatedLastWeeksDataByDate[key]);
  }

  //console.log for troubleshooting purposes
  console.log(thisWeekComparison);
  console.log(lastWeekComparison);
  console.log(timeWeekComparison);

  
  //----------last month comparison-------------------
  console.log(aggregatedThisMonthsDataByDate);
  console.log(aggregatedLastMonthsDataByDate);

  for (var key in aggregatedThisMonthsDataByDate){
      thisMonthComparison.push(aggregatedThisMonthsDataByDate[key]);//pushes the humiderature values from sensor 1 into the the relevent humid axis
  }
  console.log(timeMonthComparison);


  for (var key in aggregatedLastMonthsDataByDate){
      var lastTwo = key.substr(key.length - 2);//gets the last two elements of the date string (i.e. the date)
      var lastTwoInt = parseInt(lastTwo)//converts the value to an int
      timeMonthComparison.push(lastTwoInt);//pushes this value into the array for the time axis
      lastMonthComparison.push(aggregatedLastMonthsDataByDate[key]);
  }

  //console.log for troubleshooting purposes
  console.log(thisMonthComparison);
  console.log(lastMonthComparison);
  console.log(timeMonthComparison);

  console.log("latest reading: "+ sensorData[sensorData.length-1].humidity+"C");
  var latestReading = sensorData[sensorData.length-1].humidity;

  document.getElementById("latestReading").innerHTML = latestReading;

  //load chart after the ajax call to ensure the data is there before the chart is created
  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(hourChart);
  google.charts.setOnLoadCallback(dayChart);
  google.charts.setOnLoadCallback(yesterdayChart);
  google.charts.setOnLoadCallback(thisWeekChart);
  google.charts.setOnLoadCallback(lastWeekChart);
  google.charts.setOnLoadCallback(thisMonthChart);//call last month chart function
  google.charts.setOnLoadCallback(lastMonthChart);//call last month chart function


};


function hourChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'S1');
      data.addColumn('number', 'S2');

      for(var j=0; j<thisMonthComparison.length; j++){//loop that inputs data into chart
        data.addRows([
          [timeArrHour[j], humid1ArrHour[j], humid2ArrHour[j]]
        ]);
      }
         
      var options = {//sets axis titles for chart
        hAxis: {
          title: 'Minute'
        },
        vAxis: {
          title: 'Humidity'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('hour_chart_div'));//sets variable chart to google line chart
      
      chart.draw(data, options);//draws chart
}


function dayChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'S1');
      data.addColumn('number', 'S2');

      for(var j=0; j<humid1ArrDay.length; j++){//loop that inputs data into chart
        data.addRows([
          [timeArrDay[j], humid1ArrDay[j], humid2ArrDay[j]]
        ]);
      }
         
      var options = {//sets axis titles for chart
        hAxis: {
          title: 'Hour'
        },
        vAxis: {
          title: 'Humidity'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('day_chart_div'));//sets variable chart to google line chart
      
      chart.draw(data, options);//draws chart
}


function thisWeekChart() {

      var data = new google.visualization.DataTable();
      //data.addColumn('number', 'X');
      data.addColumn('string', 'X');
      data.addColumn('number', 'S1');
      data.addColumn('number', 'S2');

      for(var y=0; y<humid1ArrThisWeek.length; y++){//loop that inputs data into chart
        data.addRows([
          [timeArrThisWeek[y], humid1ArrThisWeek[y], humid2ArrThisWeek[y]]
        ]);
      }
	       
      var options = {//sets axis titles for chart
        hAxis: {
          title: 'Day'
        },
        vAxis: {
          title: 'Humidity (%)'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('this_week_chart_div'));//sets variable chart to google line chart
      
      chart.draw(data, options);//draws chart
}


function thisMonthChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'S1');
      data.addColumn('number', 'S2');

      for(var j=0; j<humid1ArrThisMonth.length; j++){//loop that inputs data into chart
        data.addRows([
          [timeArrThisMonth[j], humid1ArrThisMonth[j], humid2ArrThisMonth[j]]
        ]);
      }
         
      var options = {//sets axis titles for chart
        hAxis: {
          title: 'Date'
        },
        vAxis: {
          title: 'Humidity (%)'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('this_month_chart_div'));//sets variable chart to google line chart

      chart.draw(data, options);//draws chart
}


function yesterdayChart() {

      var data = new google.visualization.DataTable();
      //data.addColumn('number', 'X');
      data.addColumn('number', 'X');
      data.addColumn('number', 'This');
      data.addColumn('number', 'Last');

      for(var y=0; y<23; y++){//loop that inputs data into chart
        data.addRows([
          [timeDayComparison[y], todayComparison[y], yesterdayComparison[y]]
        ]);
      }
         
      var options = {//sets axis titles for chart
        hAxis: {
          title: 'Hour'
        },
        vAxis: {
          title: 'Humidity (%)'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('yesterday_chart_div'));//sets variable chart to google line chart
      
      chart.draw(data, options);//draws chart
}


function lastWeekChart() {

      var data = new google.visualization.DataTable();
      //data.addColumn('number', 'X');
      data.addColumn('string', 'X');
      data.addColumn('number', 'This');
      data.addColumn('number', 'Last');

      for(var y=0; y<7; y++){//loop that inputs data into chart
        data.addRows([
          [timeWeekComparison[y], thisWeekComparison[y], lastWeekComparison[y]]
        ]);
      }
         
      var options = {//sets axis titles for chart
        hAxis: {
          title: 'Day'
        },
        vAxis: {
          title: 'Humidity (%)'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('last_week_chart_div'));//sets variable chart to google line chart
      
      chart.draw(data, options);//draws chart
}


function lastMonthChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'This');
      data.addColumn('number', 'Last');

      for(var j=0; j<31; j++){//loop that inputs data into chart
        data.addRows([
          [timeMonthComparison[j], thisMonthComparison[j], lastMonthComparison[j]]
          //[timeMonthComparison[j], lastMonthComparison[j]]
        ]);
      }
         
      var options = {//sets axis titles for chart
        hAxis: {
          title: 'Date'
        },
        vAxis: {
          title: 'Humidity (%)'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('last_month_chart_div'));//sets variable chart to google line chart

      chart.draw(data, options);//draws chart
}


function average(array) {

  var sum = 0;
  for( var i = 0; i < array.length; i++ ){
      sum += parseInt( array[i], 10 ); //don't forget to add the base
  }

  var avg = sum/array.length;

  return avg;

}


function formatDateFromData (data){
  for (var i = 0; i < data.length; i ++){//for loop that will iterate through each line of data

    var isodate = new Date(data[i].date_time_recorded);  
    year = isodate.getFullYear();
    month = isodate.getMonth()+1;
    dt = isodate.getDate();
    hour = isodate.getHours()-1;
    minute = isodate.getMinutes();
    minute = round5(minute);//round the minute to the nearest value of 5 for the purpose of aggregation

    //seconds not needed

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }

    formattedDate = (year+'-' + month + '-'+ dt);
    data[i].date_time_recorded=formattedDate;

    formattedTime = (hour+':' + minute);

    data[i].time = formattedTime;
    //dataWithNewDate.push(data[i]);

    data[i].hour = ("hour "+data[i].time[0]+data[i].time[1]);

    data[i].minute = ("minute "+data[i].time[3]+data[i].time[4]);
    dataWithNewDate.push(data[i]);
      
  }
  return dataWithNewDate;
}

//function to extract all data read from last month
function extractThisHoursData (data){
  for (var i = 0; i < data.length; i ++){//for loop that will iterate through each line of data

      //var  isodate = new Date(data[i].date_time_recorded);  
      //var hour = isodate.getHours()-1;//isolate hour componenet of object -1 for time difference
      var hour = data[i].hour;//isolate hour componenet of object -1 for time difference
      var lastTwo = hour.substr(hour.length - 2);//gets the last two elements of the date string (i.e. the date)
      var lastTwoInt = parseInt(lastTwo)//converts the value to an int

      //console.log(lastTwoInt);
    if (lastTwoInt==thisHour){
      thisHourData.push(data[i]);//push last months data into new array called lastMonthData
    }

  }
  
  //console.log(thisHour);
  
  return thisHourData;
  //console.log(lastMonthData);
}


function extractTodaysData (data){
  for (var i = 0; i < data.length; i ++){//for loop that will iterate through each line of data

      var isodate = new Date(data[i].date_time_recorded);  
      var date = isodate.getDate();//isolate month componenet of object(january gives 0)
      //console.log(date);

    if (date==thisDate){
      todaysData.push(data[i]);//push last months data into new array called thisMonthData
    }

  }
  return todaysData;
  //console.log(lastMonthData);
}

function extractYesterdaysData (data){
  for (var i = 0; i < data.length; i ++){//for loop that will iterate through each line of data

      var isodate = new Date(data[i].date_time_recorded);  
      var date = isodate.getDate();//isolate month componenet of object(january gives 0)
      //console.log(date);

    if (date==thisDate-1){
      yesterdaysData.push(data[i]);//push last months data into new array called thisMonthData
    }

  }
  return yesterdaysData;
  //console.log(lastMonthData);
}

//function to extract all data read from last week
function extractThisWeeksData (data){
  for (var i = 0; i < data.length; i ++){//for loop that will iterate through each line of data

      var isodate = new Date(data[i].date_time_recorded);
      //console.log(isodate); 
      //var day = isodate.getDate();//isolate date componenet of object
      var week = getWeekNumber(isodate);//isolate week number componenet of each object


    if (week==thisWeek){
      thisWeekData.push(data[i]);//push last months data into new array called lastWeekData
    }

  }
  return thisWeekData;
  //console.log(lastWeekData);
}


function extractThisMonthsData (data){
  for (var i = 0; i < data.length; i ++){//for loop that will iterate through each line of data

      var isodate = new Date(data[i].date_time_recorded);  
      var month = isodate.getMonth()+1;//isolate month componenet of object(january gives 0)

    if (month==thisMonth){
      thisMonthData.push(data[i]);//push last months data into new array called thisMonthData
    }

  }
  return thisMonthData;
  //console.log(thisMonthData);
}

//function to extract all data read from last week
function extractLastWeeksData (data){
  for (var i = 0; i < data.length; i ++){//for loop that will iterate through each line of data

      var isodate = new Date(data[i].date_time_recorded);
      //console.log(isodate); 
      //var day = isodate.getDate();//isolate date componenet of object
      var week = getWeekNumber(isodate);//isolate week number componenet of each object


    if (week==thisWeek-1){
      lastWeekData.push(data[i]);//push last months data into new array called lastWeekData
    }

  }
  return lastWeekData;
  //console.log(lastWeekData);
}

//function to extract all data read from last month
function extractLastMonthsData (data){
  for (var i = 0; i < data.length; i ++){//for loop that will iterate through each line of data

      var isodate = new Date(data[i].date_time_recorded);  
      var day = isodate.getDate();//isolate date componenet of object
      var month = isodate.getMonth()+1;//isolate month componenet of object(january gives 0)

    if (month==thisMonth-1){
      lastMonthData.push(data[i]);//push last months data into new array called lastMonthData
    }

  }
  return lastMonthData;
  //console.log(lastMonthData);
}

//aggregates data by date then returns in JSON form
function aggregateDataByDate(data){
  var meanHumidByDate = d3.nest()
    .key(function(d) { return d.date_time_recorded; })
    .rollup(function(v) { return d3.mean(v, function(d) { return d.humidity; }); })
    .object(data);
  //console.log(JSON.stringify(meanHumidByDate));
  //return (JSON.stringify(meanHumidByDate));
  //console.log(meanHumidByDate);
  return meanHumidByDate;

}

//aggregates data by sensor value AND by date then returns in JSON form
function aggregateDataById_Date(data){
  var totanHumidById_Date = d3.nest() //delcare new arrays name and initialise the 'd3' nest function
    .key(function(d) { return d.sensor_id; })//assign the key for each new entry to be sensor_id
    .key(function(d) { return d.date_time_recorded; })//assign second level key to be date_time_recorded
    .rollup(function(v) { return d3.mean(v, function(d) { return d.humidity; }); })//rollup function gets the mean of all variables with the same date
    .object(data);
  //console.log(JSON.stringify(totanHumidById_Date));
  return totanHumidById_Date;
  //console.log(totanHumidById_Date);
}

//aggregates data by date then returns in JSON form
function aggregateDataByHour(data){
  var meanHumidByHour = d3.nest()
    .key(function(d) { return d.hour; })
    .rollup(function(v) { return d3.mean(v, function(d) { return d.humidity; }); })
    .object(data);
  //console.log(JSON.stringify(meanHumidByHour));
  //return (JSON.stringify(meanHumidByHour));
  var sorted = JSON.parse(JSON.sortify(meanHumidByHour));//JSON orders alphabetically but we need to order numberically so we use the library "sortify" 

  return sorted;
}


function aggregateDataById_Hour(data){
  var meanHumidById_Hour = d3.nest()
    .key(function(d) { return d.sensor_id; })
    .key(function(d) { return d.hour; })
    .rollup(function(v) { return d3.mean(v, function(d) { return d.humidity; }); })
    .object(data);
  //console.log(JSON.stringify(meanHumidById_Hour));
  //return (JSON.stringify(meanHumidById_Hour));
  var sorted = JSON.parse(JSON.sortify(meanHumidById_Hour));//JSON orders alphabetically but we need to order numberically so we use the library "sortify"

  return sorted;

  //console.log(meanHumidById_Hour);
}

//aggregates data by date then returns in JSON form
function aggregateDataByMinute(data){
  var meanHumidByMinute = d3.nest()
    .key(function(d) { return d.minute; })
    .rollup(function(v) { return d3.mean(v, function(d) { return d.humidity; }); })
    .object(data);
  //console.log(JSON.stringify(meanHumidByMinute));
  //return (JSON.stringify(meanHumidByMinute));
  var sorted = JSON.parse(JSON.sortify(meanHumidByMinute));//JSON orders alphabetically but we need to order numberically so we use the library "sortify" 

  return sorted;
}


function aggregateDataById_Minute(data){
  var meanHumidById_Minute = d3.nest()
    .key(function(d) { return d.sensor_id; })
    .key(function(d) { return d.minute; })
    .rollup(function(v) { return d3.mean(v, function(d) { return d.humidity; }); })
//    .sortKeys(d3.ascending)
    .object(data)
   
  //console.log(JSON.stringify(meanHumidById_Hour));

  var sorted = JSON.parse(JSON.sortify(meanHumidById_Minute));

  return sorted;
    
}


function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    //return [d.getUTCFullYear(), weekNo];
    //Return just the week number
    return weekNo;

}


function round5(x)//round number to the nearest 5, used to round up minute value 
{
    return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}
