import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { listPageLoader } from "../../lib/loaders";
import { Await, useLoaderData } from "react-router-dom";
import React from "react";

function ListPage() {
  const data = useLoaderData();

  return <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <Filter/>
        <React.Suspense
        fallback={<p>Loading ...</p>}
      >
        <Await
          resolve={data.postResponse}
          errorElement={
            <p>Error loading Posts!</p>
          }
        >
          {(postResponse) => (
           postResponse.data.map((item)=>(<Card key={item.id} item={item}/>))
          )}
        </Await>
      </React.Suspense>
      </div>
    </div>
    <div className="mapContainer">
    <React.Suspense
        fallback={<p>Loading Map...</p>}
      >
        <Await
          resolve={data.postResponse}
          errorElement={
            <p>Error loading Posts!</p>
          }
        >
          {(postResponse) => (
           <Map items={postResponse.data}/>
          )}
        </Await>
      </React.Suspense>
      
    </div>
  </div>;
}

export default ListPage;
