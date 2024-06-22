import { useEffect, useState } from "react";
import Headr from "./Header";
export default function Carts() {
  const [carts, setCarts] = useState([]);
  const [cartList, setCrtList] = useState([]);
  useEffect(() => {
    async function getdata() {
      const res = await fetch("http://localhost:3001");
      let data = await res.json();
      setCarts(data.data);
      const response = await fetch("http://localhost:3001/cartlist");
      let resdata = await response.json();
      setCrtList(resdata.getCartItem);
    }
    getdata();
  }, []);

  return (
    <>
      <Headr carts={cartList} />
      <section className="container mt-5">
        <div className="row">
          {carts.map((item: any) => (
            <div key={item.id} className="col-sm-12 col-md-6 col-lg-3 my-3">
              <div className="card p-3 rounded">
                <img className="card-img-top mx-auto w-50" src={item.image} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    <a href={"/item/" + item.id}>{item.title}</a>
                  </h5>
                  <div className="ratings mt-auto">
                    <div className="rating-outer">
                      <div
                        className="rating-inner"
                        style={{
                          width: `${(item?.rating.rate / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="card-text">${item.price}</p>
                  <a
                    href={"/item/" + item.id}
                    id="view_btn"
                    className="btn btn-block"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
