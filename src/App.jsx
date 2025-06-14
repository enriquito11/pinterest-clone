import { useState, useEffect, useRef } from 'react'
import './App.css'
import Header from './components/Header'
import { createApi } from "unsplash-js";
import Masonry from '@mui/lab/Masonry';
import Card from './components/Card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useBookStore } from './store/bookStore';

const api = createApi({
  // Don't forget to set your access token here!
  // See https://unsplash.com/developers
  accessKey: import.meta.env.VITE_ACCESKEY
});


function App() {
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(true)

  let index = useRef(1);

  console.log("key:",import.meta.env.VITE_ACCESKEY);

  const val = useBookStore(state => state.value);

console.log('data', data);
  useEffect(() => {
    index.current = 1;
    setHasMore(true);

    api.search
      .getPhotos({ query: val, perPage: 20, page: index.current })
      .then(result => {
        setData(result.response.results);
      })
      .catch(() => {
        console.log("something went wrong!");
      });
  }, [val]);

  const moreData = () => {
    
    index.current = index.current + 1;
    if (index.current === 3) {
      setHasMore(false);
    }
  
    api.search
      .getPhotos({ query: val, perPage: 20, page: index.current })
      .then(result => {
        setData(data.concat(result.response.results));
      })
      .catch(() => {
        console.log("something went wrong!");
      });

  };

  return (
    <div className="container">
      <Header />
      <InfiniteScroll
    dataLength={data.length}
    next={moreData}
    hasMore={hasMore}
    loader={<h4>Loading...</h4>}
    style={{ overflow: 'none' }}
  >
      <Masonry 
      columns={{ xs: 2, sm: 3, md: 5 }} 
      spacing={{ xs: 1, sm: 2, md: 3 }} 
      className='masonry'>
      {
        data.map((item) => {
          return (
            <Card key={item.id} item={item}/>
          )
        })
      }
      </Masonry>
      </InfiniteScroll>
    </div>
      
  )
}

export default App
