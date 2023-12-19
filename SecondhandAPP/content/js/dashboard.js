/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.475, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2, 500, 1500, "POST Create Product - Seller"], "isController": false}, {"data": [0.57, 500, 1500, "GET Created Order by ID - Buyer"], "isController": false}, {"data": [0.19, 500, 1500, "PUT Update Product - Seller"], "isController": false}, {"data": [0.58, 500, 1500, "GET List Specific Product - Buyer"], "isController": false}, {"data": [0.14, 500, 1500, "GET List Product - Seller"], "isController": false}, {"data": [0.88, 500, 1500, "GET Categories"], "isController": false}, {"data": [0.56, 500, 1500, "GET Created Order - Buyer"], "isController": false}, {"data": [0.63, 500, 1500, "POST Sign In Users - Seller"], "isController": false}, {"data": [0.86, 500, 1500, "GET Specific Categories"], "isController": false}, {"data": [0.52, 500, 1500, "PUT Update Order - Buyer"], "isController": false}, {"data": [0.11, 500, 1500, "GET List Product - Buyer"], "isController": false}, {"data": [0.64, 500, 1500, "POST Sign In Users - Buyer"], "isController": false}, {"data": [0.35, 500, 1500, "POST Create Users - Buyer"], "isController": false}, {"data": [0.54, 500, 1500, "PATCH Update Order - Seller"], "isController": false}, {"data": [0.53, 500, 1500, "POST Create Users - Seller"], "isController": false}, {"data": [0.28, 500, 1500, "POST Create Order - Buyer"], "isController": false}, {"data": [0.36, 500, 1500, "GET Specific Product -Seller"], "isController": false}, {"data": [0.61, 500, 1500, "DELETE Delete Product - Seller"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 900, 0, 0.0, 1498.4877777777767, 22, 19432, 1009.5, 3068.5, 3899.0, 12695.990000000002, 6.568623873298543, 6.578245880925447, 8.02518913303288], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Create Product - Seller", 50, 0, 0.0, 3687.58, 505, 18452, 2368.0, 12724.9, 13415.45, 18452.0, 0.4649908396804583, 0.3060584237740517, 3.290591230040268], "isController": false}, {"data": ["GET Created Order by ID - Buyer", 50, 0, 0.0, 1040.86, 73, 2796, 744.5, 2154.9, 2790.0, 2796.0, 0.42869881336168464, 0.4931710958399067, 0.14527196116846147], "isController": false}, {"data": ["PUT Update Product - Seller", 50, 0, 0.0, 2783.2, 824, 17483, 2007.5, 4152.599999999999, 12992.449999999997, 17483.0, 0.4469153899783693, 0.2919789022417276, 3.163689604971487], "isController": false}, {"data": ["GET List Specific Product - Buyer", 50, 0, 0.0, 951.2600000000002, 39, 4051, 857.0, 2111.7999999999997, 2632.2999999999965, 4051.0, 0.4263628689104723, 0.3601600406323814, 0.1457294962096341], "isController": false}, {"data": ["GET List Product - Seller", 50, 0, 0.0, 2936.8399999999997, 657, 9823, 2184.0, 6782.499999999996, 9420.549999999997, 9823.0, 0.4505153896057089, 0.314568851140705, 0.15134501369566786], "isController": false}, {"data": ["GET Categories", 50, 0, 0.0, 340.7399999999999, 22, 1330, 155.0, 1110.5, 1184.8999999999994, 1330.0, 0.5554136165202226, 1.6092892580229499, 0.10088567643824356], "isController": false}, {"data": ["GET Created Order - Buyer", 50, 0, 0.0, 990.74, 358, 3593, 937.5, 1866.3999999999996, 2043.0999999999992, 3593.0, 0.4263919565421318, 0.49135010617159713, 0.14199185271569037], "isController": false}, {"data": ["POST Sign In Users - Seller", 50, 0, 0.0, 765.88, 247, 1963, 749.5, 1123.2, 1371.0999999999979, 1963.0, 0.5534218070328843, 0.26374007991410897, 0.14538131454281825], "isController": false}, {"data": ["GET Specific Categories", 50, 0, 0.0, 363.42, 30, 1955, 164.0, 1294.5999999999995, 1370.6499999999999, 1955.0, 0.5553149190906164, 0.2028200974022368, 0.10195234842679284], "isController": false}, {"data": ["PUT Update Order - Buyer", 50, 0, 0.0, 1503.9800000000002, 219, 11598, 834.0, 2047.8, 8990.0, 11598.0, 0.43160375322623806, 0.27944657069237877, 0.16522331178191926], "isController": false}, {"data": ["GET List Product - Buyer", 50, 0, 0.0, 2946.38, 835, 8965, 2086.0, 7569.499999999999, 8881.05, 8965.0, 0.42188040534269344, 1.9388370972096831, 0.1639730481703047], "isController": false}, {"data": ["POST Sign In Users - Buyer", 50, 0, 0.0, 873.1999999999999, 172, 3341, 826.5, 1309.1999999999998, 2694.049999999997, 3341.0, 0.5492875740165006, 0.2617698594922386, 0.1442952709086315], "isController": false}, {"data": ["POST Create Users - Buyer", 50, 0, 0.0, 1428.9800000000002, 149, 3453, 1124.5, 2700.8999999999996, 3444.9, 3453.0, 0.5462451111062556, 0.30246189257543643, 0.8130197010127383], "isController": false}, {"data": ["PATCH Update Order - Seller", 50, 0, 0.0, 1075.04, 210, 3594, 918.5, 1963.7999999999988, 3590.45, 3594.0, 0.4299928621184888, 0.27714383691230726, 0.2709542912212657], "isController": false}, {"data": ["POST Create Users - Seller", 50, 0, 0.0, 922.1199999999999, 310, 3455, 894.5, 1410.3, 1594.6499999999999, 3455.0, 0.5541885571146727, 0.30794266503735235, 0.8263146218494382], "isController": false}, {"data": ["POST Create Order - Buyer", 50, 0, 0.0, 2118.7200000000003, 367, 19432, 1226.0, 3578.7999999999997, 6016.249999999977, 19432.0, 0.41554469598750043, 0.2722954013746219, 0.16840922737774675], "isController": false}, {"data": ["GET Specific Product -Seller", 50, 0, 0.0, 1370.9999999999998, 274, 3403, 1117.5, 2060.3, 2892.6499999999965, 3403.0, 0.44707523382034725, 0.3112935954237379, 0.15324551471771672], "isController": false}, {"data": ["DELETE Delete Product - Seller", 50, 0, 0.0, 872.8399999999998, 373, 3064, 823.0, 1383.7, 1743.3999999999983, 3064.0, 0.43006313326796375, 0.1310348609175827, 0.20061773193304777], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 900, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
