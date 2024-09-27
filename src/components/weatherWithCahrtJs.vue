<template>
  <div>
    <div>
      <canvas id="rainFall"></canvas>
    </div>
  </div>
</template>
<script setup>
import Chart from 'chart.js/auto';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  rainFalls: {
    type: Array
  }
});
const rainFalls = ref([]);
const chart = ref(null); // 存儲圖表實例
const getChartConfig = () => {
  return {
    labels: props.rainFalls.map(item => item.Date),
    datasets: [
      {
        // label 為資料分類的名稱
        label: "降雨量",
        //  data 為資料內容，是一個陣列，相同 index 的數值會放在同一個橫軸的分類區間
        data: props.rainFalls.map(item => parseFloat(item.weatherElements.Precipitation))//[10,   20,   30,   50,   40],
      },
    ],
  };
}
const initChart = () => {
  const dataObj = getChartConfig();
  console.log(dataObj);

  const domEl = document.getElementById('rainFall');
  if (chart.value) {
    chart.value.destroy(); // 銷毀先前的圖表實例
  }
  chart.value = new Chart(domEl, {
    type: "bar",
    data: dataObj,
    options: {
      responsive: true,
      // 如果不設 maintainAspectRatio,寬度會固定
      maintainAspectRatio: false,
      plugins: {
        legend: {
          // datasets裡每一個物件會變成圖例，出現在給定的位置
          position: "top",
        },
        title: {
          display: true,
          text: "降雨量長條圖",
        },
      },
    },
  });
}

watch(
  () => props.rainFalls,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      rainFalls.value = newVal; // 更新 rainFalls 的反應性資料
      initChart(); // 重新初始化圖表
    }
  },
  { deep: true } // 啟用深度監控
);

onMounted(() => {
  rainFalls.value = props.rainFalls;
  initChart();
})
</script>

<style lang="scss">
#rainFall {
  max-width: 800px;
  height: 600px;
  width: 100%;
}
</style>