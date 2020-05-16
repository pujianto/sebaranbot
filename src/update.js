import axios from 'axios';
import fs from 'fs';

const sourceUrl = 'https://data.covid19.go.id/public/api/kecamatan_rawan.json';
const ucfirst = text => text.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
const severity = {
    'low': 'rendah',
    'medium': 'sedang',
    'high': 'tinggi'
};

axios.get(sourceUrl)
    .then((response) => {
        if (response.status !== 200 || response.data.length < 1) {
            throw `Invalid response. status: ${response.status} length: ${response.data.length}`;
        }
        
        let data = {
            lastSync: new Date()
        }
        
        data.locations = response.data.map((location) => {
            return {
                fullName: ucfirst(location.title),
                severity: severity[location.kategori.toLowerCase()],
                name: ucfirst(location.title.split(',')[0])
            }
        });

        fs.writeFileSync('runtime/locations.json', JSON.stringify(data));
        console.log('sync completed');  

        
        
    })
    .catch((e) => console.error(e));

