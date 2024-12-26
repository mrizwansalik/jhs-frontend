/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getTrendingKeywords } from 'store/home/publishedArticle/actions';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  
  const dispatch = useDispatch();
  const trendingKeywords  = useSelector((state) => state.home.trendingKeywords);

  useEffect(() => {
     dispatch(getTrendingKeywords({ body: {}, options: { __module: 'home' } }));
  }, []);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirect to the articles listing page with the query as a parameter
      navigate(`/articles?article_keyword=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="search-form">
      <div
        className="input-group mx-auto mx-lg-0"
        style={{ maxWidth: 550 }}
      >
        <span className="input-group-text text-muted">
          <i className="ai-search" />
        </span>
        <input
          className="form-control"
          type="text"
          placeholder="Search Article"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="button" onClick={handleSearchSubmit}>
          Search
        </button>
      </div>
      <ul className="list-inline d-xl-flex text-center text-lg-start mt-3 mb-0 mb-sm-2">
        
      {
        trendingKeywords?.slice(0, 4).map((keyword) => (
          <li key={`search_keyword_${keyword._id}`} className="d-inline-flex align-items-center text-nowrap pt-1 me-4  zindex-3" style={{ cursor: 'pointer' }}>
            <Link to={`/articles?article_keyword=${encodeURIComponent(keyword._id)}`} className="d-inline-flex align-items-center text-decoration-none">
              <i className="ai-search text-primary fs-xl me-2" />
              {keyword._id}
            </Link>
          </li>
        ))
      }
      </ul>
    </div>
  );
};

export default SearchBox;
