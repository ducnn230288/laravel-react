import React, { forwardRef, useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import type {
  CallbackDataParams,
  CommonTooltipOption,
  EChartsType,
  GridOption,
  LegendComponentOption,
  OptionDataValue,
  SeriesOption,
  TitleOption,
  TooltipOption,
  XAXisOption,
  YAXisOption,
} from './types';

import { ETypeChart } from '@/enums';
import { uuidv4 } from '@/utils';

export const CEChart = forwardRef(
  (
    {
      option,
      style = { height: '20rem' },
      colorPalette = ['#006ae6', '#d74e00', '#272134', '#883fff', '#00a261', '#c59a00', '#e42855'],
    }: Type,
    ref: Ref<any>,
  ) => {
    useImperativeHandle(ref, () => ({
      // onChartReady, onChartReady: (echarts: any) => void
    }));
    const _id = useRef(uuidv4());
    const _myChart = useRef<EChartsType>();
    useEffect(() => {
      if (option) {
        let title: TitleOption = { text: option.title, left: 'center' };
        let tooltip: TooltipOption | CommonTooltipOption<any> = { trigger: 'item' };
        let legend: LegendComponentOption | undefined = { top: 'bottom', left: 'center' };
        let series: SeriesOption | SeriesOption[] | undefined;
        let xAxis: XAXisOption | undefined = { splitLine: { lineStyle: { type: 'dashed' } } };
        let yAxis: YAXisOption | YAXisOption[] | undefined = {
          splitLine: { lineStyle: { type: 'dashed' } },
          scale: true,
        };
        const hideAxis = {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        };

        const halfDount = {
          itemStyle: {
            normal: {
              borderColor: 'rgba(255,255,255,1)',
              borderWidth: 4,
            },
          },
          startAngle: 180,
          endAngle: 360,
          label: {
            show: false,
          },
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
            xAxis =
              option.series.length > 1
                ? { ...xAxis, type: 'category', boundaryGap: false, data: option.category }
                : {
                    ...xAxis,
                    ...hideAxis,
                    type: 'value',
                    minorTick: {
                      show: true,
                    },
                    minorSplitLine: {
                      show: true,
                    },
                  };
            if (option.series.length === 1) {
              yAxis = { ...yAxis, ...hideAxis };
            }
            series = option.series.map((item: any) => ({
              data: item.value,
              name: item.name,
              type: 'line',
              smooth: true,
            }));
            break;
          case ETypeChart.area:
            tooltip = { trigger: 'axis' };
            xAxis =
              option.series.length > 1
                ? { ...xAxis, type: 'category', boundaryGap: false, data: option.category }
                : {
                    ...xAxis,
                    type: 'value',
                    minorTick: {
                      show: true,
                    },
                    minorSplitLine: {
                      show: true,
                    },
                    ...hideAxis,
                  };
            if (option.series.length === 1) {
              yAxis = { ...yAxis, ...hideAxis };
            }
            series = option.series.map((item: any, index: number) => ({
              data: item.value,
              name: item.name,
              type: 'line',
              smooth: true,
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorPalette[index],
                  },
                  {
                    offset: 1,
                    color: 'rgba(0, 0, 0, 0)',
                  },
                ]),
              },
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
            series = option.series.map((series: any) => ({
              ...series,
              type: 'pie',
              radius: '70%',
              label: {
                color: 'inherit',
              },
            }));
            break;
          case ETypeChart.ring:
          case ETypeChart.ringHalfDonut:
            xAxis = undefined;
            yAxis = undefined;
            if (option.type === ETypeChart.ringHalfDonut) legend = undefined;
            series = [
              ...option.series.map((series: any) => {
                if (option.type === ETypeChart.ringHalfDonut) {
                  series.data.push({
                    value: 100 - series.data[0].value,
                    itemStyle: {
                      color: 'rgba(255,255,255,1)',
                      label: {
                        color: 'inherit',
                      },
                    },
                  });
                }

                return {
                  ...series,
                  ...(option.type === ETypeChart.ringHalfDonut
                    ? halfDount
                    : {
                        label: {
                          color: 'inherit',
                        },
                      }),

                  type: 'pie',
                  radius: ['50%', '70%'],
                };
              }),
              option.type === ETypeChart.ring
                ? {
                    itemStyle: {
                      normal: {
                        color: 'rgba(255,255,255,0.9)',
                      },
                    },
                    type: 'pie',
                    hoverAnimation: false,
                    radius: ['48%', '72%'],
                    center: ['50%', '50%'],
                    label: {
                      normal: {
                        show: false,
                      },
                    },
                    data: [
                      {
                        value: 1,
                      },
                    ],
                    z: -1,
                  }
                : {},
            ];
            title = {
              text:
                '{val|' +
                (option.type === ETypeChart.ring
                  ? formatNumber(
                      option.series[0].data.reduce((a: any, b: any) => {
                        return a + b.value * 1;
                      }, 0),
                    )
                  : option.series[0].data[0].value + '%') +
                '}\n{name|' +
                option.title +
                '}',
              top: option.type === ETypeChart.ring ? 'center' : '38%',
              left: 'center',
              textStyle: {
                rich: {
                  val: {
                    fontSize: 30,
                    fontWeight: 'bold',
                  },
                  name: {
                    padding: [5, 0],
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
        const _option = { title, xAxis, yAxis, series, tooltip, legend, grid, color: colorPalette };
        if (!_myChart.current)
          setTimeout(() => {
            _myChart.current = echarts.init(document.getElementById(_id.current), null, { renderer: 'svg' });
            _myChart.current?.setOption(_option);
          });
        else _myChart.current.setOption(_option, true);
      }
    }, [option]);
    const formatNumber = (num: number) => {
      const reg = /(?=(\B)(\d{3})+$)/g;
      return num.toString().replace(reg, ',');
    };
    return <div style={style} id={_id.current} />;
  },
);
CEChart.displayName = 'CEChart';
interface Type {
  option: any;
  style?: React.CSSProperties;
  colorPalette?: string[];
}
