const PublishedArticleFigureView = ({ figureData, figureNo }) => {

    var pat = /\([0-9-0-9, ]*\)/g;

    var title = figureData?.title.replace(pat, "<a href='#references'>$&</a>");
    var label = figureData?.label.replace(pat, "<a href='#references'>$&</a>");

    return <>
        <div className="article-card-block onnmed-figure">
            <section
                key={`article-figure-view-${figureData?._id}`}
                className=""
            >
                <article className="row g-0 border-0 mb-4">
                    <img
                        className="col-sm-12 col-lg-12 bg-repeat-0 bg-size-cover bg-position-center rounded-5"
                        src={`${figureData?.medium_url ? `${import.meta.env.VITE_REACT_APP_URL}/public/${figureData?.medium_url}` : '/assets/img/avatar/user.png'}`}
                        style={{

                        }}
                        alt={`Figure ${figureNo}: ${figureData?.title} Image`}
                    />
                    <div className="col-sm-12 col-lg-12">
                        <div className="pt-4 pb-sm-4 ps-sm-4 pe-lg-4">
                            <p className="fs-lg mb-1">
                                <span className='fw-bold d-flex'>Figure {figureNo}:</span> <div
                                    className="ck-content"
                                    dangerouslySetInnerHTML={{
                                        __html: title,
                                    }}
                                />
                            </p>
                            <p className="meta-legend">
                                {label}
                            </p>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    </>
}

export default PublishedArticleFigureView