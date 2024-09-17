<template>
    <div>
        <svg ref="map" xmlns="http://www.w3.org/2000/svg" id="svg" width="900" height="1200"></svg>
    </div>
  </template>
<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from "d3";
const map = ref(null);

onMounted( async() => {
    const width = map.value.width.baseVal.value;
    const height = map.value.height.baseVal.value;
    const svg =  d3.select("svg").attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);
    const g = svg.append("g");
    let mercatorScale, w = window.screen.width;
    if(w > 1366) { mercatorScale = 11000; }
    else if(w <= 1366 && w > 480) { mercatorScale = 9000; }
    else { mercatorScale = 6000; }
    const projection = d3.geoMercator()
	.center([121,24])
	.scale(9000);
    const path = d3.geoPath().projection(projection);
    const data = await d3.json("src/apis/COUNTY_MOI.json");
    console.log(data);
    svg
    .selectAll('path')
    .data(data.features)
    .enter().append('path')
    .attr('d', path)
    .on('mouseover ', d => {
        console.log(d);
    })
})
</script>
<style lang="scss">
$main:#FFCA28;
path {
    fill: transparent;
    stroke: $main;
    cursor: pointer;
    transition: fill .2s ease, stroke .2s ease, transform .2s ease;
    &:hover, &.active {
        fill: rgba($main, .5);
        stroke: $main;
        transform: translateY(-5px);
    }
}
</style>
  