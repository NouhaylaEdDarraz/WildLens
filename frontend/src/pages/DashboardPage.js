import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function DashboardScreen() {
  useEffect(() => {
    async function fetchCoordinatesWithImages() {
      try {
        const response = await fetch('/upload/extractGPSWithImages');
        const data = await response.json();

        const map = L.map('map').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const gpsIcon = L.icon({
          iconUrl:
            'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        data.forEach((item) => {
          const latitude = convertDMSToDD(item.latitude);
          const longitude = convertDMSToDD(item.longitude);
          console.log(
            `Converted coordinates: Latitude - ${latitude}, Longitude - ${longitude}`
          );
          const marker = L.marker([latitude, longitude], {
            icon: gpsIcon,
          }).addTo(map);

          const popupContent =
            '<img src="data:image/jpeg;base64,' +
            item.image +
            '" width="100" height="100">' +
            '<div>Latitude: ' +
            latitude +
            '<br>Longitude: ' +
            longitude +
            '</div>';

          marker.bindPopup(popupContent);

          marker.on('click', function () {
            marker.openPopup();
          });
        });
      } catch (error) {
        console.error('Error fetching coordinates and images:', error);
      }
    }

    fetchCoordinatesWithImages();
  }, []);

  function convertDMSToDD(dms) {
    const parts = dms.match(/\d+\/\d+|\d+/g);
    const degrees = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parts[2].includes('/')
      ? parseFloat(parts[2].split('/')[0]) / parseFloat(parts[2].split('/')[1])
      : parseFloat(parts[2]);

    return degrees + minutes / 60 + seconds / 3600;
  }

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div id='map' style={{ height: '500px' }}></div>
    </div>
  );
}
