// Данные стран
const countries = [
    {
        coords: { lat: 39.9334, lng: 32.8597 }, // Турция
        link: '/turkey',
        iconUrl: '/static/images/turk.png',
        name: 'Турция'
    },
    {
        coords: { lat: 51.5074, lng: -3.1278 }, // Великобритания
        link: '/uk',
        iconUrl: '/static/images/uk.png',
        name: 'Великобритания'
    },
    {
        coords: { lat: 37.7749, lng: -122.4194 }, // США
        link: '/usa',
        iconUrl: '/static/images/usa.png',
        name: 'США'
    },
    {
        coords: { lat: 46.8566, lng: 2.3522 }, // Франция
        link: '/france',
        iconUrl: '/static/images/france.png',
        name: 'Франция'
    },
    {
        coords: { lat: 30.033333, lng: 31.233334 }, // Египет
        link: '/egypt',
        iconUrl: '/static/images/egypt.png',
        name: 'Египет'
    },
    {
        coords: { lat: 55.7558, lng: 37.6173 }, // Россия
        link: '/russia',
        iconUrl: '/static/images/russia.png',
        name: 'Россия'
    },
    {
        coords: { lat: 39.9042, lng: 116.4074 }, // Китай
        link: '/china',
        iconUrl: '/static/images/china.png',
        name: 'Китай'
    },
    {
        coords: { lat: 35.6895, lng: 139.6917 }, // Япония
        link: '/japan',
        iconUrl: '/static/images/japan.png',
        name: 'Япония'
    },
    {
        coords: { lat: 40.416775, lng: -3.703790 }, // Испания
        link: '/spain',
        iconUrl: '/static/images/spain.png',
        name: 'Испания'
    },
    {
        coords: { lat: 25.2048, lng: 55.2708 }, // ОАЭ
        link: '/uae',
        iconUrl: '/static/images/uae.png',
        name: 'ОАЭ'
    },
    {
        coords: { lat: 28.6139, lng: 77.2090 }, // Индия
        link: '/india',
        iconUrl: '/static/images/india.png',
        name: 'Индия'
    },
    {
        coords: { lat: 19.4326, lng: -99.1332 }, // Мексика
        link: '/mexico',
        iconUrl: '/static/images/mexico.png',
        name: 'Мексика'
    },
    {
        coords: { lat: -33.8688, lng: 151.2093 }, // Австралия
        link: '/australia',
        iconUrl: '/static/images/australia.png',
        name: 'Австралия'
    },
    {
        coords: { lat: -15.7975, lng: -47.8919 }, // Бразилия
        link: '/brazil',
        iconUrl: '/static/images/brazil.png',
        name: 'Бразилия'
    }
];

// Инициализация карты
document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map', {
        maxBoundsViscosity: 1.0,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        dragging: true,
        boxZoom: false,
        keyboard: false,
        tap: false
    }).setView([20, 0], 2.5);

    L.tileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', {
        attribution: '2GIS',
        tileSize: 256,
        maxZoom: 18,
        minZoom: 2
    }).addTo(map);

    // Устанавливаем границы карты
    const bounds = L.latLngBounds(
        [-90, -150],
        [90, 180]
    );
    map.setMaxBounds(bounds);

    const markers = [];
    const markerSpacing = 0.5;
    const usedCoords = new Set();

    // Размеры иконок
    const normalSize = [60, 60];
    const largeSize = [130, 130];
    const zoomLevels = {
        small: [60, 60],
        medium: [80, 80],
        large: [100, 100]
    };

    // Функция для создания HTML-элемента иконки
    function createIconHtml(iconUrl) {
        const div = document.createElement('div');
        div.innerHTML = `<img src="${iconUrl}" alt="" style="width:100%;height:100%;object-fit:contain;">`;
        return div;
    }

    countries.forEach(country => {
        let { lat, lng } = country.coords;

        while (usedCoords.has(`${lat},${lng}`)) {
            lat += (Math.random() - 0.5) * markerSpacing;
            lng += (Math.random() - 0.5) * markerSpacing;
        }
        usedCoords.add(`${lat},${lng}`);

        const icon = L.divIcon({
            html: createIconHtml(country.iconUrl).innerHTML,
            className: 'country-icon',
            iconSize: normalSize,
            popupAnchor: [0, -20]
        });

        const marker = L.marker([lat, lng], {
            icon: icon,
            zIndexOffset: 1000,
            title: country.name
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
                const currentZoom = map.getZoom();
                const baseSize = currentZoom < 3 ? zoomLevels.small :
                                (currentZoom < 5 ? zoomLevels.medium : zoomLevels.large);
                const icon = this.getIcon();
                icon.options.iconSize = baseSize;
                this.setIcon(icon);
                this.setZIndexOffset(1000);
                this.isExpanded = false;
            }
        });
    });

    map.on('zoomend', function() {
        const currentZoom = map.getZoom();
        markers.forEach(marker => {
            const baseSize = currentZoom < 3 ? zoomLevels.small :
                            (currentZoom < 5 ? zoomLevels.medium : zoomLevels.large);
            const icon = marker.getIcon();
            icon.options.iconSize = baseSize;
            marker.setIcon(icon);
            marker.isExpanded = false;
        });
    });
});