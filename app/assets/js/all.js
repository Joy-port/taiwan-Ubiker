// import { bikeCityData ,bikeAvaData, bikeShapeData } from './testData.js';
// console.log(bikeCityData,bikeAvaData,bikeShapeData);

let totalCityData =[
  {
    cityName:{
      Ch: '臺北市',
      En: 'Taipei'
    },
    cityPosition:{
      lon: 121.5174,
      lat: 25.0462
    }
  },
  {
    cityName:{
      Ch: '新北市',
      En: 'NewTaipei'
    },
    cityPosition:{
      lon:121.4639425,
      lat:25.0143926
    }
  },
  {
    cityName:{
      Ch: '桃園市',
      En: 'Taoyuan'
    },
    cityPosition:{
      lon:121.3133955,
      lat:24.989306
    }
  },
  {
    cityName:{
      Ch: '新竹市',
      En: 'Hsinchu'
    },
    cityPosition:{
      lon:120.9715962,
      lat:24.801841
    }
  },
  {
    cityName:{
      Ch: '苗栗縣',
      En: 'MiaoliCounty'
    },
    cityPosition:{
      lon:120.8223152,
      lat:24.5699868
    }
  },
  
  {
    cityName:{
      Ch: '臺中市',
      En: 'Taichung'
    },
    cityPosition:{
      lon:120.685056,
      lat:24.136941
    }
  },
  {
    cityName:{
      Ch: '臺南市',
      En: 'Tainan'
    },
    cityPosition:{
      lon:120.212319,
      lat:22.997212
    }
  },
  {
    cityName:{
      Ch: '嘉義市',
      En: 'Chiayi'
    },
    cityPosition:{
      lon:120.4413128,
      lat:23.4791004
    }
  },
  {
    cityName:{
      Ch: '高雄市',
      En: 'Kaohsiung'
    },
    cityPosition:{
      lon:120.3019452,
      lat:22.6384542
    }
  },
  {
    cityName:{
      Ch: '屏東縣',
      En: 'PingtungCounty'
    },
    cityPosition:{
      lon:120.4861926,
      lat:22.669248
    }
  },
  {
    cityName:{
      Ch: '金門縣',
      En: 'KinmenCounty'
    },
    cityPosition:{
      lon:118.297844,
      lat:24.409293
    }
  },
];

let tabStatus = '';
let rentTab = 'rent';
let city = 'Taipei';

let routeLayer = null;
let geo = null;
let routeName ='';
let routeStart = null;
let routeEnd = null;
let routeStartName = '';
let routeEndName = '';
let startIcon =[];
let endIcon = [];

let stationData = [];
let availibleData =[];
let filterData = [];
let longitude = null;
let latitude = null;
let centerPosition = [longitude, latitude];


const tabs = document.querySelector('.js-map-tabs');
const tabsRenderList = document.querySelector('.js-render-list');
const searchCityList  = document.querySelector('.js-city-list');
const locationBtn = document.querySelector('.js-location-btn');

// 清單內容
const contentList = document.querySelector('.js-content-list'); 

//expend btn
const expendBtn = document.querySelector('.js-expend-btn');
const expendBox = document.querySelector('.js-expend-box');


//初始畫面
let map = L.map('map', {
    center: [25.0408578889,121.567904444],
    zoom: 16
});

//leaflet mapbox 地圖
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiamQ5OTk4NSIsImEiOiJja3c0aWozamdheXIzMm5xcGk3bXQ1NHh0In0.gHWgqH8a5-e31M3zhV0i_w'
}).addTo(map);

//地圖標示的icon

var greenIcon = new L.Icon({
iconUrl: './assets/images/icon-green.svg',
iconSize: [50, 50],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
shadowSize: [41, 41]
});

