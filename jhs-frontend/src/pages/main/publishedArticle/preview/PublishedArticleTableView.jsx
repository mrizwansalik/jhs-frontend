const PublishedArticleTableView = ({ tableData, tableNo }) => {
    var pat = /\([0-9-0-9, ]*\)/g;
    var title = tableData?.title.replace(pat, "<a href='#references'>$&</a>");
    var label = tableData?.label.replace(pat, "<a href='#references'>$&</a>");
    var data = tableData?.data.replace(pat, "<a href='#references'>$&</a>");

    return <>
        <div className="article-card-block onnmed-table">
            <section
                key={`article-table-view-${tableNo}`}
                className=""
            >
                <article className="row g-0 border-0 pt-3">
                    <div className="col-12">
                        <p className="fs-lg mb-1">
                            <span className='fw-bold d-flex'>Table {tableNo}:</span> <div
                                className="ck-content"
                                dangerouslySetInnerHTML={{
                                    __html: title,
                                }}
                            />
                        </p>
                        <div className="mb-0 pb-0"
                            style={{
                                textAlign: "start",
                                textJustify: "auto",
                            }}
                        >
                            <div
                                className="ck-content"
                                dangerouslySetInnerHTML={{
                                    __html: data,
                                }}
                            />
                        </div>
                        <div className="text-muted fw-medium d-flex flex-wrap flex-sm-nowrap align-items-center mt-0 pt-0">
                            <div className="meta-legend">
                                <p>{label}</p>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    </>
}

export default PublishedArticleTableView