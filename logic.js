/*global d3*/
/*jslint maxlen:100 */

//global vars
var graphCount, svg, svgSize, set, datasets, event_dataset, choice,
    event_Name, event_StartDate, event_EndDate, iterator, document, console;

// console.log("yo");
// choice = parseInt(document.currentScript.getAttribute('g'), 10);
choice = 0;
datasets = [];
event_dataset = "data/HackCity_0214_0222__Final_150.json";
event_Name = "#HackCity";
event_StartDate = "Sat Feb 17 10:00:00 +0000 2018";
event_EndDate = "Sun Feb 18 17:30:00 +0000 2018";
set = [event_dataset, event_Name, event_StartDate, event_EndDate];
if (choice === 1 || choice === 0) {
    datasets.push(set);
}
event_dataset = "data/VHacks_0305_0315__Final_RTFiltered_1090.json";
event_Name = "#VHacks";
event_StartDate = "Thu Mar 08 09:00:00 +0000 2018";
event_EndDate = "Sun Mar 11 18:00:00 +0000 2018";
set = [event_dataset, event_Name, event_StartDate, event_EndDate];
if (choice === 2 || choice === 0) {
    datasets.push(set);
}
event_dataset = "data/Fosdem_0131_0208__Final_3614.json";
event_Name = "#Fosdem";
event_StartDate = "Sat Feb 03 12:00:00 +0000 2018";
event_EndDate = "Sun Feb 04 16:00:00 +0000 2018";
set = [event_dataset, event_Name, event_StartDate, event_EndDate];
if (choice === 3 || choice === 0) {
    datasets.push(set);
}
event_dataset = "data/StartHack_0220_0301__Final_36.json";
event_Name = "#StartHack";
event_StartDate = "Fri Feb 23 18:00:00 +0000 2018";
event_EndDate = "Sun Feb 25 15:00:00 +0000 2018";
set = [event_dataset, event_Name, event_StartDate, event_EndDate];
if (choice === 4 || choice === 0) {
    datasets.push(set);
}
event_dataset = "data/Hex_0313_0322__Final_RTFiltered_ManualFilter_56.json";
event_Name = "#Hex";
event_StartDate = "Fri Mar 16 19:00:00 +0000 2018";
event_EndDate = "Sun Mar 18 12:00:00 +0000 2018";
set = [event_dataset, event_Name, event_StartDate, event_EndDate];
if (choice === 5 || choice === 0) {
    datasets.push(set);
}
graphCount = datasets.length;

svg = d3.select("body").append("svg")
    .attr("id", "mySVG")
    .attr("height", (graphCount * 100).toString() + "%")
    .attr("width", "100%");

svgSize = document.getElementById("mySVG").getBoundingClientRect();

