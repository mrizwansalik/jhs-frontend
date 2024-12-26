import React, { useState } from 'react';

const ParagraphTracker = () => {
  const [content, setContent] = useState('Initial content.');
  const [editedContent, setEditedContent] = useState('');
  const [changes, setChanges] = useState([]);
  const [revisionHistory, setRevisionHistory] = useState([]);

  const handleContentChange = (event) => {
    setEditedContent(event.target.value);
  };

  const handleSaveChanges = () => {
    if (editedContent.trim() !== '') {
      const change = {
        original: content,
        edited: editedContent,
        status: 'pending' // 'pending', 'accepted', or 'rejected'
      };

      setChanges([...changes, change]);
      setRevisionHistory([...revisionHistory, editedContent]);
      setContent(editedContent);
      setEditedContent('');
    }
  };

  const acceptChange = (index) => {
    const updatedChanges = [...changes];
    updatedChanges[index].status = 'accepted';
    setChanges(updatedChanges);
    setContent(updatedChanges[index].edited);
  };

  const rejectChange = (index) => {
    const updatedChanges = [...changes];
    updatedChanges[index].status = 'rejected';
    setChanges(updatedChanges);
    setEditedContent(updatedChanges[index].original);
  };

  return (
    <div>
      <div>
        <textarea
          value={editedContent}
          onChange={handleContentChange}
          placeholder="Edit the text here..."
          rows={5}
          cols={50}
        />
        <br />
        <button onClick={handleSaveChanges}>Save Changes</button>
      </div>

      <div>
        <h3>Revision History:</h3>
        <ul>
          {revisionHistory.map((revision, index) => (
            <li key={index}>{revision}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Changes:</h3>
        <ul>
          {changes.map((change, index) => (
            <li key={index}>
              <div>
                <strong>Original:</strong> {change.original}
              </div>
              <div>
                <strong>Edited:</strong> {change.edited}
              </div>
              <div>
                {change.status === 'pending' && (
                  <div>
                    <button onClick={() => acceptChange(index)}>Accept</button>
                    <button onClick={() => rejectChange(index)}>Reject</button>
                  </div>
                )}
                <em>Status: {change.status}</em>
              </div>
              <div>
                {change.status !== 'pending' && (
                  <div>
                    <span style={{ color: change.status === 'accepted' ? 'green' : 'red' }}>
                      {change.status === 'accepted' ? 'Added' : 'Removed'} Text Highlighted:
                    </span>{' '}
                    <span style={{ backgroundColor: change.status === 'accepted' ? 'lightgreen' : 'pink' }}>
                      {change.edited}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ParagraphTracker;
