import React, {useEffect, useLayoutEffect} from "react";
import {useSelector} from "react-redux";
import {store} from "../store";
import {actions} from "../store/app";

class YMap {
    prevSelected = null;
    _map = null;
    objectManager = null;

    constructor(data) {
        window.ymaps.ready(() => {
            this._map = new window.ymaps.Map(
                "map",
                {
                    center: data.geo,
                    zoom: 12
                },
                {
                    searchControlProvider: "yandex#search"
                }
            );
            this.objectManager = new window.ymaps.ObjectManager({
                gridSize: 32,
            });
            this.objectManager.objects.events.add('click', e => {
                const id = e.get('objectId');
                this.selectMarker(id, false);
                store.dispatch(actions.setCurrent(id));
            });
            this._map.geoObjects.add(this.objectManager);
        });
    }

    replaceMarkers(data) {
        this.removeAllMarkers();
        this.addMarkers(data.items);
    }

    removeAllMarkers() {
        this.objectManager && this.objectManager.removeAll();
    }

    removeMarkers(items) {
        this.objectManager.remove(items.map(it => this.createMarker(it)))
    }

    addMarkers(items) {
        this.objectManager && this.objectManager.add(items.map(it => this.createMarker(it)))
    }

    selectMarker(id, center) {
        if (this.prevSelected === id) return;
        this.objectManager.objects.setObjectOptions(id, {
            preset: 'islands#redIcon',
            zIndex: 1000,
        });
        if (this.prevSelected) {
            this.unselectMarker(this.prevSelected);
        }
        this.prevSelected = id;
        if (center) this._map.setCenter(store.getState().initialData.items[id].coords);
    }

    unselectMarker(id) {
        this.objectManager.objects.setObjectOptions(id, {
            preset: 'islands#blueIcon',
            zIndex: 1,
        });
    }

    filterMarkers(filter) {
        (async () => {
            while (!this.objectManager) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            this.objectManager.setFilter(function (obj) {
                return filter.find(x => x.id === obj.id)
            })
        })();
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

    resize() {
        this._map.container.fitToViewport();
    }
}

export let map = null;

export const Map = () => {
    const data = useSelector(state => state.data);
    const selected = useSelector(state => state.mapSelected);
    const displayed = useSelector(state => state.displayed);

    useEffect(() => {
        if (!data.geo || map) return;
        map = new YMap(data);
    }, [data]);

    useLayoutEffect(() => {
        map && map.replaceMarkers(data);
    }, [data]);

    useLayoutEffect(() => {
        for (const id of selected) map.selectMarker(id, true);
    }, [selected]);

    useEffect(() => {
        map && map.filterMarkers(displayed);
    }, [displayed]);
    return (
        <div id="map"></div>
    );
}