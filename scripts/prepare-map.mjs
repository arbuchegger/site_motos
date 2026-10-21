// IBGE regional mesh, simplified into a local SVG with no runtime map dependency.
import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('public/images/nordeste-estados.geojson'));
const polygons = feature => (feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates).filter(p => p[0].some(c => c[0] < -34.7));
const points = data.features.flatMap(f => polygons(f).flat(2));
const longitudeScale = Math.cos(10 * Math.PI / 180);
const xs = points.map(c => c[0] * longitudeScale), ys = points.map(c => -c[1]);
const minX = Math.min(...xs), minY = Math.min(...ys), maxX = Math.max(...xs), maxY = Math.max(...ys);
const scale = Math.min(360 / (maxX - minX), 400 / (maxY - minY));
const ox = (420 - (maxX - minX) * scale) / 2, oy = (460 - (maxY - minY) * scale) / 2;
const project = c => [(c[0] * longitudeScale - minX) * scale + ox, (-c[1] - minY) * scale + oy];
const paths = data.features.map(f => {
  const d = polygons(f).map(p => p.map(r => r.map((c,i) => (i ? 'L' : 'M') + project(c).map(n => n.toFixed(1)).join(',')).join('') + 'Z').join('')).join('');
  return `<path fill="${f.properties.codarea === '25' ? '#eaa64b' : '#514437'}" d="${d}"/>`;
}).join('');
fs.writeFileSync('public/images/mapa-nordeste.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 460" fill-rule="evenodd"><g stroke="#a58a65" stroke-width="0.8" stroke-linejoin="round">${paths}</g></svg>`);
console.log('João Pessoa:', project([-34.8631, -7.115]));
