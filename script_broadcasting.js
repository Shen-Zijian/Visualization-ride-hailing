// 创建地图并设置中心和缩放级别
var mymap = L.map('mapid', {zoomControl: false}).setView([40.743132,-73.9893927], 14);

// 添加地图图层
// 创建地图并设置中心和缩放级别

// 添加暗色底图图层
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWF0dGp3YW5nIiwiYSI6ImNsaXB5NDN1cTAzMnAza28xaG54ZWRrMzgifQ.cUju1vqjuW7XmAuO2iEZmg'  // 将此处替换为你的Mapbox访问令牌
}).addTo(mymap);


// 图例
fetch('broadcasting.json')
    .then(response => response.json())
    .then(data => {
        // 颜色选项
        var colors_bar = {"rider":'#FF0000', "taxi":'#00FF00', "bus":'#FFFF00', "other":'#00FFFF'};
        // var colors = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFF00', '#FFFFFF'];
        var legend = L.control({position: 'topleft'});
        legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    // 添加白色背景并添加一些padding
    div.style.backgroundColor = '#333333';
    div.style.padding = '10px';
    div.style.color = 'white';
    // div.innerHTML += "<h4>Legend</h4>";

    // for (var vehicleType in colors_bar) {
    //     div.innerHTML +=
    //         '<i style="background:' + colors_bar[vehicleType] + '; width: 6px; height: 6px; display: inline-block; border-radius: 50%;"></i> ' +'  ' +
    //         vehicleType + '<br>';
    // }
    div.innerHTML +=
        '<img src="./img/taxi.png" width="20" height="20"> Available Driver <br>';

    // div.innerHTML +=
    //     '<img src="./img/bus.png" width="25" height="20"> Bus <br>';

    div.innerHTML +=
        '<img src="./img/rider.png" width="15" height="15"> Passenger <br>';

    // div.innerHTML +=
    //     '<img src="./img/shuttle_bus.png" width="10" height="20"> Shuttle Bus <br>';
    //
    // div.innerHTML +=
    //     '<img src="./img/bus_station.png" width="20" height="20"> Bus Station <br>';
    //
    // div.innerHTML +=
    //     '<img src="./img/subway_station.png" width="20" height="20"> Subway Station <br>';
    // div.innerHTML +=
    //
    //     '<img src="./img/meeting_point.png" width="20" height="20"> Meeting Point';
    return div;
};
legend.addTo(mymap);

//图标旋转
// 获取下一个点的位置
function getNextLatLng(routeID, index) {
    if (index < data[routeID].length - 1) {
        return [data[routeID][index + 1][0], data[routeID][index + 1][1]];
    } else {
        return null;
    }
}

// 计算两个点之间的角度
function calculateAngle(position1, position2) {
  var dy = position2[1] - position1[1];
  var dx = position2[0] - position1[0];
  var theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI; // Radians to Degrees

  return theta;
}

// 车辆轨迹
const interval = 1000;
// 为每个routeID创建一个marker，并存储在一个字典中
var markers = {};
var i = 0;

//图标
var busIcon = L.icon({
    iconUrl: './img/bus.png',
    iconSize: [25, 20], // 图标的大小
});

var cabIcon = L.icon({
    iconUrl: './img/taxi.png',
    iconSize: [20, 20], // 图标的大小
});

var riderIcon = L.icon({
    iconUrl: './img/broadcasting.png',
    iconSize: [150, 125], // 图标的大小
});

var shuttlebusIcon = L.icon({
    iconUrl: './img/shuttle_bus.png',
    iconSize: [10, 20], // 图标的大小
});

fetch('broadcasting.json')
    .then(response => response.json())
    .then(data => {
        for (var routeID in data) {
            console.log(routeID)
            var vehicon;
            var positionData = data[routeID][0]; // 获取包含经度、纬度和类型的数组
            var nextPositionData = data[routeID][1];
            switch(positionData[2]) { // 使用数组的第三个元素（类型）来选择图标
                case 'bus':
                    vehicon = busIcon;
                    break;
                case 'taxi':
                    vehicon = cabIcon;
                    break;
                case 'rider':
                    vehicon = riderIcon;
                    break;
                default:
                    vehicon = shuttlebusIcon;
            }
            var position = [[positionData[0], positionData[1]],[nextPositionData[0],nextPositionData[1]]];
            var marker = L.Marker.movingMarker(position, [interval, interval], {
                autostart: false,
                loop: false,
                icon: vehicon,
            }).addTo(mymap);


            markers[routeID] = marker;
            (function(routeID) {
                marker.on('click', function() {
                    var infoDiv = document.getElementById('info');
                    infoDiv.innerText = 'Vehicle ID: ' + routeID;
                });
            })(routeID);
        }
    });

// 每20000毫秒更新一次每个点的位置
setInterval(function() {
    for (var routeID in data) {
        // 移动到下一个点，移动时间为20000毫秒
        var oldPos = data[routeID][0];
        var newPos = data[routeID][1];
        console.log(data[routeID][0])
        data[routeID].push(data[routeID].shift());  // 将刚用过的点移到数组的末尾，以便下次使用
        // 使用 moveTo 方法来更新标记的位置并开始移动
        markers[routeID].moveTo(newPos, interval)
        markers[routeID].start();
        var angle = calculateAngle(oldPos, newPos);
        // 更新标记的旋转角度
        console.log(data[routeID][0][2])
        if (data[routeID][0][2] != 'rider'){
            markers[routeID].setRotationAngle(angle);
        }

    }
}, 1000);
});

// 创建一个脉冲图标

// 创建标记并添加到地图上
// L.marker([40.743132, -73.9893927], {icon: pulseIcon}).addTo(mymap);
// {
//     1:{car1:speed1,car2:speed2},
//
//     2:{car1:speed3,car2:speed4},
//
//     time3:{car2:speed5,}
// }