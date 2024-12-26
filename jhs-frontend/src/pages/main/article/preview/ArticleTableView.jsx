const ArticleTableView = ({ tableData, tableNo }) => {
    return <>
        <div className="article-card-block onnmed-table">
            <section
                key={`article-table-view-${tableNo}`}
                className=""
            >
                <article className="row g-0 border-0 pt-3">
                    <div className="col-12">
                        <p className="fs-lg mb-1">
                            <span className='fw-bold'>Table {tableNo}:</span> {tableData?.title}
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
                                    __html: tableData?.data,
                                }}
                            />
                        </div>
                        <div className="text-muted fw-medium d-flex flex-wrap flex-sm-nowrap align-items-center mt-0 pt-0">
                            <div className="meta-legend">
                                <p>{tableData?.label}</p>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    </>
}

export default ArticleTableView