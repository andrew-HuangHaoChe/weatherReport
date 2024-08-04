import * as d3 from "d3";
import * as turf from '@turf/turf';
const svg = d3.select("svg");


const initMap = () => {
    const projectmethod = d3.geoMercator().center([123, 24]).scale(5500);
    const pathGenerator = d3.geoPath().projection(projectmethod);
    d3.json("src/apis/COUNTY_MOI.json", (error, geometry) =>{
        console.log(geometry);
    })
}

export const getMap = () => {
    initMap();
    return svg
}