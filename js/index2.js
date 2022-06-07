require([
    "esri/Map",
    "esri/views/MapView"
], function (Map, MapView) {
    //**********************************************功能：swip map**********************************************************
    var map1 = new Map({
        basemap: "streets"
    });

    var view1 = new MapView({
        container: "viewDiv1",
        map: map1,
        center: [116.40, 39.90],
        zoom: 3
    });

    var map2 = new Map({
        basemap: "hybrid"
    });

    var view2 = new MapView({
        container: "viewDiv2",
        map: map2,
        center: [116.40, 39.90],
        zoom: 3
    });


    view1.on(["pointer-down", "pointer-move"], function (evt) {
        LinkMap2();
    });

    function LinkMap2() {
        view2.zoom = view1.zoom;
        view2.center = view1.center;
    }

    view2.on(["pointer-down", "pointer-move"], function (evt) {
        LinkMap1();
    });

    function LinkMap1() {
        view1.zoom = view2.zoom;
        view1.center = view2.center;

    }
});