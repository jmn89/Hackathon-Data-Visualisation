/*global d3*/
/*jslint maxlen:100 */

var svg, svgSize, document, datasets = [], set, event_Dataset, event_Name, event_Color,
    data, graphCount, iterator;

event_Dataset = "data/HackCity_0214_0222__Final_150.json";
event_Name = "#HackCity";
event_Color = "red";
set = [event_Dataset, event_Name, event_Color];
datasets.push(set);
event_Dataset = "data/VHacks_0305_0315__Final_RTFiltered_1090.json";
event_Name = "#VHacks";
event_Color = "green";
set = [event_Dataset, event_Name, event_Color];
datasets.push(set);
event_Dataset = "data/Fosdem_0131_0208__Final_3614.json";
event_Name = "#Fosdem";
event_Color = "blue";
set = [event_Dataset, event_Name, event_Color];
datasets.push(set);
event_Dataset = "data/StartHack_0220_0301__Final_36.json";
event_Name = "#StartHack";
event_Color = "#f44295";
set = [event_Dataset, event_Name, event_Color];
datasets.push(set);
event_Dataset = "data/Hex_0313_0322__Final_RTFiltered_ManualFilter_56.json";
event_Name = "#Hex";
event_Color = "purple";
set = [event_Dataset, event_Name, event_Color];
datasets.push(set);
graphCount = datasets.length;

svg = d3.select("body").append("svg")
    .attr("id", "mySVG")
    .attr("height", (graphCount * 100).toString() + "%")
    .attr("width", "100%");

svgSize = document.getElementById("mySVG").getBoundingClientRect();

