import logo from "./logo.svg";
import "./App.css";
//import "./style.css";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function App() {
  const ACCESS_KEY = "uGB0KsbCmxgX2F8ghzUD0g-Si2ldgbcod_DNon1MQqo";
  const [imageUrls, setImageUrls] = useState([]);
  const [searchText, setSearchText] = useState("dog");
  const [finalSearch, setFinalSearch] = useState("");
  const [fetchAPIPage, setFetchAPIPage] = useState({
    currentPage: 0,
    totalPage: 0,
    total: 0,
  });

  useEffect(() => {
    if (!finalSearch) {
      return;
    }
    setFetchAPIPage({
      currentPage: 0,
      totalPage: 0,
      total: 0,
    });
    setImageUrls([]);
    loadImages();
  }, [finalSearch]);

  async function loadImages() {
    const response = await fetch(
      `https://api.unsplash.com/search/photos/?page=${
        fetchAPIPage.currentPage + 1
      }&per_page=10&query=${searchText}&client_id=${ACCESS_KEY}`
    );
    const imageResult = await response.json();
    console.log(imageResult);

    setFetchAPIPage({
      currentPage: fetchAPIPage.currentPage + 1,
      totalPage: imageResult.total_pages,
      total: imageResult.total,
    });
    if (imageResult.total_pages === 0) return;
    setImageUrls([
      ...imageUrls,
      ...imageResult.results.map((image) => image.urls.small),
    ]);
  }

  return (
    <div className="App">
      <div className="searchbar">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={() => setFinalSearch(searchText)}>Search</button>
      </div>
      <div className="gallery">
        <InfiniteScroll
          dataLength={imageUrls.length}
          next={loadImages}
          hasMore={fetchAPIPage.currentPage < fetchAPIPage.totalPage} // Replace with a condition based on your data source
          loader={
            <div>
              <img
                src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"
                alt="Loading..."
                height="75"
              />
            </div>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              {fetchAPIPage.totalPage == 0 ? (
                <b>There is no data</b>
              ) : (
                <b>No more images</b>
              )}
            </p>
          }
        >
          {imageUrls.map((url) => (
            <img width="300" height="300" src={url}></img>
          ))}
        </InfiniteScroll>
        {/* {imageUrls.map((url) => (
          <img src={url} />
        ))} */}
      </div>
    </div>
  );
}

export default App;
