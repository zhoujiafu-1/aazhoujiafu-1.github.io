require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/MapImageLayer",
	"esri/Graphic",
	"esri/core/watchUtils",
	"esri/widgets/Slider",
	"esri/layers/GraphicsLayer",
	"esri/WebMap",
	"esri/widgets/Legend",
	 "esri/layers/GeoJSONLayer",
	 "esri/geometry/geometryEngine"
	
	

], function (esriConfig,Map,MapView,FeatureLayer,Maplayer,Graphic,watchUtils,Slider,GraphicsLayer,WebMap,Legend,GeoJSONLayer,geometryEngine){
    esriConfig.apiKey = "AAPK56e3ac027f044c4089d8ceec232fc05dYaOuzVRzm8tMRqvzOvDvIEevbqJ85yppn9PacU6cy4duurJrVK9wo_8BcWO8i8bi";
	
	const citiesRenderer = {
	  type: "simple", // autocasts as new SimpleRenderer()
	  symbol: {
	    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
	    size: 5,
	    color: [0, 255, 255],
	    outline: null
	  }
	};
	
	const citiesLayer = new FeatureLayer({
	  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/WorldCities/FeatureServer/0",
	  renderer: citiesRenderer,
	  definitionExpression: "adm = 'United States of America'"
	});
	
	/******************************************************************
	 *
	 * Set up renderer for visualizing all highways with a single symbol
	 *
	 ******************************************************************/
	
	const hwyRenderer = {
	  type: "simple", // autocasts as new SimpleRenderer()
	  symbol: {
	    type: "simple-line", // autocasts as new SimpleLineSymbol()
	    width: 1,
	    color: [25, 255, 255, 0.1]
	  }
	};
	
	const hwyLayer = new FeatureLayer({
	  url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Freeway_System/FeatureServer/2",
	  renderer: hwyRenderer,
	  minScale: 0,
	  maxScale: 0,
	  title: "Freeways"
	});
	
	/******************************************************************
	 *
	 * Set up renderer for visualizing all states with a single symbol
	 *
	 ******************************************************************/
	
	const statesRenderer = {
	  type: "simple", // autocasts as new SimpleRenderer()
	  symbol: {
	    type: "simple-fill", // autocasts as new SimpleFillSymbol()
	    color: [0, 0, 0, 0],
	    outline: {
	      color: [25, 255, 255, 0.3],
	      width: 0.5
	    }
	  }
	};
	
	const statesLayer = new FeatureLayer({
	  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
	  renderer: statesRenderer
	});

    var map = new Map({
        basemap: "dark-gray",
		layers: [statesLayer, hwyLayer, citiesLayer]
		
		
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-70.71511, 24.09042],/*地图中心的经纬度坐标*/
        zoom: 5/*地图缩放级别*/
    });

    var map1 = new Map({
        basemap: "dark-gray",
		
    });

    var view1 = new MapView({
        container: "viewDiv1",
        map: map1,
        center: [-70.71511, 24.09042],/*地图中心的经纬度坐标*/
        zoom: 5/*地图缩放级别*/
    });
	
	// *************** 两个地图连接 **********************
	var mapView = new MapView({
			  container: "overviewDiv",
			  map: map,
			  
			});
			//缩略图与主图副图联动
			view.on(["pointer-down", "pointer-move"], function (evt) {
				mapView.scale = view.scale * 2 *
	                    Math.max(
	                      view.width / mapView.width,
	                      view.height / mapView.height
	                    );
				mapView.center = view.center;
				view1.zoom = view.zoom;
				view1.center = view.center;
			});
			view1.on(["pointer-down", "pointer-move"], function (evt) {
				mapView.scale = view.scale * 2 *
			            Math.max(
			              view1.width / mapView.width,
			              view1.height / mapView.height
			            );
				mapView.center = view1.center;
				view.zoom = view1.zoom;
				view.center = view1.center;
			});
			mapView.on(["pointer-down", "pointer-move"], function (evt) {
				view.scale = mapView.scale * 0.5 *
			            Math.max(
			              mapView.width / view.width,
			              mapView.height / view.height
			            );
				view.center = mapView.center;
				view1.zoom = view.zoom;
				view1.center = view.center;
				
			});
			
	
			
					
	
			//除去额外控件
			mapView.ui.components = [];
	
			mapView.when(() => {
			  view.when(() => {
				setup();
			  });
			});
			
			
			//定义遮罩的样式和属性
			function setup() {
			  const extent3Dgraphic = new Graphic({
				geometry: null,
				symbol: {
				  type: "simple-fill",
				  color: [0, 0, 0, 0.5],
				  outline: null
				}
			  });
			  mapView.graphics.add(extent3Dgraphic);
			
			  watchUtils.init(view, "extent", (extent) => {
			
				extent3Dgraphic.geometry = extent;
			
			  });
			}

    
    // *************** 两个地图连接 **********************

    

    // **********************添加图层**********************

    var layer_Hurricanes = new Maplayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer"
		
    });

    var layer_USA = new Maplayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer"
    });

    /// Add map
    

    document.getElementById("Add_layer2").addEventListener("click", function () {
        map.add(layer_Hurricanes);
    });

    document.getElementById("Add_layer3").addEventListener("click", function () {
        map.add(layer_USA);
    });

    /// remove map

    document.getElementById("Remove_layer2").addEventListener("click", function () {
        view.map.remove(layer_Hurricanes);
    });

    document.getElementById("Remove_layer3").addEventListener("click", function () {
        view.map.remove(layer_USA);
    });

    /// compute layer_num
    view.map.allLayers.on("change", function (event) {
        var num = event.target.length - 1;
        document.getElementById("Layers").textContent = "Layers： " + num;
    });

    ///***********************切换底图**************************

    document.getElementById("gray").addEventListener("click", function () {
        map.basemap = "gray";
    });

    document.getElementById("hybrid").addEventListener("click", function () {
        map.basemap = "hybrid";
    });

    document.getElementById("terrain").addEventListener("click", function () {
        map.basemap = "terrain";
    });

    document.getElementById("osm").addEventListener("click", function () {
        map.basemap = "osm";
    });

    document.getElementById("streets").addEventListener("click", function () {
        map.basemap = "streets";
    });

    ///   *************添加事件显示中心的坐标（在视图停止移动之后）******************
    view.watch(["stationary"], function () {
        showInfo(view.center);
    });
    ///  添加显示鼠标的坐标点
    view.on(["pointer-move"], function (evt) {
        showInfo(view.toMap({
            x: evt.x,
            y: evt.y
        }));
    });
    view1.on(["pointer-move"], function (evt) {
        showInfo(view.toMap({
            x: evt.x,
            y: evt.y
        }));
    });


    ///   显示经纬度、比例尺大小和尺度
    function showInfo(pt) {
        document.getElementById("scaleDisplay").textContent = "比例尺：1:" + Math.round(view.scale * 1);
        document.getElementById("coordinateDisplay").textContent = "经度:" + pt.latitude.toFixed(3) + "，" + "  纬度：" + pt.longitude
            .toFixed(3);
    }
	
	const geojsonlayer = new GeoJSONLayer({
	    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/FeatureServer/0/query?where=&objectIds=&time=&geometry=%7B%22xmin%22%3A-198%2C%22ymin%22%3A42%2C%22xmax%22%3B-46%2C%22ymax%22%3A-194%2C%22spatialReference%22%3A%7B%22wink%22%3A4326%7D%2ClatestWkid%3A4326%7D%7D&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=magnitude&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&having=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnExceededLimitFeatures=false&quantizationParameters=&returnCentroid=false&sqlFormat=none&resultType=&featureEncoding=esriDefault&f=geojson",
	    
	});
	geojsonlayer.outFields = ["*"];
	map.add(geojsonlayer);
    
    
	view.on("click", function (evt) {
	    view.graphics.removeAll();
	    if (evt.button != 0) return;
	    let query = geojsonlayer.createQuery();
	    query.geometry = view.toMap(evt);  // the point location of the pointer
	    query.distance = 2;
	    query.units = "miles";
	    query.spatialRelationship = "intersects";  // this is the default
	    query.returnGeometry = true;
	    query.outFields = ["*"];
	    //query.where = "mag > 3";
	
	    //geojsonlayer.queryFeatureCount(query).then(function (abc) { alert("Layer: "+abc) });
	    geojsonlayer.queryFeatures(query).then(function (abc) {
	
	
	        abc.features.forEach(function (item) {
	
	            const bufferPoly = geometryEngine.geodesicBuffer(item.geometry,50*item.attributes['magnitude']*item.attributes['magnitude'],'kilometers');
	            
	            var g = new Graphic({
	                geometry: bufferPoly, //item.geometry,
	                attributes: item.attributes,
	                symbol: {
	                    type: "simple-fill",
	                    color: [139, 0, 22, 0.1],
	                    //size: 3,//item.attributes['magnitude'] * item.attributes['magnitude'],
	                    //style: "square"
	
	                }
	            });
	
	            view.graphics.add(g);
	            
	            const area = geometryEngine.geodesicArea(item.geometry, 100,"square-kilometers");
	            
	            let query2 = layer_2022.createQuery();
	            query2.geometry = bufferPoly; 
	            
	            query2.spatialRelationship = "intersects";  // this is the default
	            query2.returnGeometry = true;
	            query2.outFields = ["*"];
	            
	            layer_2022.queryFeatures(query2).then(function(eqs){
	                 
	                eqs.features.forEach(function(eachEq){
	                    
	                    var g = new Graphic({
	                    geometry: eachEq.geometry,
	                    attributes: eachEq.attributes,
	                    symbol: {
	                        type: "simple-marker",
	                        //color: [200, 100, 0, 0.8]
	                        //size: 3,//item.attributes['magnitude'] * item.attributes['magnitude'],
	                        //style: "square"
	
	                    }
	            });
	
	            view.graphics.add(g);
	                });
	                
	            });
	            
	        });
	
	    });
	
	});
	 
	
    view.ui.add("info", "top-right");
    
        view.on("click",function (event) {
            view.hitTest(event)
                .then(getGraphics);
        });
    
        function getGraphics(response) {
            if (response.results.length) {
                const graphic = response.results.filter(function (result) {
                    return result.graphic.layer ===  layer_Hurricanes;
                })[0].graphic;
                console.log(graphic);
    
                view.graphics.removeAll();
                const selectedGraphic = new Graphic({
                    geometry: graphic.geometry,
                    symbol: {
                        type: "simple-marker",
                        style: "ring",
                        color: "orange",
                        size: "100px", // pixels
                        outline: { // autocasts as new SimpleLineSymbol()
                            color: [255, 255, 0],
                            width: 100 // points
                        }
                    }
                });
                view.graphics.add(selectedGraphic);
            }
        }
    
    
    
    const popupTrailheads = {
        "title": "飓风信息",
        "content": "<b>编号:</b> {OBJECTID}<br><b>日期:</b> {DAY}<br><b>时间:</b> {TIME}<br><b>经度:</b> {LAT}<br><b>纬度:</b> {LONG}<br><b>压强:</b> {PRESSURE}<br><b>风速:</b> {WINDSPEED}"
      }
      //定义图层
    const trailheads = new FeatureLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer",
        outFields: ["OBJECTID", "DAY", "TIME", "LAT", "LONG", "PRESSURE","WINDSPEED"],
        popupTemplate: popupTrailheads
      });
    
      map1.add(trailheads);
    

   

})
