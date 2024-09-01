<template>
    <div>
        <select id="weatherStations" @change="getRainFalls" v-model="stationVal">
            <option value="">不拘</option>
            <option v-for="item in weatherStations" :key="item.id" :value="item.id">{{item.name}}</option>
        </select>
        <pre>{{ currentRainFalls }}</pre>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getDailyRainfalls } from '@/apis/weather';

const stationVal = ref('');
const weatherStations = ref([]);
const currentRainFalls = ref({});
const rainFalls = ref([]);

const getRainFalls = () => {
    currentRainFalls.value = rainFalls.value.find(item => item.station.StationID === stationVal.value);
}

onMounted(async() => {
    const res = await getDailyRainfalls();
    rainFalls.value = res.data.records.location;
    const stations = res.data.records.location.map(item => { return {
        id: item.station.StationID,
        name: item.station.StationName
    }});
    weatherStations.value = stations;
})
</script>