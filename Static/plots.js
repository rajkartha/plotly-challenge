// /***********************************************/
function optionChanged(newSample) {
    // console.log(`Entering ${arguments.callee.name} [ ${newSample}]`)
    // Fetch new data each time a new sample is selected
    createBarchart(newSample)
    createBubbleChart(newSample);
    buildMetadata(newSample);
  }
  //
  
  function buildMetadata(sample) {
    // write code to create the buildMetadata
    // console.log(`Entering ${arguments.callee.name} [ ${sample}]`)
  
    d3.json("samples.json").then(function (data) {
      var sample_metadata = d3.select("#sample-metadata");
      sample_metadata.html("");
      var data3 = data.metadata.filter(data2 => data2.id.toString() === sample)[0];
      // console.log(data3)
      Object.entries(data3).forEach(([key, value]) => {
        var row = sample_metadata.append("p");
        row.text(`${key.toUpperCase()} : ${value}`);
      });
  
      // bonus section build gauge
      var wfreq = data3.wfreq
      console.log(`WF: ${wfreq}`)
  
      //https://plot.ly/javascript/gauge-charts/
      //https://www.w3schools.com/colors/colors_mixer.asp
      //percentColors: [[0.0, "#1153E2"], [1.0, "#1153E2"]]
      var gaugeTrace = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `<b>Belly Button Washing Frequency</b><br>Scrubs/Week </br>` },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "red" },
            bar: { color: "seagreen" },
            steps: [
              { range: [0, 2], color: "azure" },
              { range: [2, 4], color: "lightcyan" },
              { range: [4, 6], color: "lightgreen" },
              { range: [6, 8], color: "lime" },
              { range: [8, 9], color: "limegreen" },
            ]
          }
        }
      ];
  
      var layout = {
        width: 500,
        height: 400,
        margin: { t: 20, b: 40, l: 80, r: 80 }
      };
  
      Plotly.newPlot("gauge", gaugeTrace, layout);
    });
    
  
  }
    
 
  function createBubbleChart(sample) {
    // write code to create the BubbleChart
    // console.log(`Entering ${arguments.callee.name} [ ${sample}]`)
    d3.json("samples.json").then(function (data) {
      var data3 = data.samples.filter(data2 => data2.id.toString() === sample)[0];
      var xVal = data3.otu_ids;
      var yVal = data3.sample_values;
      var tVal = data3.otu_labels;
      var mSize = data3.sample_values;
      var mClrs = data3.otu_ids;
  
      // var dates = data.dataset.data.map(row => row[0]);
      var bubbleTrace = {
        x: xVal,
        y: yVal,
        text: tVal,
        mode: 'markers',
        marker: {
          size: mSize,
          color: mClrs
        }
      };
  
      var bubbledata = [bubbleTrace];
  
      var layout = {
        xaxis: { title: "OTU ID" }
      };
  
      Plotly.newPlot('bubble', bubbledata, layout);
    });
  
  }
  

  function createBarchart(sample) {
    // write code to create barchart
    // console.log(`Entering ${arguments.callee.name} [ ${sample}]`)
    d3.json("samples.json").then(function (data) {
      var data3 = data.samples.filter(data2 => data2.id.toString() === sample)[0];
      // console.log(data3);
  
      var xVal = data3.sample_values.slice(0, 10).reverse();
      var yVal = data3.otu_ids.slice(0, 10).reverse();
      var OTU = yVal.map(row => "OTU " + row);
      var tVal = data3.otu_labels.slice(0, 10);
  
      // console.log(xVal);
      // console.log(yVal);
  
      // Trace for the Data
      var barTrace = [{
        type: 'bar',
        x: xVal,
        y: OTU,
        text: tVal,
        //chose Azure for bar color: https://rgbcolorcode.com/color/azure
        marker: { color: 'rgb(0,128,255)' },
        orientation: 'h'
      }];
  
      var layout = {
        // xaxis:{ autorange:'reversed'},
        // yaxis:{ side:'right' }
        // yaxis: { tickmode: "linear" },
        margin: {
          l: 100,
          r: 30,
          t: 100,
          b: 30
        }
      }
      // Render the plot to the div tag with id "bar"
      Plotly.newPlot("bar", barTrace, layout);
    });
  }
  
  function fillDropDown() {
    // write code to pupulate the dropdown
    // console.log(`Entering ${arguments.callee.name}`)
    var dropdownMenu = d3.select("#selDataset");
    d3.json("samples.json").then(function (data) {
      data.names.forEach((sample) => {
        dropdownMenu.append("option")
          .text(sample)
          .property("value", sample);
      });
      buildMetadata(data.names[0]);
      createBubbleChart(data.names[0]);
      createBarchart(data.names[0])
    });
  }
  // /***********************************************/
  
  fillDropDown()