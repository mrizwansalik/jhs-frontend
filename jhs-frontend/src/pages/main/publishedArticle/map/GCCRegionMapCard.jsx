import React, { useState } from "react";
import { useSelector } from "react-redux";

import SaudiRegionMap from "./SaudiRegionMap";
import UAERegionMap from "./UAERegionMap";
import QatarRegionMap from "./QatarRegionMap";
import OmanRegionMap from "./OmanRegionMap";
import KuwaitRegionMap from "./KuwaitRegionMap";
import BahrainRegionMap from "./BahrainRegionMap";

const GCCRegionMapCard = () => {
   const [userCountry, setUserCountry] = useState(null);
   const [activeTab, setActiveTab] = useState("saudi");

   const saudiRegionData = useSelector((state) => state.home.singleArticleSaudiRegionMetrics);
   const UAERegionData = useSelector((state) => state.home.singleArticleUAERegionMetrics);
   const qatarRegionData = useSelector((state) => state.home.singleArticleQatarRegionMetrics);
   const omanRegionData = useSelector((state) => state.home.singleArticleOmanRegionMetrics);
   const kuwaitRegionData = useSelector((state) => state.home.singleArticleKuwaitRegionMetrics);
   const bahrainRegionData = useSelector((state) => state.home.singleArticleBahrainRegionMetrics);

   const gccRegionData = [
     ...(saudiRegionData || []),
     ...(UAERegionData || []),
     ...(qatarRegionData || []),
     ...(omanRegionData || []),
     ...(kuwaitRegionData || []),
     ...(bahrainRegionData || []),
   ];

   const gccRegions = [
      { id: 'saudi', name: "Saudi Arabia", content: <SaudiRegionMap />, icon: "ai-globe" },
      { id: 'uae', name: "United Arab Emirates", content: <UAERegionMap />, icon: "ai-map" },
      { id: 'qatar', name: "Qatar", content: <QatarRegionMap />, icon: "ai-flag" },
      { id: 'oman', name: "Oman", content: <OmanRegionMap />, icon: "ai-map" },
      { id: 'kuwait', name: "Kuwait", content: <KuwaitRegionMap />, icon: "ai-compass" },
      { id: 'bahrain', name: "Bahrain", content: <BahrainRegionMap />, icon: "ai-map" },
    ]; 

   return (
      <section className="card shadow border-1 mb-4">
         <div className="card-body pb-0">
            <h2 className="h4 mb-n2">Article Reads by GCC Regions</h2>
            <p className="mt-2 mb-1 py-0">
               Hover your cursor over a region to see the number of online article views and PDF downloads from JOHS only.
            </p>
            <p className="m-0 py-0">
               Note: JOHS does not share location data and not all reads included below as location data is not available for all IP addresses.
            </p>
         </div>
         <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs flex-nowrap align-items-center mb-n1" role="tablist">
               {gccRegions.map((region) => (
                  <>
                     <li className="nav-item me-3" role="presentation" key={region.id}>
                        <a
                           className={`nav-link px-0 py-2 border-0 rounded-1 ${activeTab === region.id ? "active" : ""}`}
                           href={`#${region.id}RegionMapPreview1`}
                           data-bs-toggle="tab"
                           role="tab"
                           aria-controls={`${region.id}RegionMapPreview1`}
                           aria-selected={activeTab === region.id}
                           onClick={() => setActiveTab(region.id)}
                        >
                           <i className={`${region.icon} fs-lg opacity-90 me-2`} />
                           {region.name}
                        </a>
                     </li>
                     <li className="vr opacity-20 my-3 me-3" />
                  </>
               ))}
              
               <li className="nav-item" role="presentation">
                  <a
                     className={`nav-link px-0 py-2 border-0 rounded-1 ${activeTab === "list" ? "active" : ""}`}
                     href="#bahrainRegionMapPreview2"
                     data-bs-toggle="tab"
                     role="tab"
                     aria-controls="bahrainRegionMapPreview2"
                     aria-selected={activeTab === "list"}
                     tabIndex={-1}
                     onClick={() => setActiveTab("list")}
                  >
                     <i className="ai-list fs-xl opacity-90 me-2" />
                     List
                  </a>
               </li>
            </ul>
         </div>
         <div className="card-body">
            <div className="tab-content">
               {gccRegions.map((region) => (
                  <div
                     key={region.id}
                     className={`tab-pane fade ${activeTab === region.id ? "show active" : ""}`}
                     id={`${region.id}RegionMapPreview1`}
                     role="tabpanel"
                  >
                     {region.content}
                  </div>
               ))}

               <div className={`tab-pane fade ${activeTab === "list" ? "show active" : ""}`} id="bahrainRegionMapPreview2" role="tabpanel">
                  {/* Basic table */}
                  <div className="table-responsive">
                     <table className="table" style={{ textAlign: "center" }}>
                        <thead>
                           <tr>
                              <th scope="col">#</th>
                              <th scope="col">Region</th>
                              <th scope="col">Views</th>
                              <th scope="col">Downloads</th>
                           </tr>
                        </thead>
                        <tbody>
                           {gccRegionData?.length ? (
                              gccRegionData.map((singleRegionData, index) => (
                                 <tr key={`tr-${singleRegionData._id}`}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{singleRegionData?.name}, {singleRegionData?.country}</td>
                                    <td>{singleRegionData?.views}</td>
                                    <td>{singleRegionData?.downloads}</td>
                                 </tr>
                              ))
                           ) : (
                              <tr><td colSpan={4}>No data available</td></tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default GCCRegionMapCard;
