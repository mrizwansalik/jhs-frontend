/* eslint-disable */
import React from 'react';
import { useSelector } from 'react-redux';

const Statistics = () => {
   
   const publicAuthor = useSelector((state) => state.home.publicAuthor);
   const home = useSelector((state) => state.home.currentIssuesList);

   return (
      <section className="bg-white position-relative py-4 py-md-5">
         <div className="container position-relative z-2">
            <div className="row row-cols-2 row-cols-md-4">
               <div className="col">
                  <div className="py-3 my-lg-2 my-xl-3">
                     <div className="text-dark display-4 mb-1">{home.length}</div>
                     <p className="fs-xl mb-0">Articles</p>
                  </div>
               </div>
               <div className="col">
                  <div className="py-3 ps-xl-4 my-lg-2 my-xl-3">
                     <div className="text-dark display-4 mb-1">{publicAuthor.length}+</div>
                     <p className="fs-xl mb-0">Author</p>
                  </div>
               </div>
               <div className="col d-flex justify-content-md-center">
                  <div className="py-3 my-lg-2 my-xl-3">
                     <div className="text-dark display-4 mb-1">1,5k</div>
                     <p className="fs-xl mb-0">Offline attendees</p>
                  </div>
               </div>
               <div className="col d-flex justify-content-md-end">
                  <div className="py-3 pe-xl-4 my-lg-2 my-xl-3">
                     <div className="text-dark display-4 mb-1">100%</div>
                     <p className="fs-xl mb-0">Good times</p>
                  </div>
               </div>
            </div>
         </div>
         <section className="container">
            <div className="row pt-1 pt-sm-3 pt-md-4 pt-lg-5 mt-xl-2">
               <div className="col-lg-12 col-xl-12">
                  <div className="ps-lg-4 ps-xl-0">
                     <div data-simplebar="init" className="">
                        <div className="simplebar-wrapper" style={{ margin: 0 }}>
                           <div className="simplebar-height-auto-observer-wrapper">
                              <div className="simplebar-height-auto-observer" />
                           </div>
                           <div className="simplebar-mask">
                              <div className="simplebar-offset" style={{ right: 0, bottom: 0 }}>
                                 <div
                                    className="simplebar-content-wrapper"
                                    tabIndex={0}
                                    role="region"
                                    aria-label="scrollable content"
                                    style={{ height: "auto", overflow: "hidden" }}
                                 >
                                    <div className="simplebar-content" style={{ padding: 0 }}>
                                       <ul
                                          className="nav nav-tabs flex-nowrap mb-2"
                                          role="tablist"
                                       >
                                          <li className="nav-item" role="presentation">
                                             <a
                                                className="nav-link text-nowrap px-4 px-lg-3 px-xl-4 active"
                                                href="#designers"
                                                data-bs-toggle="tab"
                                                role="tab"
                                                aria-selected="true"
                                             >
                                                UI/UX Designers
                                             </a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                             <a
                                                className="nav-link text-nowrap px-4 px-lg-3 px-xl-4"
                                                href="#developers"
                                                data-bs-toggle="tab"
                                                role="tab"
                                                aria-selected="false"
                                                tabIndex={-1}
                                             >
                                                Developers
                                             </a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                             <a
                                                className="nav-link text-nowrap px-4 px-lg-3 px-xl-4"
                                                href="#managers"
                                                data-bs-toggle="tab"
                                                role="tab"
                                                aria-selected="false"
                                                tabIndex={-1}
                                             >
                                                Managers
                                             </a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                             <a
                                                className="nav-link text-nowrap px-4 px-lg-3 px-xl-4"
                                                href="#marketers"
                                                data-bs-toggle="tab"
                                                role="tab"
                                                aria-selected="false"
                                                tabIndex={-1}
                                             >
                                                Marketers
                                             </a>
                                          </li>
                                       </ul>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div
                              className="simplebar-placeholder"
                              style={{ width: 746, height: 63 }}
                           />
                        </div>
                        <div
                           className="simplebar-track simplebar-horizontal"
                           style={{ visibility: "hidden" }}
                        >
                           <div
                              className="simplebar-scrollbar"
                              style={{ width: 0, display: "none" }}
                           />
                        </div>
                        <div
                           className="simplebar-track simplebar-vertical"
                           style={{ visibility: "hidden" }}
                        >
                           <div
                              className="simplebar-scrollbar"
                              style={{ height: 0, display: "none" }}
                           />
                        </div>
                     </div>
                     <div className="tab-content py-2 pb-md-0 pt-sm-3 pt-lg-4 mb-4 mb-md-5">
                        <div
                           className="tab-pane fade show active"
                           id="designers"
                           role="tabpanel"
                        >
                           <p className="fs-xl mb-4">
                              Ipsum sed nascetur dolor accumsan integer phasellus tincidunt.
                              Nulla quisque pellentesque adipiscing placerat integer feugiat
                              facilisi elit mi. Dictum nunc lacinia vel molestie laoreet aliquet
                              ridiculus diam justo viverra.
                           </p>
                           <ul className="fs-xl mb-0">
                              <li className="mb-1">At donec auctor quam ut scelerisque dui.</li>
                              <li className="mb-1">
                                 Mollis sed fringilla placerat lobortis viverra aliquam ut nisl
                                 nisi.
                              </li>
                              <li className="mb-1">
                                 Odio ullamcorper in praesent venenatis non non sed pharetra
                                 dipise.
                              </li>
                              <li className="mb-1">Lobortis dui nibh at condimentum.</li>
                           </ul>
                        </div>
                        <div className="tab-pane fade" id="developers" role="tabpanel">
                           <p className="fs-xl mb-4">
                              Etiam sed porta massa. In sapien metus, lobortis eu tortor id,
                              maximus commodo enim. Phasellus feugiat mi vitae enim cursus, ut
                              scelerisque augue scelerisque. Pellentesque habitant morbi
                              tristique senectus et netus.
                           </p>
                           <ul className="fs-xl mb-0">
                              <li className="mb-1">Donec imperdiet dolor at leo sodales.</li>
                              <li className="mb-1">
                                 Fringilla placerat lobortis viverra aliquam ut nisl nisi.
                              </li>
                              <li className="mb-1">
                                 Lobortis ullamcorper in praesent venenatis non non sed pharetra
                                 dipise.
                              </li>
                              <li className="mb-1">Mollis dui nibh at condimentum.</li>
                           </ul>
                        </div>
                        <div className="tab-pane fade" id="managers" role="tabpanel">
                           <p className="fs-xl mb-4">
                              Ipsum sed nascetur dolor accumsan integer phasellus tincidunt.
                              Nulla quisque pellentesque adipiscing placerat integer feugiat
                              facilisi elit mi. Dictum nunc lacinia vel molestie laoreet aliquet
                              ridiculus diam justo viverra.
                           </p>
                           <ul className="fs-xl mb-0">
                              <li className="mb-1">At donec auctor quam ut scelerisque dui.</li>
                              <li className="mb-1">
                                 Mollis sed fringilla placerat lobortis viverra aliquam ut nisl
                                 nisi.
                              </li>
                              <li className="mb-1">
                                 Odio ullamcorper in praesent venenatis non non sed pharetra
                                 dipise.
                              </li>
                              <li className="mb-1">Lobortis dui nibh at condimentum.</li>
                           </ul>
                        </div>
                        <div className="tab-pane fade" id="marketers" role="tabpanel">
                           <p className="fs-xl mb-4">
                              Etiam sed porta massa. In sapien metus, lobortis eu tortor id,
                              maximus commodo enim. Phasellus feugiat mi vitae enim cursus, ut
                              scelerisque augue scelerisque. Pellentesque habitant morbi
                              tristique senectus et netus.
                           </p>
                           <ul className="fs-xl mb-0">
                              <li className="mb-1">Donec imperdiet dolor at leo sodales.</li>
                              <li className="mb-1">
                                 Fringilla placerat lobortis viverra aliquam ut nisl nisi.
                              </li>
                              <li className="mb-1">
                                 Lobortis ullamcorper in praesent venenatis non non sed pharetra
                                 dipise.
                              </li>
                              <li className="mb-1">Mollis dui nibh at condimentum.</li>
                           </ul>
                        </div>
                     </div>
                     <a
                        className="btn btn-lg btn-primary w-100 w-sm-auto"
                        href="#tickets"
                        data-scroll=""
                        data-scroll-offset={120}
                     >
                        Buy access pass
                        <i className="ai-arrow-down ms-2 me-n2" />
                     </a>
                  </div>
               </div>
            </div>
         </section>
      </section>
   );
};

export default Statistics;
