const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Create fetch for json data
d3.json(url).then(function(data) {
    console.log(data)
});

// Log all data
d3.json(url).then(data => {
    nameData = data.names;
    metaData = data.metadata;
    sampleData = data.samples;

    // Create charts with the first subject's data
    metadata(0);
    barChart(0);
    bubbleChart(0);
    
    // Create dropdown menu with subject IDs
    d3.select("#selDataset").selectAll("option").data(nameData).enter().append("option").text(name => name).property("value", name => name);

    function metadata(sample) {
        const metadataValues = metaData[sample];
        const panelBody = d3.select("#sample-metadata");
        panelBody.html("");
        Object.entries(metadataValues).forEach(([key, value]) => {panelBody.append("p").text(`${key}: ${value}`);
        });
    }
});

// Create function for bar chart
function barChart(sample) {
    d3.json(url).then((data) => {
        const sampleValues = sampleData[sample].sample_values.slice(0, 10).reverse();
        const otuIDs = sampleData[sample].otu_ids.map(id => `OTU ${id}`).reverse();
        const otuLabels = sampleData[sample].otu_labels.slice(0, 10).reverse();

        let trace = {
            x: sampleValues,
            y: otuIDs,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top Ten OTUs",
            x_axis: "Sample Values"
        };

        Plotly.newPlot("bar", [trace], layout)
    });
};

// Create function for bubble chart
function bubbleChart(sample) {
    d3.json(url).then((data) => {
        const sampleValues = sampleData[sample].sample_values;
        const otuIDs = sampleData[sample].otu_ids;
        const otuLabels = sampleData[sample].otu_labels;

        const trace2 = {
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: "Earth"
            }
        };

        const layout = {
            x_axis: "OTU IDs",
            title: "Bacteria In Each Sample",
            hovermode: "closest"
        };

        Plotly.newPlot("bubble", [trace2], layout)
    });
};

// Call function updateCharts whenever a change happens to DOM
d3.selectAll("#selDataset").on("change", barChart);

// New function called when dropdown item is selected
function optionChanged() { 
    let dropdownMenuNew = d3.select("#selDataset");
    let newDataSet = dropdownMenuNew.property("value");
};

// Event listener for dropdown
d3.select("#selDataset").on("change", optionChanged)