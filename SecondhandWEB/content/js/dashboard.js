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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.29875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2325, 500, 1500, "GET Profile - Seller"], "isController": false}, {"data": [0.3275, 500, 1500, "POST Create Product - Seller"], "isController": false}, {"data": [0.3675, 500, 1500, "PUT Update Product - Seller"], "isController": false}, {"data": [0.025, 500, 1500, "PUT Update Profile - Buyer"], "isController": false}, {"data": [0.5, 500, 1500, "GET List Product - Seller"], "isController": false}, {"data": [0.5625, 500, 1500, "GET Categories"], "isController": false}, {"data": [0.315, 500, 1500, "GET Profile - Buyer"], "isController": false}, {"data": [0.0125, 500, 1500, "POST Sign In Users - Seller"], "isController": false}, {"data": [0.0075, 500, 1500, "PUT Update Profile - Seller"], "isController": false}, {"data": [0.6, 500, 1500, "GET Specific Categories"], "isController": false}, {"data": [0.4075, 500, 1500, "POST Create Offers - Buyer"], "isController": false}, {"data": [0.4675, 500, 1500, "GET Created Offer User - Seller"], "isController": false}, {"data": [0.435, 500, 1500, "PUT Update Offers - Seller"], "isController": false}, {"data": [0.04, 500, 1500, "POST Sign In Users - Buyer"], "isController": false}, {"data": [0.0175, 500, 1500, "POST Create Users - Buyer"], "isController": false}, {"data": [0.1, 500, 1500, "POST Create Users - Seller"], "isController": false}, {"data": [0.5375, 500, 1500, "GET Specific Product -Seller"], "isController": false}, {"data": [0.4225, 500, 1500, "DELETE Delete Product - Seller"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 0, 0.0, 1619.0336111111121, 40, 11505, 1414.5, 2920.0, 3210.7999999999993, 4437.9299999999985, 12.214776486555262, 21.53748992705064, 23.76702460980575], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Profile - Seller", 200, 0, 0.0, 1620.4300000000003, 81, 3739, 1657.0, 2519.8, 2816.9, 3730.1200000000026, 0.721662132222936, 0.9849067184038278, 0.2974037302715615], "isController": false}, {"data": ["POST Create Product - Seller", 200, 0, 0.0, 1633.9949999999992, 419, 7059, 1358.0, 2128.800000000001, 5949.15, 6965.83, 0.7406721599851867, 1.513582365058791, 5.882470373113601], "isController": false}, {"data": ["PUT Update Product - Seller", 200, 0, 0.0, 1333.5500000000002, 379, 4472, 1227.5, 1839.9, 2313.749999999999, 2700.210000000002, 0.7605517042062312, 1.5510649862910557, 6.043949906262003], "isController": false}, {"data": ["PUT Update Profile - Buyer", 200, 0, 0.0, 2644.1200000000017, 1121, 11505, 2511.0, 3619.9, 4186.199999999999, 8101.450000000027, 0.7277384798998632, 0.9908187831121008, 5.094144485425217], "isController": false}, {"data": ["GET List Product - Seller", 200, 0, 0.0, 1098.0550000000007, 76, 6637, 949.5, 1507.1000000000001, 1805.3999999999996, 6633.8200000000015, 0.7417297136923305, 1.5328778939048362, 0.3165389500815903], "isController": false}, {"data": ["GET Categories", 200, 0, 0.0, 908.9899999999999, 40, 2181, 949.0, 1636.1000000000004, 1787.0, 2005.890000000001, 0.7396668540489363, 0.772894076008166, 0.12713024053966093], "isController": false}, {"data": ["GET Profile - Buyer", 200, 0, 0.0, 1430.8100000000002, 67, 3531, 1332.5, 2268.6, 2918.4999999999995, 3514.4000000000015, 0.7305055463633608, 0.9946218241271372, 0.3010481841458381], "isController": false}, {"data": ["POST Sign In Users - Seller", 200, 0, 0.0, 2461.26, 832, 4055, 2424.5, 3248.4, 3543.7999999999993, 3979.9700000000003, 0.70194649763795, 1.203937640169941, 0.19673695783407386], "isController": false}, {"data": ["PUT Update Profile - Seller", 200, 0, 0.0, 3020.99, 1100, 6475, 2963.5, 4162.6, 4512.699999999999, 5615.900000000005, 0.716132312606077, 0.9769471413788411, 5.0155382528788515], "isController": false}, {"data": ["GET Specific Categories", 200, 0, 0.0, 849.7900000000004, 71, 3770, 889.0, 1379.9, 1572.1499999999996, 1789.98, 0.7413915177396455, 0.531427123067285, 0.12887469741958682], "isController": false}, {"data": ["POST Create Offers - Buyer", 200, 0, 0.0, 1126.5550000000005, 83, 2522, 997.5, 1890.5000000000002, 2107.2999999999997, 2414.2400000000007, 0.7642017339737344, 2.2067966908154415, 0.3962803913477079], "isController": false}, {"data": ["GET Created Offer User - Seller", 200, 0, 0.0, 1007.9949999999994, 72, 2733, 850.5, 1795.8, 2268.7999999999997, 2634.7700000000013, 0.7664509107352947, 2.2319589431408393, 0.3240949651839674], "isController": false}, {"data": ["PUT Update Offers - Seller", 200, 0, 0.0, 1022.6399999999994, 53, 2810, 748.0, 1924.8000000000002, 2298.65, 2747.1900000000014, 0.7701786814540973, 2.219682788672597, 0.3723031712107209], "isController": false}, {"data": ["POST Sign In Users - Buyer", 200, 0, 0.0, 2460.605, 490, 3987, 2465.5, 3062.9, 3197.7, 3874.6500000000005, 0.7128295054388891, 1.2213539995972513, 0.1997871758407824], "isController": false}, {"data": ["POST Create Users - Buyer", 200, 0, 0.0, 2472.9449999999997, 709, 3986, 2496.0, 3154.1000000000004, 3308.85, 3974.5700000000006, 0.7067812123418135, 1.211674236587943, 0.20775502433094323], "isController": false}, {"data": ["POST Create Users - Seller", 200, 0, 0.0, 2136.3000000000006, 773, 4577, 2014.5, 2961.6, 3525.5499999999997, 4467.020000000002, 0.6991955754903982, 1.198382979132508, 0.20552526193614246], "isController": false}, {"data": ["GET Specific Product -Seller", 200, 0, 0.0, 826.8500000000004, 68, 2223, 736.0, 1363.9, 1610.6999999999998, 2166.4300000000003, 0.7602539248108868, 1.5040888891264683, 0.31776238263580037], "isController": false}, {"data": ["DELETE Delete Product - Seller", 200, 0, 0.0, 1086.7250000000004, 41, 3754, 752.0, 2054.1, 2398.85, 3168.2600000000007, 0.7713490122875898, 0.6616878900133444, 0.4190820536974615], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
