/*jslint browser: true*/
/*global d3*/
/*jslint es6:true */
/*jslint maxlen:80*/

var console;

const set1 = {
    path: "data/HackCity_0214_0222__Final_150.json",
    name: "#HackCity",
    startDate: "Sat Feb 17 10:00:00 +0000 2018",
    endDate: "Sun Feb 18 17:30:00 +0000 2018"
};
Object.freeze(set1);

const datasets = [];
datasets.push(set1);

const svg = d3.select("body").append("svg")
    .attr("id", "svg")
    .attr("height", String(datasets.length) + "%")
    .attr("width", "100%");
const svgSize = document.getElementById("svg").getBoundingClientRect();

var func = (x) => x * x;

//return new object with only desired key-val pairs, e.g. id_str, text, etc..
const stripTweet = (tweetObj) => {
    return tweetObj;
};

d3.json(datasets[0].path, function (inputData) {
    "use strict";
});
