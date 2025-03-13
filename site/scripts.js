const initMap = () => {
    const map = L.map('map', {
        maxBoundsViscosity: 1.0
    }).setView([20, 0], 3);

    L.tileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', {
        attribution: '2GIS',
        tileSize: 256,
        maxZoom: 18,
        minZoom: 2
    }).addTo(map);

    const bounds = L.latLngBounds(
        [-90, -180],
        [90, 180]
    );
    map.setMaxBounds(bounds);

    return map;
};

const addMarkers = (map, countries) => {
    const markers = [];

    const markerSpacing = 1;
    const usedCoords = new Set();

    const normalSize = [64, 64];
    const largeSize = [150, 200];

    countries.forEach(country => {
        let { lat, lng } = country.coords;

        while (usedCoords.has(`${lat},${lng}`)) {
            lat += (Math.random() - 0.5) * markerSpacing;
            lng += (Math.random() - 0.5) * markerSpacing;
        }
        usedCoords.add(`${lat},${lng}`);

        const icon = L.icon({
            iconUrl: country.iconUrl,
            iconSize: normalSize,
            className: 'country-icon'
        });

        const marker = L.marker([lat, lng], {
            icon: icon,
            zIndexOffset: 1000
        }).addTo(map);

        marker.isExpanded = false;

        markers.push(marker);

        marker.on('click', () => {
            window.location.href = country.link;
        });

        marker.on('mouseover', function() {
            if (!this.isExpanded) {
                const icon = this.getIcon();
                icon.options.iconSize = largeSize;
                this.setIcon(icon);
                this.setZIndexOffset(2000);
                this.isExpanded = true;
            }
        });

        marker.on('mouseout', function() {
            if (this.isExpanded) {
                const icon = this.getIcon();
                icon.options.iconSize = normalSize;
                this.setIcon(icon);
                this.setZIndexOffset(1000);
                this.isExpanded = false;
            }
        });
    });

    return markers;
};

const handleZoom = (map, markers) => {
    map.on('zoomend', function() {
        const currentZoom = map.getZoom();

        markers.forEach(marker => {
            const baseSize = currentZoom < 3 ? 64 : (currentZoom < 5 ? 96 : 128);
            const icon = marker.getIcon();
            icon.options.iconSize = [baseSize, baseSize];
            marker.setIcon(icon);
            marker.isExpanded = false;
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const map = initMap();
    const markers = addMarkers(map, countries);
    handleZoom(map, markers);
});