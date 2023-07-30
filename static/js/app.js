const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
    console.log(data)
});

function init() {
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        let names = data.names;
        names.forEach((id) => {
            console.log(id);
            dropdownMenu.append("option").text(id).property("value", id);
        });
        let first_sample = names[0];
        console.log(first_sample);
        metadata(first_sample);
        barChart(first_sample);
        bubbleChart(first_sample);
    });
};

function metadata(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        console.log(value)
        let dataValue = value[0];
        d3.select("#sample-metadata").html("");
        Object.entries(dataValue).forEach(([key, value]) => {
            console.log(key, value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

function barChart(sample) {
    d3.json(url).then((data) => {
        let sampleData = data.samples;
        let value = sampleData.filter(result => result.id == sample);
        let dataValue = value[0];
        let otu_ids = dataValue.otu_ids;
        let otu_labels = dataValue.otu_labels;
        let sample_values = dataValue.sample_values;
        console.log(otu_ids, otu_labels, sample_values);
        
        let xticks = sample_values.slice(0, 10).reverse();
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let labels = otu_labels.slice(0, 10).reverse();

        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top Ten OTUs"
        };

        Plotly.newPlot("bar", [trace], layout)
    });
};

function bubbleChart(sample) {
    d3.json(url).then((data) => {
        let sampleData = data.samples;
        let value = sampleData.filter(result => result.id == sample);
        let dataValue = value[0];
        let otu_ids = dataValue.otu_ids;
        let otu_labels = dataValue.otu_labels;
        let sample_values = dataValue.sample_values;
        console.log(otu_ids, otu_labels, sample_values);

        let trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let layout = {
            x_axis: "OTU ID",
            title: "Bacteria In Each Sample",
            hovermode: "closest"
        };

        Plotly.newPlot("bubble", [trace2], layout)
    });
};

function changeSampleData(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    metadata(value);
    barChart(value);
    bubbleChart(value);
    // buildGaugeChart(value);
};

init();