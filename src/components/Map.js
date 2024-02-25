import React, {useEffect, useLayoutEffect} from "react";
import {useSelector} from "react-redux";
import {store} from "../store";
import {actions} from "../store/app";

class YMap {
    prevSelected = null;

    constructor(data) {
        window._map = new window.ymaps.Map(
            "map",
            {
                center: data.geo,
                zoom: 13
            },
            {
                searchControlProvider: "yandex#search"
            }
        );
        window.objectManager = new window.ymaps.ObjectManager({
            gridSize: 32,
        });
        window.objectManager.add(Object.values(data.items).map(it => this.createMarker(it)))
        window.objectManager.objects.events.add('click', function (e) {
            store.dispatch(actions.setCurrent(e.get('objectId')))
        });
        window._map.geoObjects.add(window.objectManager);
    }

    selectMarker(id) {
        window.objectManager.objects.setObjectOptions(id, {
            preset: 'islands#redIcon',
            zIndex: 1000,
        });
        window._map.setCenter(item.coords);
    }

    unselectMarker(id) {
        window.objectManager.objects.setObjectOptions(id, {
            preset: 'islands#blueIcon',
            zIndex: 1,
        });
    }

    filterMarkers(filter) {
        window.objectManager.setFilter(function (obj) {
            return filter.find(x => x === obj.id)
        })
    }

    createMarker(data) {
        return {
            type: 'Feature',
            id: data.id,
            geometry: {
                type: 'Point',
                coordinates: data.coords,
            },
            properties: {
                // balloonContentHeader: data.tdatale,
                // balloonContentBody: data.price,
                // balloonContentFooter: window.dayjs(data.timestamp * 1000, 'ru').format("D MMMM YYYY HH:mm", 'ru'),
                iconCaption: data.price,
                hintContent: data.title + '\n' + data.price,
            }
        }
    }
}

let map = null;

export const Map = () => {
    const {selected, data} = useSelector(state => state);

    useEffect(() => {
        if (!data.items) return;
        map = new YMap(data);
    }, [data]);

    useLayoutEffect(() => {

    }, [selected]);

    return (
        <div id="map"></div>
    );
}