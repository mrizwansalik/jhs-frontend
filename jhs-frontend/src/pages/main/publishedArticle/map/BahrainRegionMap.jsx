import React, { useEffect, useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_bahrainLow from "@amcharts/amcharts5-geodata/bahrainLow";
import { useSelector } from "react-redux";

import styles from '../Style/Chart.module.css'; // Import the CSS module

const BahrainRegionMap = () => {
  const chartRef = useRef(null);
  const regionData = useSelector((state) => state.home.singleArticleBahrainRegionMetrics);
  const chart = useRef(null);

  useLayoutEffect(() => {
    let root = am5.Root.new(chartRef.current);

    const getCountryColor = (views) => {
      if (views === 0) return am5.color(0x4a90e2);

      const ranges = [
        { max: 20, color: 0x145bbb },
        { max: 40, color: 0x1357b4 },
        { max: 60, color: 0x1353ad },
        { max: 80, color: 0x134fa6 },
        { max: 100, color: 0x124b9f },
        { max: 120, color: 0x124899 },
        { max: 140, color: 0x124492 },
        { max: 160, color: 0x11408b },
        { max: 180, color: 0x113c84 },
        { max: 200, color: 0x11397e },
      ];

      for (let range of ranges) {
        if (views <= range.max) {
          return am5.color(range.color);
        }
      }
      return am5.color(0xc01313);
    };

    let mapChat = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "none",
        projection: am5map.geoMercator(),
        wheelX: "none",
        wheelY: "none",
        pinchZoom: true
      })
    );

    let polygonSeries = mapChat.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_bahrainLow,
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}\nViews: {views}\nPDF Downloads: {downloads}",
      fill: am5.color(0x4a90e2), // Main blue fill color for countries
      stroke: am5.color(0xffffff), // Border color (white)
      interactive: true,
    });

    polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
      const dataContext = target.dataItem.dataContext;
      return getCountryColor(dataContext.views || 0);
    });

    polygonSeries.mapPolygons.template.events.on("pointerover", function (event) {
      event.target.states.create("hover", {
        fill: am5.color(0x003366), // Darker blue on hover
      });
    });

    // Add logic for countries not in data
    polygonSeries.mapPolygons.template.adapters.add("tooltipText", (text, target) => {
      const dataContext = target.dataItem.dataContext;
      const views = dataContext.views !== undefined ? dataContext.views : 0;
      const downloads = dataContext.downloads !== undefined ? dataContext.downloads : 0;

      // Return updated tooltip text with defaults
      return `${dataContext.name}\nViews: ${views}\nPDF Downloads: ${downloads}`;
    });

    polygonSeries.data.setAll(regionData);

    chart.current = mapChat;

    return () => {
      root.dispose();
    };
  }, []);


  // Update chart data when countryData changes
  useEffect(() => {
    if (chart.current) {
      const polygonSeries = chart.current.series.getIndex(0);
      polygonSeries.data.setAll(regionData.map(region => ({
        ...region,
        views: region.views ?? 0,
        downloads: region.downloads ?? 0,
      })));
    }
  }, [regionData]); // Run this effect when countryData changes


  return (
    <>
      <div
        className={`${styles.chartContainer} border rounded-3 p-0 m-0`}
        ref={chartRef}
      />
    </>
  );
};

export default BahrainRegionMap;
