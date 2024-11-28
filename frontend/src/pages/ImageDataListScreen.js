import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shop } from '../Shop';
import { getError } from '../Utils';
import LoadingBox from '../component/Loading';
import MessageBox from '../component/MessageError';
const ITEMS_PER_PAGE = 10;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        imagedata: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ImageDataListScreen() {
  const [{ loading, error, imagedata }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    imagedata: [],
  });
  const { etat } = useContext(Shop);
  const { userInfo } = etat;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/upload/allimages', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };

    fetchImageData();
  }, [userInfo]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = imagedata.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className='table-responsive'>
      <Helmet>
        <title>Image Data</title>
      </Helmet>
      <h1>Image Data</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <div>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>Image</th>
                <th>Type</th>
                <th>Predicted Classes</th>
                <th>Exif Data</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((image) => (
                <tr key={image._id}>
                  <td>
                    <img
                      src={`data:${
                        image.imageContentType
                      };base64,${arrayBufferToBase64(image.imageData.data)}`}
                      alt=''
                      className='image'
                      style={{ width: '200px', height: 'auto' }}
                    />
                  </td>
                  <td>{image.imageContentType}</td>
                  <td>
                    <ul>
                      {image.predictedClasses.map((cls, index) => (
                        <li key={index}>
                          Class: {cls.class}, Score:{' '}
                          {(cls.score * 100).toFixed(2)}%
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{JSON.stringify(image.exifData)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className='pagination'>
              {Array.from(
                { length: Math.ceil(imagedata.length / ITEMS_PER_PAGE) },
                (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      index + 1 === currentPage ? 'active' : ''
                    }`}
                  >
                    <button
                      className='page-link'
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
