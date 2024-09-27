<template>
    <div>
        <h4 class="mt-3">台灣各縣市降雨量</h4>
        <div class="weatherContainer">
            <div>
                <select id="weatherStations" @change="getRainFalls" v-model="stationVal">
                    <option value="">不拘</option>
                    <option v-for="item in weatherStations" :key="item.id" :value="item.id">{{ item.name }}</option>
                </select>
                <div class="chart"></div>
            </div>
            <div>
                <weatherWithCahrtJs v-if="currentRainFalls.length !== 0" :rainFalls="currentRainFalls" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getDailyRainfalls } from '@/apis/weather';
import dayjs from 'dayjs';
import * as d3 from "d3";
import weatherWithCahrtJs from '@/components/weatherWithCahrtJs.vue';

const stationVal = ref('');
const weatherStations = ref([]);
const currentRainFalls = ref([]);
const rainFalls = ref([]);
const xData = ref([]);
/**
 * 取得X軸資料
*/
const getXData = () => {
    return currentRainFalls.value.map(item => item.Date);
}

/**
 * 取得y軸資料
*/
const getYData = () => {
    return currentRainFalls.value.map(item => parseFloat(item.weatherElements.Precipitation));
}


const getDateRange = () => {
    let today = new Date();
    let fiveDaysAgo = new Date().setDate(new Date().getDate() - 5);
    today = dayjs(today).format('YYYY-MM-DD');
    fiveDaysAgo = dayjs(fiveDaysAgo).format('YYYY-MM-DD');
    return { today, fiveDaysAgo };
}

const getRainFalls = () => {
    const range = getDateRange();
    let data = rainFalls.value.find(item => item.station.StationID === stationVal.value);
    currentRainFalls.value = data.stationObsTimes.stationObsTime.filter(item => item.Date <= range.today && item.Date >= range.fiveDaysAgo);
    const xData = getXData();
    const yData = getYData();
    drawChart(xData, yData);
}

const drawRect = (xScale, yScale, svgHeight, margin, svg) => {
    const bar = svg.selectAll('rect')
        .data(currentRainFalls.value)
        .join("rect") //類似append
        .attr("x", d => xScale(d['Date'])) // 讓長條圖在刻度線中間
        .attr("y", d => yScale(parseFloat(d['weatherElements']['Precipitation'].split(',').join(''))))
        .attr("width", xScale.bandwidth())
        .attr("height", d => {
            return (svgHeight - margin) - yScale(parseFloat(d['weatherElements']['Precipitation'].split(',').join('')))
        })
        .attr("fill", "#69b3a2")
    // .attr('cursor', 'pointer')
}

const drawChart = (xData, yData) => {
    d3.select('.chart svg').remove();

    const svgWidth = parseInt(d3.select('.chart').style('width')), //parseInt將單位移除 'px'
        svgHeight = svgWidth * 0.75,
        margin = 50;
    const svg = d3.select('.chart')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);
    console.log(svgWidth);


    //scaleBand - 非連續性的比例尺
    //設定要給 X 軸用的 scale(比例尺) 跟 axis(軸)
    const xScale = d3.scaleBand()
        .domain(xData) //傳入的值，表示要塞入傳入值的範圍
        .range([margin * 2, svgWidth - margin * 2])//表示輸出範圍。
        .padding(0.2)
    const xAxis = d3.axisBottom(xScale)
    // 繪製x軸、調整x軸位置
    const drawXAxis = svg.append("g") //加入gtag
        .call(xAxis)
        .attr("transform", `translate(0,${svgHeight - margin})`)
        .selectAll("text") // 調整刻度文字標籤傾斜，避免文字過長互相交疊
        .style("font-size", "14px")
        .attr("transform", "translate(28,10)rotate(0)")
        .style("text-anchor", "end");

    // 設定要給 Y 軸用的 scale 跟 axis
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(yData)])
        .range([svgHeight - margin, margin]) // 數值要顛倒，才會從低往高排
        .nice() // 補上終點值

    const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(3)

    // 呼叫繪製y軸、調整y軸位置
    const drawYAxis = svg.append("g")
        .call(yAxis)
        .attr("transform", `translate(${margin * 2},0)`)
        .style("font-size", "14px")

    //繪製長條圖
    drawRect(xScale, yScale, svgHeight, margin, svg);
}

onMounted(async () => {
    const res = await getDailyRainfalls();
    rainFalls.value = res.data.records.location;
    const stations = res.data.records.location.map(item => {
        return {
            id: item.station.StationID,
            name: item.station.StationName
        }
    });
    weatherStations.value = stations;
})
</script>
<style>
.weatherContainer {
    display: flex;
    flex-wrap: nowrap;
}

.chart {
    width: 100%;
    min-width: 800px;
    margin: auto;
}
</style>