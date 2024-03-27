<template>
  <apexchart
    height="700"
    width="700"
    type="donut"
    :options="options"
    :series="series"
  ></apexchart>
</template>

<script>
import { defineComponent, ref, watch } from "vue";

const colors = ["#255aee", "#21ba45"];

export default defineComponent({
  name: "BalanceDonut",
  props: {
    data: {
      type: Object,
      required: true,
    },
    operationType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const options = ref({
      chart: {
        id: "balance-donut",
      },
      stroke: {
        show: true,
        colors: ["#222222"],
      },
      theme: {
        monochrome: {
          enabled: true,
          color: "#255aee",
          shadeTo: "dark",
          shadeIntensity: 0.65,
        },
      },
      labels: [],
      legend: {
        show: false,
      },
      noData: {
        text: "Данные не найденны",
      },
      responsive: [
        {
          breakpoint: 1260,
          options: {
            chart: {
              height: "500",
              width: "500",
            },
          },
        },
        {
          breakpoint: 1020,
          options: {
            chart: {
              height: "600",
              width: "600",
            },
          },
        },
        {
          breakpoint: 600,
          options: {
            chart: {
              height: "400",
              width: "400",
            },
          },
        },
      ],
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: "",
                color: "white",
                formatter: function (w) {
                  return (
                    w.globals.seriesTotals.reduce((a, b) => {
                      return a + b;
                    }, 0) + " ₽"
                  );
                },
              },
              value: {
                color: "white",
                offsetY: -8,
              },
            },
          },
        },
      },
    });
    const series = ref([]);
    
    watch(
      () => props.data,
      () => {
        options.value = {
          ...options.value,
          ...{
            labels: props.data.labels,
            theme: {
              monochrome: {
                color: props.operationType === "income" ? colors[1] : colors[0],
              },
            },
          },
        };
        series.value = props.data.series;
      }
    );

    return {
      options,
      series,
    };
  },
});
</script>
