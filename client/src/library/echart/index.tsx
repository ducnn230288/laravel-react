import React, { forwardRef, type Ref, useEffect, useImperativeHandle, useRef } from 'react';
import type {
  LegendComponentOption,
  TitleOption,
  TooltipOption,
  XAXisOption,
  YAXisOption,
  GridOption,
} from 'echarts/types/dist/shared';
import type { EChartsType, SeriesOption } from 'echarts';
import type { CallbackDataParams, CommonTooltipOption, OptionDataValue } from 'echarts/types/src/util/types';

import { ETypeChart } from '@/enums';
import { uuidv4 } from '@/utils';

export const CEChart = forwardRef(({ option, style = { height: '20rem' } }: Type, ref: Ref<any>) => {
  useImperativeHandle(ref, () => ({
    // onChartReady, onChartReady: (echarts: any) => void
  }));
  const _id = useRef(uuidv4());
  const _myChart = useRef<EChartsType>();
  useEffect(() => {
    if (option) {
      let title: TitleOption = { text: option.title, left: 'center' };
      let tooltip: TooltipOption | CommonTooltipOption<any> = { trigger: 'item' };
      const legend: LegendComponentOption = { top: 'bottom', left: 'center' };
      let series: SeriesOption | SeriesOption[] | undefined;
      let xAxis: XAXisOption | undefined = { splitLine: { lineStyle: { type: 'dashed' } } };
      let yAxis: YAXisOption | YAXisOption[] | undefined = {
        splitLine: { lineStyle: { type: 'dashed' } },
        scale: true,
      };
      const grid: GridOption = {
        left: '30px',
        right: '30px',
        bottom: '30px',
        containLabel: true,
      };
      switch (option.type) {
        case ETypeChart.bar:
          tooltip = { trigger: 'axis' };
          xAxis = { ...xAxis, type: 'category', data: option.category };
          series = option.series.map((item: any) => ({
            data: item.value,
            name: item.name,
            type: 'bar',
          }));
          break;
        case ETypeChart.line:
          tooltip = { trigger: 'axis' };
          xAxis = { ...xAxis, type: 'category', boundaryGap: false, data: option.category };
          series = option.series.map((item: any) => ({
            data: item.value,
            name: item.name,
            type: 'line',
            smooth: true,
          }));
          break;
        case ETypeChart.area:
          tooltip = { trigger: 'axis' };
          xAxis = { ...xAxis, type: 'category', boundaryGap: false, data: option.category };
          series = option.series.map((item: any) => ({
            data: item.value,
            name: item.name,
            type: 'line',
            smooth: true,
            areaStyle: {},
          }));
          break;

        case ETypeChart.stackedArea:
          tooltip = { trigger: 'axis' };
          xAxis = { ...xAxis, type: 'category', boundaryGap: false, data: option.category };
          series = option.series.map((item: any) => ({
            data: item.value,
            name: item.name,
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            smooth: true,
          }));
          break;
        case ETypeChart.lineBar:
          tooltip = { trigger: 'axis' };
          xAxis = { ...xAxis, type: 'category', data: option.category };
          yAxis = [
            { type: 'value', name: option.series.slice(0, option.series.length - 2).map((item: any) => item.name) },
            { type: 'value', name: option.series.slice(option.series.length - 2).map((item: any) => item.name) },
          ];

          series = [
            ...option.series.slice(0, option.series.length - 2).map((item: any) => ({
              data: item.value,
              name: item.name,
              type: 'bar',
            })),
            ...option.series.slice(option.series.length - 2).map((item: any) => ({
              data: item.value,
              name: item.name,
              type: 'line',
              yAxisIndex: 1,
              smooth: true,
            })),
          ];
          break;
        case ETypeChart.stackedBar:
          xAxis = { ...xAxis, type: 'category', data: option.category };
          series = option.series.map((item: any) => ({
            name: item.name,
            type: 'bar',
            stack: 'total',
            data: item.value,
          }));
          break;
        case ETypeChart.pie:
          xAxis = undefined;
          yAxis = undefined;
          series = option.series.map((series: any) => ({ ...series, type: 'pie', radius: '70%' }));
          break;
        case ETypeChart.ring:
          xAxis = undefined;
          yAxis = undefined;
          series = option.series.map((series: any) => ({ ...series, type: 'pie', radius: ['40%', '70%'] }));
          title = {
            text:
              '{name|' +
              option.title +
              '}\n{val|' +
              formatNumber(
                option.series[0].data.reduce((a: any, b: any) => {
                  return a + b.value * 1;
                }, 0),
              ) +
              '}',
            top: 'center',
            left: 'center',
            textStyle: {
              rich: {
                name: {
                  fontSize: 13,
                  fontWeight: 'normal',
                  color: '#666666',
                  padding: [10, 0],
                },
                val: {
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: '#333333',
                },
              },
            },
          };
          break;

        case ETypeChart.scatter:
          tooltip = {
            formatter: (obj: CallbackDataParams) => {
              const { value, marker, seriesName } = obj;
              const v = value as OptionDataValue[];
              return (
                marker +
                ' ' +
                seriesName +
                '<br>' +
                v[2] +
                ' <strong>' +
                v[0] +
                '</strong><br>' +
                v[3] +
                ' <strong>' +
                v[1] +
                '</strong><br>'
              );
            },
          };
          series = option.series.map((item: any) => ({
            data: item.value,
            name: item.name,
            type: 'scatter',
            symbolSize: 10,
          }));
          console.log();
          grid.bottom =
            30 * Math.ceil(option.series.length / (document.getElementById(_id.current)!.clientWidth / 73)) + 'px';
          break;
        case ETypeChart.bubble:
          tooltip = {
            formatter: (obj: CallbackDataParams) => {
              const { value, marker, seriesName } = obj;
              const v = value as OptionDataValue[];
              return (
                marker +
                ' ' +
                seriesName +
                '<br>' +
                v[3] +
                ' <strong>' +
                v[0] +
                '</strong><br>' +
                v[4] +
                ' <strong>' +
                v[1] +
                '</strong><br>' +
                v[5] +
                ' <strong>' +
                v[2] +
                '</strong><br>'
              );
            },
          };
          series = option.series.map((series: any) => ({
            name: series.name,
            data: series.value,
            type: 'scatter',
            symbolSize: function (data: any) {
              return Math.sqrt(data[2]) / 5e2;
            },
            itemStyle: {
              shadowBlur: 1,
              opacity: 1,
            },
          }));
          break;
      }
      if (!_myChart.current)
        setTimeout(() => {
          _myChart.current = echarts.init(document.getElementById(_id.current));
          _myChart.current?.setOption({ title, xAxis, yAxis, series, tooltip, legend, grid });
        });
      else _myChart.current.setOption({ title, xAxis, yAxis, series, tooltip, legend, grid }, true);
    }
  }, [option]);
  const formatNumber = (num: number) => {
    const reg = /(?=(\B)(\d{3})+$)/g;
    return num.toString().replace(reg, ',');
  };
  return <div style={style} id={_id.current} />;
});
CEChart.displayName = 'CEChart';
interface Type {
  option: any;
  style?: React.CSSProperties;
}