for (iterator = 0; iterator < graphCount; iterator += 1) {
    (function (iterator) {
        "use strict";
        d3.json(datasets[iterator][0], function (data) {
            var scene, graph, nodesGroup, cxScale, cyScale, xAxis, yAxis, graphWidth, i,
                graphHeight, dataFollowers = [], dataEngagement = [], dataTweetIDs = [],
                dataUserScrNames = [], trendlinesGroup, nodeCodsX = [], nodeCodsY = [],
                trendcods, trendLine, legendGroup, legendRectWidth, slope,
                nodeMouseClicked = false;

            graphWidth = svgSize.width * 0.9;
            graphHeight = (svgSize.height * 0.65) / graphCount;
            trendLine = d3.line()
                .x(function (d) { return d[0]; })
                .y(function (d) { return d[1]; })
                .curve(d3.curveLinear);

            // function from https://github.com/wbkd/d3-extended
            d3.selection.prototype.moveToFront = function () {
                return this.each(function () {
                    this.parentNode.appendChild(this);
                });
            };
            function hasValue(val, arr) {
                var c;
                for (c = 0; c < arr.length; c += 1) {
                    if (arr[c] === val) {
                        return true;
                    }
                }
                return false;
            }
            function getNodeRadius(value) {
                var x0, x1, minRadius, maxRadius, minCircArea, maxCircArea, areasScaled;
                x0 = d3.min(dataFollowers);
                x1 = d3.max(dataFollowers);
                minRadius = 8;
                maxRadius = 30;
                minCircArea = 3.142 * Math.pow(minRadius, 2);
                maxCircArea = 3.142 * Math.pow(maxRadius, 2);
                areasScaled = (minCircArea + (maxCircArea - minCircArea) *
                    ((value - x0)) / (x1 - x0));
                return Math.sqrt(areasScaled / 3.142);
            }
            function createScales() {
                cxScale = d3.scaleLinear()
                    .domain([d3.min(dataFollowers), d3.max(dataFollowers)])
                    .range([0, graphWidth]);
                cyScale = d3.scaleLinear()
                    .domain([d3.min(dataEngagement), d3.max(dataEngagement)])
                    .range([graphHeight, 0]);
            }
            function createDataArrays() {
                var i1, i2, name, nameArr, count, engagementScore;
                nameArr = [];
                for (i1 = 0; i1 < data.length; i1 += 1) {
                    name = data[i1].user.id_str;
                    if (hasValue(name, nameArr) === false) {
                        nameArr.push(name);
                        count = 1;
                        engagementScore = data[i1].favorite_count + data[i1].retweet_count;
                        for (i2 = 0; i2 < data.length; i2 += 1) {
                            if (name === data[i2].user.id_str) {
                                count += 1;
                                engagementScore += data[i2].favorite_count + data[i2].retweet_count;
                            }
                        }
                        dataEngagement.push(engagementScore / count);
                        dataFollowers.push(data[i1].user.followers_count);
                        dataTweetIDs.push(data[i1].id_str);
                        dataUserScrNames.push(data[i1].user.screen_name);
                    }
                }
            }
            function getTrendYCods() {
                var xAvg = 0, yAvg = 0, temp = [], temp2 = [], finalArr = [],
                    sum1, sum2, yInt, yValsArr = [];
                slope = 0;

                finalArr.push(nodeCodsX);
                finalArr.push(nodeCodsY);

                for (i = 0; i < nodeCodsX.length; i += 1) {
                    xAvg += nodeCodsX[i];
                    yAvg += nodeCodsY[i];
                }
                xAvg = xAvg / nodeCodsX.length;
                yAvg = yAvg / nodeCodsY.length;

                for (i = 0; i < nodeCodsX.length; i += 1) {
                    temp.push(nodeCodsX[i] - xAvg);
                    temp2.push(nodeCodsY[i] - yAvg);
                }
                finalArr.push(temp);
                finalArr.push(temp2);
                temp = [];
                for (i = 0; i < nodeCodsX.length; i += 1) {
                    temp.push(finalArr[2][i] * finalArr[3][i]);
                }
                finalArr.push(temp);
                temp = [];
                for (i = 0; i < nodeCodsX.length; i += 1) {
                    temp.push(finalArr[2][i] * finalArr[2][i]);
                }
                finalArr.push(temp);

                sum1 = 0;
                sum2 = 0;
                for (i = 0; i < finalArr[4].length; i += 1) {
                    sum1 += finalArr[4][i];
                    sum2 += finalArr[5][i];
                }
                slope = sum1 / sum2;
                yInt = yAvg - (slope * xAvg);

                for (i = 0; i < nodeCodsX.length; i += 1) {
                    yValsArr.push(yInt + (slope * nodeCodsX[i]));
                }
                return yValsArr;
            }
            function HandleMouseover() {
                var c, selectedID, selectedID_2, selectedName;
                selectedID = d3.select(this).attr("id");
                selectedID = selectedID.split("node").pop();
                selectedName = d3.select(this).attr("scr-name");
                graph.append("defs").attr("id", "defs" + selectedID)
                    .append("pattern")
                    .attr("class", "image-pattern")
                    .attr("id", "img" + selectedID)
                    .attr("height", "100%")
                    .attr("width", "100%")
                    .attr("patternContentUnits", "objectBoundingBox")
                    .append("image")
                    .attr("height", 1)
                    .attr("width", 1)
                    .attr("preserveAspectRatio", "none")
                    .attr("xlink:href", "https://avatars.io/twitter/" + selectedName);
                selectedID = "#node" + selectedID;
                d3.select(selectedID).attr("stroke", "#ff00e1");
                d3.select(selectedID).moveToFront();
                d3.select(selectedID).attr("fill-opacity", d3.select(selectedID).attr("fill-opacity") * 100);
                selectedID_2 = selectedID.split("node").pop();
                d3.select(selectedID).attr("fill", "url(#img" + selectedID_2);
            }
            function HandleMouseClick() {
                var selectedID = d3.select(this).attr("id");
                selectedID = selectedID.split("node").pop();
                if (nodeMouseClicked === false) {
                    d3.select("#node" + selectedID).attr("r", d3.select("#node" + selectedID).attr("r") * 2);
                    nodeMouseClicked = true;
                }
            }
            function HandleMouseOut() {
                var selectedID = d3.select(this).attr("id");
                selectedID = selectedID.split("node").pop();
                if (nodeMouseClicked) {
                    d3.select(this).attr("r", d3.select(this).attr("r") / 2);
                    nodeMouseClicked = false;
                }
                    d3.select("#node" + selectedID)
                        .attr("fill", datasets[iterator][2])
                        .attr("fill-opacity", "0.2")
                        .attr("stroke", "none");
                    d3.selectAll("#defs" + selectedID).remove();
            }

            createDataArrays();
            createScales();

            //graph
            scene = svg.append("g")
                .attr("class", "scene")
                .attr("transform", "translate(" +
                    0 + ", " + (svgSize.height / graphCount) * iterator + ")");
            graph = scene
                .append("g")
                .attr("class", "graph")
                .attr("transform", "translate(" +
                    70 + ", " + 110 + ")");

            //title
            scene.append("text")
                .text("Does More Followers Correlate with More Likes and Retweets?")
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .attr("id", "graph-title")
                .attr("dominant-baseline", "hanging")
                .attr("x", svgSize.width * 0.5)
                .attr("y", 10);
            scene.append("text")
                .text(datasets[iterator][1] + " 2018")
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .attr("id", "graph-title")
                .attr("dominant-baseline", "hanging")
                .attr("x", svgSize.width * 0.5)
                .attr("y", 40);

            //axis
            xAxis = d3.axisBottom(cxScale).ticks(16).tickPadding(20);
            yAxis = d3.axisLeft(cyScale).ticks(8).tickPadding(10);
            graph.append("g")
                .attr("class", "x Axis")
                .attr("transform", "translate (0, " + graphHeight + ")")
                .call(xAxis);
            graph.append("g")
                .attr("class", "y Axis")
                .call(yAxis);

            //axis-labels
            graph.append("text")
                .style("text-anchor", "middle")
                .attr("x", graphWidth * 0.5)
                .attr("y", graphHeight + 65)
                .text("Followers");
            graph.append("text")
                .style("text-anchor", "middle")
                .attr("x", -(graphHeight / 2))
                .attr("y", -40)
                .attr("transform", "rotate(-90)")
                .text("Engagement (Likes + RTs)");

            //nodes
            nodesGroup = graph.append("g").attr("class", "nodesGroup");
            nodesGroup.selectAll("nodes").data(dataEngagement).enter()
                .append("circle")
                .attr("class", "nodes")
                .attr("id", function (d, i) { return "node" + dataTweetIDs[i]; })
                .attr("cx", function (d, i) { return cxScale(dataFollowers[i]); })
                .attr("cy", function (d, i) { return cyScale(dataEngagement[i]); })
                .attr("r", function (d, i) { return getNodeRadius(dataFollowers[i]); })
                .attr("fill", datasets[iterator][2])
                .attr("fill-opacity", "0.2")
                .attr("scr-name", function (d, i) { return dataUserScrNames[i]; })
                .on("click", HandleMouseClick)
                .on("mouseover", HandleMouseover)
                .on("mouseout", HandleMouseOut);
            for (i = 0; i < dataFollowers.length; i += 1) {
                nodeCodsX.push(cxScale(dataFollowers[i]));
                nodeCodsY.push(cyScale(dataEngagement[i]));
            }

            //trendLine
            trendlinesGroup = graph.append("g").attr("class", "trendlinesGroup");
            trendcods = nodeCodsX.map(function (fst, snd) {
                return [fst, getTrendYCods(nodeCodsX)[snd]];
            });
            trendlinesGroup.append("path")
                .attr("id", "line")
                .attr("stroke-width", 3)
                .attr("stroke", "grey")
                .attr("fill", "transparent")
                .attr("d", trendLine(trendcods));

            //legend
            legendRectWidth = svgSize.width * 0.2;
            legendGroup = graph.append("g")
                .attr("class", "legend")
                .attr("x", graphWidth - legendRectWidth)
                .attr("y", 0)
                .attr("transform", "translate(" +
                    (100) + ", " + 40 + ")");
            legendGroup.append("rect")
                .attr("id", "legend-rect-1")
                .attr("width", legendRectWidth)
                .attr("height", graphHeight / 12)
                .attr("rx", 15)
                .attr("fill", "gainsboro");
            legendGroup.append("text")
                .attr("x", 20)
                .attr("y", 8)
                .attr("dominant-baseline", "hanging")
                .attr("font-size", (svgSize.width / 1351) * 16)
                .style("font-weight", "bold")
                .text("Line of Best Fit Slope == " + String((slope * -1).toFixed(3)));

        });
    }(iterator));
}
