const { ArticleHistory } = require("../../models/article/articleHistory");

exports.addArticleStatusHistory = async (historyId, title, status, changedBy) => {
   const resultArticleHistory = await ArticleHistory.findById(historyId);
   await resultArticleHistory.change_status_history_list.addToSet({
      title: title,
      status: status,
      changedBy: changedBy,
      date: new Date(),
   });

   const result = await resultArticleHistory.save();
   return result;
} // end function addArticleStatusHistory

/**
  * Add history on article editor change
  * @returns object
  */
exports.addArticleEditorHistory = async (historyId, title, changedBy, editorId) => {
   const resultArticleHistory = await ArticleHistory.findById(historyId);
   resultArticleHistory.change_editor_history_list.addToSet({
      title: title,
      editor: editorId,
      changedBy: changedBy,
      date: new Date(),
   });
   const result = await resultArticleHistory.save();
   return result;
} // end function addArticleEditorHistory

/**
  * Add history on article change
  * @returns object
  */
exports.addArticleEditHistory = async (historyId, title, changedBy) => {
   const resultArticleHistory = await ArticleHistory.findById(historyId);
   resultArticleHistory.change_edit_history_list.addToSet({
      title: title,
      changedBy: changedBy,
      date: new Date(),
   });
   const result = await resultArticleHistory.save();
   return result;
} // end function addArticleEditHistory