document.addEventListener('DOMContentLoaded', function() {
    d3.csv('NVDA.csv').then(function(data) {
        data.forEach(d => {
            d.Date = d3.timeParse("%Y-%m-%d")(d.Date);
            d.Close = +d.Close;
            d.Volume = +d.Volume;
        });
        window.data = data;  // Make data available globally

        const path = window.location.pathname;
        if (path.endsWith('overview.html')) {
            showOverview();
        } else if (path.endsWith('scene1.html')) {
            showScene1();
        } else if (path.endsWith('scene2.html')) {
            showScene2();
        } else if (path.endsWith('scene3.html')) {
            showScene3();
        }
    });
});

function showOverview() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("NVIDIA's stock performance from early 2018 to mid-2022 encapsulates the volatility and dynamism inherent in the technology sector. This period can be divided into three significant phases marked by distinct trends and driving factors. Initially, from early 2018 to mid-2019, NVIDIA faced a sharp decline in stock price largely due to external market forces. The collapse of the cryptocurrency market led to an oversupply of GPUs, which, coupled with the impact of the US-China trade war, significantly hindered NVIDIA’s growth. The inventory overhang and increased costs due to tariffs added to the pressure, causing the stock to plunge​ (Nasdaq)​​ (InvestorPlace)​. The subsequent period from mid-2019 to early 2021 marked a significant recovery for NVIDIA, driven by the burgeoning data center business and the rise of AI and machine learning applications. During this phase, NVIDIA capitalized on the growing demand for its GPUs, which became essential in various high-performance computing applications. The COVID-19 pandemic further accelerated this demand as more businesses and individuals turned to digital solutions, boosting NVIDIA’s gaming and data center segments. This robust growth led to a steady increase in stock price, showcasing the company's resilience and strategic positioning in the tech industry​ (InvestorPlace)​​ (Nasdaq)​. The final phase from early 2021 to mid-2022 saw NVIDIA’s stock reaching its peak before experiencing increased volatility and a general decline. This period was marked by significant market corrections within the tech sector, coupled with NVIDIA facing supply chain issues and regulatory scrutiny over its proposed acquisition of ARM. Despite these challenges, the company's long-term growth prospects remained strong, driven by the continued expansion in AI and data center markets. However, the immediate market reactions to these challenges led to a pullback in stock price, reflecting the broader uncertainties in the tech industry​ (Nasdaq)​​ (InvestorPlace)​.");

    const svg = createSvg();

    const x = d3.scaleTime().domain(d3.extent(window.data, d => d.Date)).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(window.data, d => d.Close)]).range([height, 0]);

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")));
    svg.append("g").call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Close));

    // Section 1: Beginning to Dec 2019
    svg.append("path")
        .datum(window.data.filter(d => d.Date < new Date("2019-12-01")))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Section 2: Dec 2019 to 10 Dec 2022
    svg.append("path")
        .datum(window.data.filter(d => d.Date >= new Date("2019-12-01") && d.Date < new Date("2022-12-10")))
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Section 3: 10 Dec 2022 to End
    svg.append("path")
        .datum(window.data.filter(d => d.Date >= new Date("2022-12-10")))
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("NVIDIA Stock Overview");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 80)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Closing Price (USD)");

    // Annotations
    const annotations = [
        {
            note: { label: "Plateau in stock price", title: "Crypto crash and datahouse crisis" },
            x: x(new Date("2019-01-01")),
            y: y(50),
            dy: -40,
            dx: 25
        },
        {
            note: { label: "Soar in stock price", title: "AI boom" },
            x: x(new Date("2021-10-01")),
            y: y(260),
            dy: -35,
            dx: -45
        }
    ];

    const makeAnnotations = d3.annotation()
        .annotations(annotations)
        .editMode(false)
        .notePadding(15)
        .type(d3.annotationCalloutElbow)
        .accessors({
            x: d => x(new Date(d.Date)),
            y: d => y(d.Close)
        })
        .annotations(annotations.map(annotation => {
            annotation.color = "orange";  // Set annotation color to orange
            return annotation;
        }));
    svg.append("g").call(makeAnnotations);
}

function showScene1() {
    const filteredData = window.data.filter(d => d.Date < new Date("2019-12-01"));
    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume (Beginning to Dec 2019)",
        d => d.Close,
        "Closing Price (USD)",
        d => d.Volume / 1e6,
        "Volume (Millions)",
        true,
        "red",
        "lightgrey",
        true,
        false
    );
}

function showScene2() {
    const filteredData = window.data.filter(d => d.Date >= new Date("2019-12-01") && d.Date < new Date("2022-12-10"));
    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume (Dec 2019 to 10 Dec 2022)",
        d => d.Close,
        "Closing Price (USD)",
        d => d.Volume / 1e6,
        "Volume (Millions)",
        true,
        "green",
        "lightgrey",
        false,
        true
    );
}

function showScene3() {
    const filteredData = window.data.filter(d => d.Date >= new Date("2022-12-10"));
    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume (10 Dec 2022 to End)",
        d => d.Close,
        "Closing Price (USD)",
        d => d.Volume / 1e6,
        "Volume (Millions)",
        true,
        "blue",
        "lightgrey",
        false,
        true
    );
}