var redIcon = new L.Icon({
  iconUrl: './assets/images/icon-red.svg',
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var grayIcon = new L.Icon({
  iconUrl: './assets/images/icon-gray.svg',
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//代表當場位置
var blueIcon = new L.Icon({
  iconUrl: '../../assets/images/icon-location.svg',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var startIconPic = new L.Icon({
  iconUrl: './assets/images/icon-bike.svg',
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var endIconPic = new L.Icon({
  iconUrl: './assets/images/icon-flag.svg',
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//群組化
let markers = L.markerClusterGroup({
  iconCreateFunction(cluster) {
    const markers = cluster.getAllChildMarkers();
    var c = ' marker-cluster-';
    if (markers.length <= 5 && markers.length > 0) {
      c += 'small';
    } 
    else if (markers.length <= 15 && markers.length>5) {
      c += 'medium';
    } 
    else {
      c += 'large';
    }
    return L.divIcon({
      html: `<div class="d-flex justify-content-center align-items-center marker-cluster">${markers.length}</div>`,
      className: "marker-cluster"+ c,
      iconSize: L.point(40, 40),
    });
  },
});

//全域route & station 切換分頁功能
//change tab 切換map 地圖功能標籤


//切換tab時增加樣式
function changeTabs(e){
  tabStatus = e.target.closest('li').dataset.tab;
  let tabs = document.querySelectorAll('.js-map-tabs li');
  tabs.forEach(item => {
    item.classList.remove('active');
  });
  e.target.classList.add('active');
  
  updateTabContent();
}

//列出城市select內容
function renderCityOptionList(){
  let str = '';
  totalCityData.forEach(item=>{
    let content = `<option value="${item.cityName.En}">${item.cityName.Ch}</option>`;
    str += content;
  })
  searchCityList.innerHTML = str;
}

function getCityName(e){
  city = e.target.value;
  searchCityList.value = city;
}

//將點擊到的清單增加樣式
contentList.addEventListener('click',addActiveColor);

function addActiveColor(e){
  let contents = document.querySelectorAll('.js-content-list li');
  contents.forEach(item => {
    item.classList.remove('active');
  });
  e.target.closest('li').classList.add('active');
}

//切換分頁渲染出內容
//綁定監聽
function updateTabContent(){

  if(tabStatus=== 'route'){
    locationBtn.innerHTML =` 
    <span class="material-icons me-3"> search </span>
      搜尋
  `;
  tabsRenderList.style.height = 'calc(100vh - 400px)';
  renderCityOptionList();
  searchCityList.addEventListener('change',getCityName);

  
  removeRouteLayers();
  removeMarkers();
  if(filterData.length!==0){
    filterData = [];
  };
  

  //抓資料用
  getRouteData();
  //測試用
  // showRouteList(bikeShapeData);

  contentList.removeEventListener('click', showStationOnMap);
  searchCityList.removeEventListener('change', getStationData); 

  contentList.addEventListener('click', showRouteOnMap);
  searchCityList.addEventListener('change', getRouteData);


  }else if(tabStatus=== 'station'){
    locationBtn.innerHTML =` 
    <span class="material-icons me-3"> near_me </span>
    開啟定位服務
  `;
  tabsRenderList.style.height = 'calc(100vh - 400px)';
  renderCityOptionList();
  searchCityList.addEventListener('change',getCityName);

  removeRouteLayers();
  removeMarkers();
  if(filterData.length!==0){
    filterData = [];
  };
  
  //抓資料用
  getStationData();
  //測試用
  // bikeAvaData.forEach(avaItem =>{
  //   bikeCityData.forEach(cityItem =>{
  //       if(avaItem.StationUID == cityItem.StationUID){
  //           cityItem.StationTitle = cityItem.StationName.Zh_tw.split("_")[1];
  //           cityItem.BikeType = cityItem.StationName.Zh_tw.split("_")[0];
  //           cityItem.AvailableRentBikes = avaItem.AvailableRentBikes;
  //           cityItem.AvailableReturnBikes = avaItem.AvailableReturnBikes;
  //           cityItem.UpdateTime = avaItem.UpdateTime;

  //           filterData.push(cityItem);
  //       };
  //   });
  //   });
  // drawBikeStationOnMap(filterData);
  // showBikeStationList(filterData);

  searchCityList.removeEventListener('change', getRouteData);
  contentList.removeEventListener('click', showRouteOnMap);

  contentList.addEventListener('click', showStationOnMap);
  searchCityList.addEventListener('change', getStationData); //預設抓台北資料 || select 清單
  locationBtn.addEventListener('click', getCurrentPosition); //開啟定位資訊
  };
}

//route
//預設route 要顯示taipei 路線圖
//route bike 選擇城市列出城市的route
function getRouteData(){
  if(filterData.length !== 0){
    filterData = [];
  };
  axios({
    method: 'get',
    url: `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${city}?$format=JSON`,
    header: GetAuthorizationHeader()
}).then(function(res){
    filterData = res.data; 
    showRouteList(filterData);
  });
}

//將route資料列出在清單上
function showRouteList(data){
  let str = '';
  data.forEach(item =>{
    let content = `
    <li class="card border-0 card-list-color p-3 mb-2" data-id="${item.RouteName}">
    <div class="d-flex justify-content-between align-items-center flex-wrap border-bottom pb-2 mb-3">
    <p class="h4">${item.RouteName}</p>
    <div class="position-relative">
    <input class="" type="checkbox" name="route checkBox" id="checkBox" />
    <!-- <span class="material-icons align-middle position-absolute top-50 start-50 translate-middle fs-2">
    favorite_border
    </span> -->
    </div>
    
    </div>
    <div class="d-flex justify-content-between align-items-center gap-3">
      <div class="d-flex flex-column justify-content-between gap-3">
      <div class="d-flex gap-5 h-100">
      <span class="material-icons-outlined">
      directions_bike
      </span>
      <p class="">${item.RoadSectionStart=== undefined ? '---' : item.RoadSectionStart}</p>
      </div>
      <div class="d-flex gap-5">
      <span class="material-icons">
        flag
        </span>
        <p class="">${item.RoadSectionEnd=== undefined ? '---' : item.RoadSectionEnd}</p>
        </div>
      </div>
      <p class="btn btn-white rounded-pill w-30">車道長度 </br> <span class="fs-3 fw-bold">${item.CyclingLength}</span> km</p>
    </div>
</li>
`;
    str += content;
  })
  contentList.innerHTML = str;  
}

//用戶點擊路線之後，在地圖上畫路出線圖
function showRouteOnMap(e){
  removeRouteLayers();

  //要改為filterData
  filterData.forEach(item =>{
    if(item.RouteName === e.target.closest('li').dataset.id ){
      geo = item.Geometry;
      routeName = item.RouteName;
      routeStartName = item.RoadSectionStart;
      routeEndName = item.RoadSectionEnd;
    };
  });

  polyLine(geo);
}
//分解路線經緯線內容轉為一條線
function polyLine(geo){
   // 建立一個 wkt 的實體
   const wicket = new Wkt.Wkt();
   const geojsonFeature = wicket.read(geo).toJson()

   routeStart = geojsonFeature.coordinates[0][0];
   routeEnd = geojsonFeature.coordinates[0][geojsonFeature.coordinates[0].length - 1];
   
   const reverseLatlngs = geojsonFeature.coordinates[0];
   reverseLatlngs.forEach(item => item.reverse());
   const antPath = L.polyline.antPath;
  routeLayer = antPath(reverseLatlngs,{
    paused: false,
    reverse: false,
    delay: 2000,
    dashArray: [10, 20],
    weight: 6,
    opacity: 0.5
   });
   routeLayer.addTo(map);
   // zoom the map to the layer
  map.fitBounds(routeLayer.getBounds());

  let markIcon = null;
  if(routeStart === routeEnd){
    markIcon = startIconPic;
  }else{
    markIcon = endIconPic;
  };
  addStartIcon();
  addEndIcon(markIcon);

}

function addStartIcon(){

 startIcon = new L.marker(routeStart, { icon: startIconPic }).bindPopup(
    `<div class="mb-0 p-5 flex-column">
        <h3 class="h3">${routeName}</h3>
      <div class="d-flex justify-content-between align-items-center w-100">
        <h2 class="h6">${routeStartName}</h2>
        <h5 class="badge fs-7 bg-success text-primary">起點</h5>
      </div>
    </div>
    `
  ).addTo(map);

}

function addEndIcon(markIcon){
 endIcon = new L.marker(routeEnd, { icon: markIcon }).bindPopup(
    `<div class="mb-0 p-5 flex-column">
      <h3 class="h3">${routeName}</h3>
      <div class="d-flex justify-content-between align-items-center w-100">
        <h2 class="h6">${routeEndName}</h2>
        <h5 class="badge fs-7 bg-warning-3 text-warning">終點</h5>
      </div>
    </div>
    `
  ).addTo(map);
}

//station tab

function getStationData(){
  if(filterData.length !== 0){
    filterData = [];
    stationData = [];
    availibleData =[];
  };

  axios({
    method: 'get',
    url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/${city}?$format=JSON`,
    header: GetAuthorizationHeader()
}).then(function(res){
    stationData = res.data;
    getAvailableCityData(city);
});
}



function getAvailableCityData(city){
  axios({
    method: 'get',
    url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/${city}?$format=JSON`,
    header: GetAuthorizationHeader()
}).then(function(res){
    availibleData = res.data; 
    
    availibleData.forEach(availableItem =>{
        stationData.forEach(stationItem =>{
            if(availableItem.StationUID === stationItem.StationUID){
                stationItem.StationTitle = stationItem.StationName.Zh_tw.split("_")[1];
                stationItem.BikeType = stationItem.StationName.Zh_tw.split("_")[0];
                stationItem.AvailableRentBikes = availableItem.AvailableRentBikes;
                stationItem.AvailableReturnBikes = availableItem.AvailableReturnBikes;
                stationItem.UpdateTime = availableItem.UpdateTime;

                filterData.push(stationItem);
            };
        })
    });
    drawBikeStationOnMap(filterData);
    showBikeStationList(filterData);

    //跑到點擊的城市範圍
    getCityPosition(city);
});
}

//顯示城市的map view
function getCityPosition(city){
let lat = '';
let lng = '';

  totalCityData.forEach(item => {
    if(item.cityName.En === city){
      lat = item.cityPosition.lat;
      lng = item.cityPosition.lon;
    };
  });

  map.panTo([lat,lng], 16);
  map.setView([lat,lng], 16);
}

//取得瀏覽器當下點擊的地理位置 + nearby 的bike 資料 ＋預設情況
// locationBtn.addEventListener('click', getCurrentPosition);
function getCurrentPosition(){
  if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      longitude = position.coords.longitude; 
      latitude = position.coords.latitude; 
      //地圖上畫出當場位置
      L.marker([latitude,longitude], {icon: blueIcon}).addTo(map);
      L.circle([latitude,longitude], {radius: 30}).addTo(map);

      // 從當場位置設定 view 的位置
      map.panTo([latitude,longitude], 12);
      map.setView([latitude,longitude], 15);

      // 將經緯度當作參數傳給 getData 執行，得到附近station 資料
      getNearByStationData(longitude, latitude);
    },
    // 錯誤訊息
    function (e) {
      const msg = e.code;
      const dd = e.message;
      console.error(msg)
      console.error(dd)
      alert('無法取得您的位置資訊，請確認是否開啟定位設定');
    }
  )
}
}
//透過shape Geometry 得到nearby 資訊
function getNearByStationData(longitude, latitude){
  axios({
      method: 'get',
      url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NearBy?$top=30&$spatialFilter=nearby(${latitude},${longitude},1000)&$format=JSON`,
      header: GetAuthorizationHeader()
  }).then(function(res){
      stationData = res.data;
      getAvailableData(longitude, latitude);
  });
}

//需要同時整合這兩端的資料
function getAvailableData(longitude, latitude){
  axios({
      method: 'get',
      url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/NearBy?$top=30&$spatialFilter=nearby(${latitude},${longitude},1000)&$format=JSON`,
      header: GetAuthorizationHeader()
  }).then(function(res){
      availibleData = res.data; 

      availibleData.forEach(availableItem =>{
          stationData.forEach(stationItem =>{
              if(availableItem.StationUID === stationItem.StationUID){
                  stationItem.StationTitle = stationItem.StationName.Zh_tw.split("_")[1];
                  stationItem.BikeType = stationItem.StationName.Zh_tw.split("_")[0];
                  stationItem.Service = stationItem.ServiceType===1? '正常營運':stationItem.ServiceType===2? '暫停營運': '停止營運';
                  stationItem.AvailableRentBikes = availableItem.AvailableRentBikes;
                  stationItem.AvailableReturnBikes = availableItem.AvailableReturnBikes;
                  stationItem.UpdateTime = availableItem.UpdateTime;

                  filterData.push(stationItem);
              };
          })
      });

      drawBikeStationOnMap(filterData);
      showBikeStationList(filterData);
  });
}
//將整合到的資料畫到地圖上
//暫時以可借的區域劃分 || if rentTab = 'rent' || rentTab = 'return'
function drawBikeStationOnMap(inputData){
  let markColor = '';
  
  // rentTab = 'rent';
  inputData.forEach(item => {
    //先用可借的數量來做判斷
    if(parseInt(item.AvailableRentBikes)>0){
        markColor = greenIcon;
    }else if(parseInt(item.AvailableRentBikes)<=0){
        markColor = redIcon;
    };
      markers.addLayer(L.marker([item.StationPosition.PositionLat,item.StationPosition.PositionLon], {icon: markColor})
       .bindPopup(`
           <h1>${item.StationTitle}</h1>
           <div>
           <p class="${item.ServiceType === 1 ? 'text-primary':item.ServiceType===2? 'text-warning': 'text-danger'}">&bull; ${item.ServiceType === 1 ? '正常營運':item.ServiceType===2? '暫停營運': '停止營運'}</p>
           <p>${item.BikeType}</p>
           </div>
           <div>
               <a href="#" id="${parseInt(item.AvailableRentBikes)>5 ?'btn-primary': parseInt(item.AvailableRentBikes)<=5 && parseInt(item.AvailableRentBikes)> 0 ? 'btn-secondary' :'btn-danger'}">
                   <p>可租借</p>
                   <p>${item.AvailableRentBikes} </p>
               </a>
               <a href="#" id="${parseInt(item.AvailableReturnBikes)>5 ?'btn-primary':parseInt(item.AvailableReturnBikes)<=5 && parseInt(item.AvailableReturnBikes)>0 ? 'btn-secondary' :'btn-danger'}">
                   <p>可歸還</p>
                   <p>${item.AvailableReturnBikes}</p>
               </a>
           </div>`))
      .addTo(map)
      .on('click',getClickPosition);
  });

  map.addLayer(markers);
}

//click 到popUp的地方時，改變位置
function getClickPosition(e){
let lat = String(e.latlng.lat);
let lng = String(e.latlng.lng);
  map.panTo([lat,lng], 16);
  map.setView([lat,lng], 16);
}

//列出站牌清單
function showBikeStationList(inputData){
  let str ='';

  inputData.forEach(item =>{
    let content = `
    <li class="card border-0 card-list-color p-3 mb-2" data-id="${item.StationUID}">
    <div class="d-flex justify-content-between align-items-center flex-wrap border-bottom pb-2 mb-3">
    <p class="h4">${item.StationTitle}</p>
    <p class="badge rounded-pill fs-6 fw-normal py-1 px-2 ${item.BikeType==='YouBike1.0'?'bg-light text-gray-2':'bg-success'}">${item.BikeType}</p>
    </div>
      <p class="mb-3">${item.StationAddress.Zh_tw} </p>
    <div class="d-flex justify-content-between align-items-center gap-3">
      <p class="btn btn-white w-50 ${parseInt(item.AvailableRentBikes)>5 ?'text-primary': parseInt(item.AvailableRentBikes)<=5 && parseInt(item.AvailableRentBikes)> 0 ? 'text-secondary' :'text-danger'}">可租借 </br> <span class="fs-3 fw-bold">${item.AvailableRentBikes}</span> 輛</p>
      <p class="btn btn-white w-50 ${parseInt(item.AvailableReturnBikes)>5 ?'text-primary': parseInt(item.AvailableReturnBikes)<=5 && parseInt(item.AvailableReturnBikes)> 0 ? 'text-secondary' :'text-danger'}">可歸還 </br> <span class="fs-3 fw-bold">${item.AvailableReturnBikes}</span> 輛</p>
    </div>
</li>
`;
    str += content;
  });
  contentList.innerHTML = str;
}

//點擊清單 地圖popUp自動出現且跑到該站牌
// stationList.addEventListener('click', showStationOnMap);

function showStationOnMap(e){
  e.preventDefault();
  // console.log(e.target.closest('li').dataset.id);
  let lon ='';
  let lat='';
  let markColor ='';
  let id = e.target.closest('li').dataset.id;
  
  filterData.forEach(item =>{
    if(item.StationUID === id){
      lon = item.StationPosition.PositionLon;
      lat = item.StationPosition.PositionLat;

    if(parseInt(item.AvailableRentBikes)>0){
        markColor = greenIcon;
    }else if(parseInt(item.AvailableRentBikes)<0){
        markColor = redIcon;
    };

    L.marker([lat,lon], {icon: markColor})
    .bindPopup(`
    <h1>${item.StationTitle}</h1>
    <div>
    <p class="${item.ServiceType === 1 ? 'text-primary':stationItem.ServiceType===2? 'text-warning': 'text-danger'}">&bull; ${item.ServiceType === 1 ? '正常營運':stationItem.ServiceType===2? '暫停營運': '停止營運'}</p>
    <p>${item.BikeType}</p>
    </div>
    <div>
        <a href="#" id="${parseInt(item.AvailableRentBikes)>5 ?'btn-primary': parseInt(item.AvailableRentBikes)<=5 && parseInt(item.AvailableRentBikes)> 0 ? 'btn-secondary' :'btn-danger'}">
            <p>可租借</p>
            <p>${item.AvailableRentBikes}</p>
        </a>
        <a href="#" className="btn ${parseInt(item.AvailableRentBikes)>5 ?'btn-primary':parseInt(item.AvailableRentBikes)<=5 && parseInt(item.AvailableRentBikes)>0 ? 'btn-secondary' :'btn-danger'}" id="${parseInt(item.AvailableReturnBikes)>5 ?'btn-primary':parseInt(item.AvailableReturnBikes)<=5 && parseInt(item.AvailableReturnBikes)>0 ? 'btn-secondary' :'btn-danger'}">
            <p>可歸還</p>
            <p>${item.AvailableReturnBikes}</p>
        </a>
    </div>`)
   .addTo(map).openPopup()
   .on('click',getClickPosition);
  };
  });

  map.panTo([lat,lon], 16);
  map.setView([lat,lon], 16);
  
}

//移除路線
function removeRouteLayers(){
  if(routeLayer) {
    map.removeLayer(routeLayer);
    map.removeLayer(startIcon);
    map.removeLayer(endIcon);
  };
}

//移除腳踏車的站點marker
function removeMarkers(){
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer)
    }
  })
}

//切換rent tab

function changeRentTab(e){
  rentTab = e.target.dataset.rentTab;
}

//初始化
function init(){
  //地圖位置預設
  longitude = 121.0082785 ;  // 經度 預設為台北市
  latitude = 23.7072015;  // 緯度
  map.setView([23.7072015,121.0082785], 8); //需要轉乘數字不能用字串格式

  //預設分頁為
  locationBtn.innerHTML =` 
    <span class="material-icons me-3"> search </span>
      搜尋
  `;
  tabsRenderList.style.height = 'calc(100vh - 400px)';
  renderCityOptionList();
  searchCityList.addEventListener('change',getCityName);
  
  //抓資料用
  getRouteData();
  //測試用
  // showRouteList(bikeShapeData);
  contentList.addEventListener('click', showRouteOnMap);
  searchCityList.addEventListener('change', getRouteData);

  tabs.addEventListener('click', changeTabs);
  
}
init();

//tdx 資料驗證使用
function GetAuthorizationHeader() {
  var AppID = 'bbbf44c0e2534c17bbf5553afe5cfb24';
  var AppKey = 'YLongjG_6wqXgBm5FQ4LIpW7bPQ';

  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  var HMAC = ShaObj.getHMAC('B64');
  var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

  return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/}; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}


//expend 按鈕效果


expendBtn.addEventListener('click' , changeExpendStatus);

function changeExpendStatus(e){
const btnContent = document.querySelector('.js-expend-btn span')
  if(e.target.nodeName ==="SPAN" || e.target.nodeName === "BUTTON"){
    expendBox.classList.toggle('top-80');
    expendBox.classList.toggle('top-50');

    if(expendBox.classList.contains('top-50')){
      btnContent.style.transform = 'rotate(180deg)';
    }else{
      btnContent.style.transform = 'rotate(0deg)';
    };
  };
}