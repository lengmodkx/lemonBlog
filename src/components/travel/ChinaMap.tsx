'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { ScatterChart, EffectScatterChart } from 'echarts/charts';
import { GeoComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import chinaGeo from '@/data/china-geo.json';
import type { CityMarker, ProvinceStats } from '@/types/travel';

echarts.use([ScatterChart, EffectScatterChart, GeoComponent, TooltipComponent, CanvasRenderer]);
echarts.registerMap('china', chinaGeo as unknown as Parameters<typeof echarts.registerMap>[1]);

export interface ChinaMapProps {
  markers: CityMarker[];
  provinces: ProvinceStats[];
  isDark: boolean;
  /** Called when a city dot is clicked. */
  onCityClick?: (marker: CityMarker) => void;
  /** Called when a province region is clicked. */
  onProvinceClick?: (province: string) => void;
}

interface MapPalette {
  unvisitedArea: string;
  visitedArea: (ratio: number) => string;
  border: string;
  label: string;
  cityLabel: string;
  dot: string;
  dotHighlight: string;
}

const LIGHT: MapPalette = {
  unvisitedArea: '#f4f4f5',
  visitedArea: (r) => {
    // indigo ramp: light for few photos, deep accent for many
    const stops = ['#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5'];
    return stops[Math.min(stops.length - 1, Math.floor(r * stops.length))];
  },
  border: '#e4e4e7',
  label: '#a1a1aa',
  cityLabel: '#3f3f46',
  dot: '#4f46e5',
  dotHighlight: '#4338ca',
};

const DARK: MapPalette = {
  unvisitedArea: '#1c1c22',
  visitedArea: (r) => {
    const stops = ['#312e81', '#3730a3', '#4338ca', '#6366f1', '#818cf8'];
    return stops[Math.min(stops.length - 1, Math.floor(r * stops.length))];
  },
  border: '#27272a',
  label: '#52525b',
  cityLabel: '#d4d4d8',
  dot: '#818cf8',
  dotHighlight: '#a5b4fc',
};

export default function ChinaMap({
  markers,
  provinces,
  isDark,
  onCityClick,
  onProvinceClick,
}: ChinaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const callbackRef = useRef({ onCityClick, onProvinceClick });
  useEffect(() => {
    callbackRef.current = { onCityClick, onProvinceClick };
  });

  // Create chart once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const chart = echarts.init(container);
    chartRef.current = chart;

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    const observer = new ResizeObserver(onResize);
    observer.observe(container);

    return () => {
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  // (Re)render option when data or theme changes.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const palette = isDark ? DARK : LIGHT;
    const maxCount = Math.max(1, ...provinces.map((p) => p.photoCount));

    const provinceRegions = provinces.map((p) => ({
      name: p.province,
      itemStyle: {
        areaColor: palette.visitedArea(p.photoCount / maxCount),
      },
    }));

    const cityData = markers.map((m) => ({
      name: m.city,
      value: [...m.coords, m.photos.length] as [number, number, number],
      marker: m,
    }));

    chart.setOption(
      {
        tooltip: {
          trigger: 'item',
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          borderColor: isDark ? '#27272a' : '#e4e4e7',
          textStyle: { color: isDark ? '#fafafa' : '#18181b', fontSize: 12 },
          formatter: (params: {
            seriesType?: string;
            name?: string;
            data?: { marker?: CityMarker };
            value?: number[];
          }) => {
            if (params.seriesType === 'scatter' || params.seriesType === 'effectScatter') {
              const marker = params.data?.marker;
              if (!marker) return params.name ?? '';
              return `<strong>${marker.city}</strong><br/>${marker.province}<br/>${marker.photos.length} 张照片<br/>${marker.firstDate} ~ ${marker.lastDate}`;
            }
            const province = provinces.find((p) => p.province === params.name);
            if (!province) return params.name ?? '';
            return `<strong>${province.province}</strong><br/>${province.photoCount} 张照片 · ${province.cities.length} 个城市<br/>${province.cities.join('、')}`;
          },
        },
        geo: {
          map: 'china',
          roam: true,
          scaleLimit: { min: 1, max: 10 },
          zoom: 1.2,
          top: '8%',
          bottom: '8%',
          label: { show: false },
          itemStyle: {
            areaColor: palette.unvisitedArea,
            borderColor: palette.border,
            borderWidth: 0.8,
          },
          emphasis: {
            label: { show: true, color: palette.cityLabel, fontSize: 11 },
            itemStyle: {
              areaColor: isDark ? '#3f3f76' : '#ddd6fe',
            },
          },
          select: { disabled: true },
          regions: provinceRegions.map((r) => ({
            name: r.name,
            itemStyle: r.itemStyle,
            emphasis: { itemStyle: { areaColor: isDark ? '#4c4c9e' : '#c7d2fe' } },
          })),
        },
        series: [
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            data: cityData,
            symbolSize: (value: number[]) => 9 + Math.sqrt(value[2] ?? 1) * 3,
            rippleEffect: { brushType: 'stroke', scale: 2.6, period: 4 },
            itemStyle: { color: palette.dot, shadowBlur: 8, shadowColor: palette.dot },
            emphasis: {
              itemStyle: { color: palette.dotHighlight, shadowBlur: 16 },
              label: {
                show: true,
                formatter: (p: { name?: string }) => p.name ?? '',
                color: palette.cityLabel,
                fontSize: 12,
                fontWeight: 600,
                position: 'top',
              },
            },
            label: {
              show: true,
              formatter: (p: { name?: string }) => p.name ?? '',
              color: palette.cityLabel,
              fontSize: 10,
              position: 'right',
              distance: 4,
            },
          },
        ],
      },
      true,
    );

    const handleClick = (params: unknown) => {
      const p = params as {
        componentType?: string;
        seriesType?: string;
        name?: string;
        data?: { marker?: CityMarker };
      };
      if ((p.seriesType === 'scatter' || p.seriesType === 'effectScatter') && p.data?.marker) {
        callbackRef.current.onCityClick?.(p.data.marker);
      } else if (p.componentType === 'geo' || p.seriesType === 'map') {
        const province = provinces.find((item) => item.province === p.name);
        if (province) callbackRef.current.onProvinceClick?.(province.province);
      }
    };

    chart.on('click', handleClick);
    return () => {
      chart.off('click', handleClick);
    };
  }, [markers, provinces, isDark]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[480px] md:h-[620px]"
      role="img"
      aria-label="中国旅行地图"
    />
  );
}
