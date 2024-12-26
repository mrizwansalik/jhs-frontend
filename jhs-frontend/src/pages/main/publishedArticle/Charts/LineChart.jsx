import React, { useEffect, useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useSelector } from 'react-redux';
import moment from 'moment';

const LineChart = () => {
  const graphData = useSelector((state) => state.home.singleArticleDateMatrices); // Get data from Redux
  const chart = useRef(null); // Reference to the chart instance

  useLayoutEffect(() => {
    let root = am5.Root.new("lineChatDiv");

    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart instance
    let lineChat = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout,
      })
    );

    // Create X-axis (DateAxis)
    let xAxis = lineChat.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: { timeUnit: 'day', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // Create Y-axis (ValueAxis)
    let yAxis = lineChat.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // Define the color scheme for Views and Downloads
    const viewsColor = am5.color(0x11397e);
    const downloadsColor = am5.color(0x145bbb);

    // Create Views Line Series (Bold line)
    let series1 = lineChat.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Views',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'views',
        valueXField: 'date',
        stroke: viewsColor, // Line color
        strokeWidth: 3, // Make the line bold
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY} Views',
          getFillFromSprite: false,
          getStrokeFromSprite: true,
          fill: viewsColor, // Tooltip color matching line
          stroke: viewsColor,
        }),
      })
    );

    // Create Downloads Line Series (Bold line)
    let series2 = lineChat.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Downloads',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'downloads',
        valueXField: 'date',
        stroke: downloadsColor, // Line color
        strokeWidth: 3, // Make the line bold
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY} Downloads',
          getFillFromSprite: false,
          getStrokeFromSprite: true,
          fill: downloadsColor, // Tooltip color matching line
          stroke: downloadsColor,
        }),
      })
    );

    // Add cursor
    lineChat.set('cursor', am5xy.XYCursor.new(root, {}));

    // Add legend
    let legend = lineChat.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(lineChat.series.values);

    chart.current = lineChat; // Save chart instance to ref

    return () => {
      root.dispose();
    };
  }, []); // This useLayoutEffect runs only once (on mount)

  // Update chart data when graphData changes
  useEffect(() => {
    if (chart.current && graphData) {
      const formattedData = graphData.map((item) => ({
        date: new Date(item.date).getTime(), // Convert date to timestamp
        views: item.views || 0,
        downloads: item.downloads || 0,
      }));

      const series1 = chart.current.series.getIndex(0); // Views series
      const series2 = chart.current.series.getIndex(1); // Downloads series

      // Update the series data
      series1.data.setAll(formattedData);
      series2.data.setAll(formattedData);
    }
  }, [graphData]); // This useEffect triggers whenever the graphData changes

  return (
    <>
      <section className="card shadow border-1 mb-4 mt-4">
        <div className="card-body pb-0">
          <h2 className="h4 mb-n2">Article Reads by UAE Regions</h2>
          <p className="mt-2 mb-1 py-0">Hover your cursor over a region to see the number of online article views and PDF downloads from JOHS only.</p>
          <p className="m-0 py-0">Note: JOHS does not share location data and not all reads included below as location data is not available for all IP addresses.</p>
        </div>
        <div className="card-header">
          <ul
            className="nav nav-tabs card-header-tabs flex-nowrap align-items-center mb-n1"
            role="tablist"
          >
            <li className="nav-item me-3" role="presentation">
              <a
                className="nav-link px-0 py-2 border-0 rounded-1 active"
                href="#lineChatPreview1"
                data-bs-toggle="tab"
                role="tab"
                aria-controls="lineChatPreview1"
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
                href="#lineChatPreview2"
                data-bs-toggle="tab"
                role="tab"
                aria-controls="lineChatPreview2"
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
              id="lineChatPreview1"
              role="tabpanel"
            >
              <div id="lineChatDiv" style={{ width: '100%', height: '500px' }}></div>
            </div>
            <div className="tab-pane fade" id="lineChatPreview2" role="tabpanel">
              {/* Basic table */}
              <div className="table-responsive">
                <table className="table" style={{ textAlign: "center" }}>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Date</th>
                      <th scope="col">Views</th>
                      <th scope="col">Downloads</th>
                    </tr>
                  </thead>
                  <tbody>

                    {
                      (graphData?.length != 0) ?
                        graphData && graphData.map((singleGraphData, index) => {
                          return (
                            <tr key={"tr-" + singleGraphData._id}>
                              <th scope="row">{++index}</th>
                              <td>{moment(singleGraphData?.date)?.format("LL")}</td>
                              <td>{singleGraphData?.views}</td>
                              <td>{singleGraphData?.downloads}</td>
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

export default LineChart;
