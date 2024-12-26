import { toggleModal } from "helpers/globalHelpers";
import "./article.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ArticleTableCardView = ({ id, data, setTableEditId, editor, tableLength = 0 }) => {

  // const [tableLength, setTableLength] = useState('');
  const { title, label, data: tableData } = data;

  const handleEditTable = () => {
    setTableEditId(id);
    toggleModal("#insertTableWidget");
  };
  const handleDelete = () => {
    const event = new CustomEvent("journalArticleDelete", {
      detail: { tableId: id },
    });
    window.dispatchEvent(event);
  };

  const [metaDetails, setMetaDetails] = useState({
    up: false,
    down: false,
    index: 0,
  });

  useEffect(() => {
    tableSort();
    window.addEventListener("updateTable", () => {
      tableSort();
    });

    // window.addEventListener("prevTablesNo", (e) => {
    //   setTableLength(e.detail.length);
    // })

  }, [editor, tableLength]);

  const tableSort = () => {
    editor.model.change((writer) => {
      const root = editor.model.document.getRoot();
      // debugger
      const range = writer.createRangeIn(root);
      let indexArr = [];
      for (const value of range.getWalker()) {

        if (
          value.type === "elementStart" &&
          value.item.is("element", "tablePreview")
        ) {
          indexArr.push(value.item.index);
        }
      }
      for (const value of range.getWalker()) {

        if (
          value.item.is("element", "tablePreview") &&
          value?.item?._attrs?.get("id") === id
        ) {
          setMetaDetails((prev) => ({
            // index: JSON.stringify({index}),
            index: indexArr?.indexOf(value.item.index) + 1 + tableLength,
            up: value.item.previousSibling ? false : true,
            down: value.item.nextSibling ? false : true,
          }));
          //   up: value.item.previousSibling ? false : true,
          //   down: value.item.nextSibling ? false : true,}, "")

        }
      }
    });
  };

  const handleSortUp = () => {
    editor.model.change((writer) => {
      const root = editor.model.document.getRoot();
      const range = writer.createRangeIn(root);
      const itemsToRemove = [];
      let testItem;
      for (const value of range.getWalker()) {

        //@fixme do r&d and find appropriate function to get ._attrs
        if (
          value.item.is("element", "tablePreview") &&
          value?.item?._attrs?.get("id") === id
        ) {
          if (value.type === "elementStart") {
          }
          itemsToRemove.push(value.item);
        } else {
          if (itemsToRemove.length === 0) {
            testItem = value;
          }
        }
      }
      // writer.move(itemsToRemove, testItem.item.name,testItem.item.startOffset)

      // for (const item of itemsToRemove) {
      //     // writer.remove(item); // remove all of the items.
      //     // writer.insert(item, testItem.item.name, testItem.item.startOffset)
      //     writer.insert( item, 'root' );
      // }
      writer.insert(itemsToRemove[0], testItem.item, "before");
      // writer.insert(itemsToRemove[1], testItem.item, 'end')
    });

    const event = new Event("updateTable");
    window.dispatchEvent(event);
  };

  const handleSortDown = () => {
    editor.model.change((writer) => {
      const root = editor.model.document.getRoot();
      const range = writer.createRangeIn(root);
      const itemsToRemove = [];
      let testItem;
      for (const value of range.getWalker()) {

        //@fixme do r&d and find appropriate function to get ._attrs
        if (
          value.item.is("element", "tablePreview") &&
          value?.item?._attrs?.get("id") === id
        ) {
          if (value.type === "elementStart") {
          }
          itemsToRemove.push(value.item);
        } else {
          if (itemsToRemove.length != 0 && !testItem) {
            testItem = value;
          }
        }
      }
      writer.insert(itemsToRemove[0], testItem.item, "after");
    });
    const event = new Event("updateTable");
    window.dispatchEvent(event);
  };


  return (
    <div className="article-card-block">
      <section
        key={"article-view-" + id}
        className="card card-lifted shadow px-3 py-3 my-3"
      >
        <article className="row g-0 border-0 pt-3">
          <div className="col-12">
            <div className="card-body px-3 py-2">
              <div className="d-md-flex align-items-center">
                <div className="d-sm-flex align-items-center">
                  <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0">
                    <i className="h1 text-nav fw-large ai-table p-4" />
                  </div>
                  <div className="pt-3 pt-sm-0 ps-sm-3">
                    <p className="fs-lg mb-1">
                      <span className='fw-bold'>Table {metaDetails?.index}:</span> {title} 
                    </p>
                    <div className="text-muted fw-medium d-flex flex-wrap flex-sm-nowrap align-items-center">
                      <div className="d-flex align-items-center">
                        <div className="meta-legend">
                          <p>{label}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-100 pt-3 pt-md-0 ms-md-auto" style={{ maxWidth: 212 }}>
                  <div className="d-flex flex-row mt-sm-n1 mb-0 mb-lg-1 mb-xl-3">

                    <div className={`${metaDetails.up ? 'disabled' : ''}  mx-2 action-btn`}>
                      <div className='remove-actions' onClick={handleSortUp}>
                        <i className='ai-circle-arrow-up '></i>
                      </div>
                    </div>
                    <div className={`${metaDetails.down ? 'disabled' : ''}  mx-2 action-btn`}>
                      <div className="remove-actions" onClick={handleSortDown}>
                        <i className='ai-circle-arrow-down '></i>
                      </div>
                    </div>
                    <div className=" edit_actions mx-2 action-btn" onClick={handleEditTable}>
                      <i className="ai-edit "></i> Edit
                    </div>
                    <div className=" remove-actions action-btn" onClick={() => { handleDelete(id) }}>
                      <i className="ai-trash "></i> Delete
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default ArticleTableCardView;
