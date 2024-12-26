import React, { useEffect, useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { useSelector } from "react-redux";

import styles from '../Style/Chart.module.css'; // Import the CSS module

const WorldMapStats = () => {
   const chartRef = useRef(null);
   const countryData = useSelector((state) => state.home.singleArticleCountryMetrics);
   const chart = useRef(null);

   useLayoutEffect(() => {
      const root = am5.Root.new(chartRef.current);
      root.setThemes([am5themes_Animated.new(root)]);

      const mapChat = root.container.children.push(
         am5map.MapChart.new(root, {
            projection: am5map.geoMercator(),
            wheelX: "none",
            wheelY: "none",
            pinchZoom: true,
         })
      );

      const polygonSeries = mapChat.series.push(
         am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            exclude: ["AQ"],
         })
      );

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

      polygonSeries.mapPolygons.template.setAll({
         tooltipText: "{name}\nViews: {views}\nPDF Downloads: {downloads}",
         interactive: true,
         stroke: am5.color(0xffffff),
         strokeWidth: 1,
      });

      polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
         const dataContext = target.dataItem.dataContext;
         return getCountryColor(dataContext.views || 0);
      });

      polygonSeries.mapPolygons.template.states.create("hover", {
         fill: am5.color(0x003366),
      });

      const formattedData = countryData.map((country) => ({
         ...country,
         views: country.views ?? 0,
         downloads: country.downloads ?? 0,
      }));

      // Add logic for countries not in data
      polygonSeries.mapPolygons.template.adapters.add("tooltipText", (text, target) => {
         const dataContext = target.dataItem.dataContext;
         const views = dataContext.views !== undefined ? dataContext.views : 0;
         const downloads = dataContext.downloads !== undefined ? dataContext.downloads : 0;

         // Return updated tooltip text with defaults
         return `${dataContext.name}\nViews: ${views}\nPDF Downloads: ${downloads}`;
      });

      polygonSeries.data.setAll(formattedData);

      chart.current = mapChat;

      // Clean up on component unmount
      return () => {
         root.dispose();
      };
   }, []);

   // Update chart data when countryData changes
   useEffect(() => {
      if (chart.current) {
         const polygonSeries = chart.current.series.getIndex(0);
         polygonSeries.data.setAll(countryData.map(country => ({
            ...country,
            views: country.views ?? 0,
            downloads: country.downloads ?? 0,
         })));
      }
   }, [countryData]); // Run this effect when countryData changes

   return (

      <>
         <section className="card shadow border-1 mb-4">
            <div className="card-body pb-0">
               <h2 className="h4 mb-n2">Article Reads by Country</h2>
               <p className="mt-2 mb-1 py-0">
                  Hover your cursor over a country to see the number of online article
                  views and PDF downloads from JOHS only.
               </p>
            </div>
            <div className="card-header">
               <ul
                  className="nav nav-tabs card-header-tabs flex-nowrap align-items-center mb-n1"
                  role="tablist"
               >
                  <li className="nav-item me-3" role="presentation">
                     <a
                        className="nav-link px-0 py-2 border-0 rounded-1 active"
                        href="#worldMapPreview1"
                        data-bs-toggle="tab"
                        role="tab"
                        aria-controls="worldMapPreview1"
                        aria-selected="true"
                     >
                        <i className="ai-globe fs-lg opacity-90 me-2" />
                        Map
                     </a>
                  </li>
                  <li className="vr opacity-20 my-3 me-3" />
                  <li className="nav-item" role="presentation">
                     <a
                        className="nav-link px-0 py-2 border-0 rounded-1"
                        href="#worldMapPreview2"
                        data-bs-toggle="tab"
                        role="tab"
                        aria-controls="worldMapPreview2"
                        aria-selected="false"
                        tabIndex={-1}
                     >
                        <i className="ai-list fs-xl opacity-90 me-2" />
                        List
                     </a>
                  </li>
               </ul>
            </div>
            <div className="card-body">
               <div className="tab-content">
                  <div
                     className="tab-pane fade show active"
                     id="worldMapPreview1"
                     role="tabpanel"
                     style={{ width: '100%' }}
                  >
                     <div
                        className={`${styles.chartContainer} border rounded-3 p-0 m-0`}
                        ref={chartRef}
                     ></div>
                  </div>
                  <div className="tab-pane fade" id="worldMapPreview2" role="tabpanel">
                     {/* Basic table */}
                     <div className="table-responsive">
                        <table className="table" style={{ textAlign: "center" }}>
                           <thead>
                              <tr>
                                 <th scope="col">#</th>
                                 <th scope="col">Country</th>
                                 <th scope="col">Views</th>
                                 <th scope="col">Downloads</th>
                              </tr>
                           </thead>
                           <tbody>
                              {
                                 (countryData?.length != 0) ?
                                    countryData && countryData.map((singleCountryData, index) => {
                                       return (
                                          <tr key={"tr-" + singleCountryData._id}>
                                             <th scope="row">{++index}</th>
                                             <td>{singleCountryData?.country}</td>
                                             <td>{singleCountryData?.views}</td>
                                             <td>{singleCountryData?.downloads}</td>
                                          </tr>
                                       )
                                    }) : (
                                       <tr><td colSpan={4}>No data available</td></tr>
                                    )
                              }
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
};

export default WorldMapStats;