for (iterator = 0; iterator < graphCount; iterator += 1) {
    (function (iterator) {
        "use strict";
        d3.json(datasets[iterator][0], function (myData) {
            //vars
            var scene, i, i2, graphWidth, graphHeight, graph, xAxis, yAxis, cxScale,
                cyScale, yScale_numOfTweets, yScale_followers, trendLine, tweetRectX,
                tweetRectY, tweetRectWidth, tweetRectHeight, data_StartDate, sceneNum,
                data_EndDate, trendline_Eng_Colour, trendline_Freq_Colour,
                trendline_Followers_Colour, nodesGroup, trendlinesGroup, toD3Date,
                legendRectWidth, legendGroup, nodeMouseClicked = false,
                trends_IntervalTimestamps = [], trends_XCods = [],
                trendcods_Followers = [], matches = [], trendcods_Followers_Vals = [],
                trendcods_Frequency = [], trendcods_Engagement = [],
                dataTimestamps = [], dataEngagement = [], dataFollowers = [];

            event_Name = datasets[iterator][1];
            event_StartDate = datasets[iterator][2];
            event_EndDate = datasets[iterator][3];

            sceneNum = "scene" + String(iterator + 1);
            scene = svg.append("g").attr("class", sceneNum)
                .attr("transform", "translate(" +
                    0 + ", " + (svgSize.height / graphCount) * iterator + ")");

            toD3Date = d3.timeParse("%a %b %d %H:%M:%S %Z %Y");
            data_StartDate = d3.timeDay
                .floor(d3.timeDay.offset(toD3Date(event_StartDate), -3));
            data_EndDate = d3.timeDay
                .floor(d3.timeDay.offset(toD3Date(event_EndDate), +4));
            trendline_Eng_Colour = "#00FF0C";
            trendline_Freq_Colour = "red";
            trendline_Followers_Colour = "#00E4FF";
            graphWidth = svgSize.width * 0.9;
            graphHeight = (svgSize.height * 0.70) / graphCount;
            trendLine = d3.line()
                .x(function (d) { return d[0]; })
                .y(function (d) { return d[1]; })
                .curve(d3.curveBasis);

            //functions
            // function from https://github.com/wbkd/d3-extended
            d3.selection.prototype.moveToFront = function () {
                return this.each(function () {
                    this.parentNode.appendChild(this);
                });
            };
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
            function HandleMouseClick() {
                var selectedID = d3.select(this).attr("id");
                selectedID = selectedID.split("node").pop();
                if (nodeMouseClicked === false) {
                    d3.select("#node" + selectedID).attr("r", d3.select("#node" + selectedID).attr("r") * 2);
                    nodeMouseClicked = true;
                }
            }
            function HandleMouseover() {
                var c, selectedID, selectedName;
                selectedID = d3.select(this).attr("id");
                selectedID = selectedID.split("node").pop();
                matches.push(selectedID);
                selectedName = d3.select(this).attr("scr-name");
                for (c = 0; c < myData.length; c += 1) {
                    if (myData[c].user.screen_name === selectedName) {
                        matches.push(myData[c].id_str);
                    }
                }
                for (c = 0; c < matches.length; c += 1) {
                    selectedID = "#node" + matches[c];
                    graph.append("defs").attr("id", "defs" + matches[c])
                        .append("pattern")
                        .attr("class", "image-pattern")
                        .attr("id", "img" + matches[c])
                        .attr("height", "100%")
                        .attr("width", "100%")
                        .attr("patternContentUnits", "objectBoundingBox")
                        .append("image")
                        .attr("height", 1)
                        .attr("width", 1)
                        .attr("preserveAspectRatio", "none")
                        .attr("xlink:href", "https://avatars.io/twitter/" + selectedName);

                    d3.select(selectedID).attr("stroke", "#ff00e1");
                    d3.select(selectedID).moveToFront();
                    d3.select("#node" + matches[0]).moveToFront();
                    d3.select(selectedID).attr("fill-opacity", d3.select(selectedID).attr("fill-opacity") * 100);
                    d3.select(selectedID).attr("fill", "url(#img" + matches[c]);
                }
                scene.append("text")
                    .attr("id", "tweet-text")
                    .attr("x", svgSize.width / 2)
                    .attr("y", tweetRectY + (tweetRectHeight / 2))
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .attr("font-size", (svgSize.width / 1351) * 13)
                    .attr("id", "tooltip-" + d3.select(this).attr("id"))
                    .text(d3.select(this).attr("tweet-text"));
            }
            function HandleMouseOut() {
                d3.select("#tooltip-" + d3.select(this).attr("id")).remove();
                if (nodeMouseClicked) {
                    d3.select(this).attr("r", d3.select(this).attr("r") / 2);
                    nodeMouseClicked = false;
                }
                for (i = 0; i < matches.length; i += 1) {
                    d3.select("#node" + matches[i])
                        .attr("fill", "black")
                        .attr("fill-opacity", "0.2")
                        .attr("stroke", "none");
                    d3.selectAll("#defs" + matches[i]).remove();
                }
                matches = [];
            }
            function createDataArrays() {
                for (i = 0; i < myData.length; i += 1) {
                    dataTimestamps.push(toD3Date(myData[i].created_at));
                    dataEngagement.push(myData[i].favorite_count
                        + myData[i].retweet_count);
                    dataFollowers.push(myData[i].user.followers_count);

                }
            }
            function createScales() {
                cxScale = d3.scaleTime()
                    .domain([data_StartDate, data_EndDate])
                    .range([0, graphWidth]);
                cyScale = d3.scaleLinear()
                    .domain([d3.min(dataEngagement, function (d) { return d; }),
                          d3.max(dataEngagement, function (d) { return d; })])
                    .range([graphHeight, 0]);
                yScale_numOfTweets = d3.scaleLinear()
                    .domain([0, myData.length])
                    .range([graphHeight, 0]);
            }
            function createTrendlineCods() {
                var engagementScore, followersScore, nodesCount, average_Engagement,
                    nodeTimestamp, earliestDate, latestDate,
                    findAuthor, yCods_Engagement = [], yCods_Freq = [],
                    followersScoreArr = [];
                earliestDate = data_StartDate;
                latestDate = data_EndDate;
                while (earliestDate <= latestDate) {
                    earliestDate = d3.timeHour.offset(earliestDate, +6);
                    trends_IntervalTimestamps.push(earliestDate);
                    trends_XCods.push(cxScale(earliestDate));
                }
                for (i = 0; i < trends_IntervalTimestamps.length; i += 1) {
                    engagementScore = 0;
                    followersScore = 0;
                    nodesCount = 0;
                    average_Engagement = 0;
                    followersScoreArr = [];
                    for (i2 = 0; i2 < myData.length; i2 += 1) {
                        nodeTimestamp = toD3Date(myData[i2].created_at);
                        if (nodeTimestamp >= d3.timeHour
                                  .offset(trends_IntervalTimestamps[i], -6)
                                  && nodeTimestamp <= d3.timeHour
                                  .offset(trends_IntervalTimestamps[i], +6)) {
                            engagementScore += myData[i2].favorite_count
                                  + myData[i2].retweet_count;
                            findAuthor =
                                followersScoreArr.indexOf(myData[i2].user.id_str);
                            if (findAuthor === -1) {
                                followersScoreArr.push(myData[i2].user.id_str);
                                followersScore += myData[i2].user.followers_count;
                            }
                            nodesCount += 1;
                        }
                    }
                    if (nodesCount === 0) {
                        average_Engagement = 0;
                    } else {
                        average_Engagement = engagementScore / nodesCount;
                    }
                    trendcods_Followers_Vals.push(followersScore);
                    yCods_Engagement.push(cyScale(average_Engagement));
                    yCods_Freq.push(yScale_numOfTweets(nodesCount));
                }
                trendcods_Engagement = trends_XCods.map(function (fst, snd) {
                    return [fst, yCods_Engagement[snd]];
                });
                trendcods_Frequency = trends_XCods.map(function (fst, snd) {
                    return [fst, yCods_Freq[snd]];
                });
            }
            function createTrendlineCods_Followers() {
                var yCods_Followers = [], followersMin, followersMax;
                followersMin = Math.min.apply(null, trendcods_Followers_Vals);
                followersMax = Math.max.apply(null, trendcods_Followers_Vals);
                yScale_followers = d3.scaleLinear()
                    .domain([followersMin, followersMax])
                    .range([graphHeight, graphHeight * 0.2]);
                for (i = 0; i < trendcods_Followers_Vals.length; i += 1) {
                    yCods_Followers.push(yScale_followers(trendcods_Followers_Vals[i]));
                }
                trendcods_Followers = trends_XCods.map(function (fst, snd) {
                    return [fst, yCods_Followers[snd]];
                });
            }

            //init
            createDataArrays();
            createScales();
            createTrendlineCods();
            createTrendlineCods_Followers();

            //svg logic
            graph = scene
                .append("g")
                .attr("class", "graph")
                .attr("transform", "translate(" +
                    70 + ", " + 110 + ")");
            nodesGroup = graph.append("g").attr("class", "nodesGroup");

            //title / tweet-rect / tweet-text / logo
            scene.append("text")
                .text("Lifespan of " + event_Name + " 2018")
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .attr("id", "graph-title")
                .attr("dominant-baseline", "hanging")
                .attr("x", svgSize.width * 0.5)
                .attr("y", 10);
            scene.append("rect")
                .attr("id", "tweet-rect")
                .attr("width", svgSize.width * 0.7)
                .attr("height", (svgSize.height * 0.05) / graphCount)
                .attr("x", svgSize.width * 0.15)
                .attr("y", 30)
                .attr("rx", 15)
                .attr("fill", "lightblue");
            tweetRectX = parseFloat(d3.select("#tweet-rect").attr("x"));
            tweetRectY = parseFloat(d3.select("#tweet-rect").attr("y"));
            tweetRectWidth = parseFloat(d3.select("#tweet-rect").attr("width"));
            tweetRectHeight = parseFloat(d3.select("#tweet-rect").attr("height"));
            scene.append("image")
                .attr("xlink:href", "images/twitter_logo.png")
                .attr("width", (svgSize.width / 1351) * 50 + "px")
                .attr("width", (svgSize.height / 3360) * 50 + "px")
                .attr("x", tweetRectX + (tweetRectWidth * 0.96))
                .attr("y", tweetRectY - (tweetRectHeight * 0.2));

            //nodes
            nodesGroup.selectAll("nodes").data(dataEngagement).enter()
                .append("circle")
                .attr("class", "nodes")
                .attr("id", function (d, i) { return "node" + myData[i].id_str; })
                .attr("scr-name", function (d, i) { return myData[i].user.screen_name; })
                .attr("cx", function (d, i) { return cxScale(dataTimestamps[i]); })
                .attr("cy", function (d) { return cyScale(d); })
                // .attr("r", function (d, i) { return getNodeRadius(dataEngagement[i]); })
                .attr("r", function (d, i) { return getNodeRadius(dataFollowers[i]); })
                .attr("fill", "black")
                .attr("fill-opacity", "0.2")
                .attr("tweet-text", function (d, i) { return myData[i].text; })
                .on("click", HandleMouseClick)
                .on("mouseover", HandleMouseover)
                .on("mouseout", HandleMouseOut);

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
                .text("Time");
            graph.append("text")
                .style("text-anchor", "middle")
                .attr("x", -(graphHeight / 2))
                .attr("y", -40)
                .attr("transform", "rotate(-90)")
                .text("Engagement (Likes + RTs)");

            //legend
            legendRectWidth = svgSize.width * 0.1;
            legendGroup = graph.append("g")
                .attr("class", "legend")
                .attr("x", graphWidth - legendRectWidth)
                .attr("y", 0)
                .attr("transform", "translate(" +
                    (100) + ", " + 0 + ")");
            legendGroup.append("rect")
                .attr("id", "legend-rect-1")
                .attr("width", legendRectWidth)
                .attr("height", graphHeight / 3.3)
                .attr("rx", 15)
                .attr("fill", "gainsboro");
            legendGroup.append("text")
                .attr("x", -16)
                .attr("y", -8)
                .attr("dominant-baseline", "middle")
                .attr("font-size", (svgSize.width / 1351) * 16)
                .style("font-weight", "bold")
                .text("12 Hour Moving Averages");
            legendGroup.append("circle")
                .attr("cx", graphWidth * 0.02)
                .attr("cy", graphHeight * 0.05)
                .attr("r", 7)
                .attr("fill", trendline_Freq_Colour)
                .attr("stroke", "black")
                .attr("stroke-width", "0.3");
            legendGroup.append("circle")
                .attr("cx", graphWidth * 0.02)
                .attr("cy", graphHeight * 0.05 * 3)
                .attr("r", 7)
                .attr("fill", trendline_Eng_Colour)
                .attr("stroke", "black")
                .attr("stroke-width", "0.3");
            legendGroup.append("circle")
                .attr("cx", graphWidth * 0.02)
                .attr("cy", graphHeight * 0.05 * 5)
                .attr("r", 7)
                .attr("fill", trendline_Followers_Colour)
                .attr("stroke", "black")
                .attr("stroke-width", "0.3");
            legendGroup.append("text")
                .attr("x", (graphWidth * 0.02) + 10)
                .attr("y", graphHeight * 0.05)
                .attr("dominant-baseline", "middle")
                .attr("font-size", (svgSize.width / 1351) * 13)
                .text("Num. of Tweets");
            legendGroup.append("text")
                .attr("x", (graphWidth * 0.02) + 10)
                .attr("y", graphHeight * 0.05 * 3)
                .attr("dominant-baseline", "middle")
                .attr("font-size", (svgSize.width / 1351) * 12)
                .text("Likes + RTs");
            legendGroup.append("text")
                .attr("x", (graphWidth * 0.02) + 10)
                .attr("y", graphHeight * 0.05 * 5)
                .attr("dominant-baseline", "middle")
                .attr("font-size", (svgSize.width / 1351) * 12)
                .text("Followers");
            legendGroup.append("rect")
                .attr("id", "legend-rect-2")
                .attr("width", legendRectWidth)
                .attr("height", graphHeight / 10)
                .attr("y", (svgSize.height / graphCount) * 0.23)
                .attr("rx", 15)
                .attr("fill", "gainsboro");
            legendGroup.append("line")
                .attr("stroke-dasharray", "2, 2")
                .attr("x1", (graphWidth * 0.02) - 8)
                .attr("y1", graphHeight * 0.05 * 7.5)
                .attr("x2", (graphWidth * 0.02) + 5)
                .attr("y2", graphHeight * 0.05 * 7.5)
                .attr("stroke-width", 2)
                .attr("stroke", "black");
            legendGroup.append("text")
                .attr("x", (graphWidth * 0.02) + 10)
                .attr("y", graphHeight * 0.05 * 7.5)
                .attr("dominant-baseline", "middle")
                .attr("font-size", (svgSize.width / 1351) * 12)
                .text("Event Start/Finish");

            //trendlines
            //event start/finish
            trendlinesGroup = graph.append("g").attr("class", "trendlinesGroup");
            graph.append("line")
                .attr("id", "eventStart")
                .attr("stroke-dasharray", "5, 5")
                .attr("x1", cxScale(toD3Date(event_StartDate)))
                .attr("y1", graphHeight)
                .attr("x2", cxScale(toD3Date(event_StartDate)))
                .attr("y2", 0)
                .attr("stroke-width", 2)
                .attr("stroke", "black");
            graph.append("line")
                .attr("id", "eventFinish")
                .attr("stroke-dasharray", "5, 5")
                .attr("x1", cxScale(toD3Date(event_EndDate)))
                .attr("y1", graphHeight)
                .attr("x2", cxScale(toD3Date(event_EndDate)))
                .attr("y2", 0)
                .attr("stroke-width", 2)
                .attr("stroke", "black");
            //engagement / green
            trendlinesGroup.append("path")
                .attr("id", "trendline_Engagement_Outer")
                .attr("stroke-width", 5)
                .attr("stroke", "black")
                .attr("fill", "transparent")
                .attr("d", trendLine(trendcods_Engagement));
            trendlinesGroup.append("path")
                .attr("id", "trendline_Engagement_Inner")
                .attr("data-legend", "Average Engagement (Likes + RT's)")
                .attr("stroke-width", 3)
                .attr("stroke", trendline_Eng_Colour)
                .attr("fill", "transparent")
                .attr("d", trendLine(trendcods_Engagement));
            //frequency / red
            trendlinesGroup.append("path")
                .attr("id", "trendline_Frequency_Outer")
                .attr("stroke-width", 5)
                .attr("stroke", "yellow")
                .attr("fill", "transparent")
                .attr("d", trendLine(trendcods_Frequency));
            trendlinesGroup.append("path")
                .attr("id", "trendline_Frequency_Inner")
                .attr("stroke-width", 3)
                .attr("stroke", trendline_Freq_Colour)
                .attr("fill", "transparent")
                .attr("d", trendLine(trendcods_Frequency));
            //followers / blue
            trendlinesGroup.append("path")
                .attr("id", "trendline_Followers_Outer")
                .attr("stroke-width", 5)
                .attr("stroke", "black")
                .attr("fill", "transparent")
                .attr("d", trendLine(trendcods_Followers));
            trendlinesGroup.append("path")
                .attr("id", "trendline_Followers_Inner")
                .attr("stroke-width", 3)
                .attr("stroke", trendline_Followers_Colour)
                .attr("fill", "transparent")
                .attr("d", trendLine(trendcods_Followers));
        });
    }(iterator));
}
