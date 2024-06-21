import React, { useEffect, useState } from "react";
import Headr from "./Header";
export default function SingleProduct({
  singleProduct,
}: {
  singleProduct: any;
}) {
  const [cartData, setCartData] = useState<any>([]);
  const [qty, setQty] = useState<any>(1);
  useEffect(() => {
    async function getdata() {
      let getitem = await fetch("http://localhost:8080/cartlist");
      let addtocart = await getitem.json();
      setCartData(addtocart.getCartItem);
    }
    getdata();
  }, []);

  const addQty = (item: any) => {
    if (item.qty == qty) return;
    setQty((q: any) => q + 1);
  };
  const reduceQty = () => {
    if (qty > 1) {
      setQty((state: any) => state - 1);
    }
  };
  const handleAddToItem = async (item: any) => {
    try {
      const url = "http://localhost:8080/cart/" + item.id;
      let data: any = { ...item, qty: qty };
      delete data["_id"];

      let update = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let updateCart = await update.json();
      if (updateCart.updateItem == null) {
        let create = await fetch("http://localhost:8080/carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let createItemsTocart = await create.json();
        setCartData((pre: any) => [...pre, createItemsTocart.cartItems]);
      }
    } catch (err) {
      console.log("error in fileee", err);
    }
  };

  return (
    <>
      <Headr items={cartData} />

      <div className="container container-fluid">
        <div className="row f-flex justify-content-around">
          <div className="col-12 col-lg-5 img-fluid" id="product_image">
            <img src={singleProduct.image} alt="sdf" height="500" width="500" />
          </div>

          <div className="col-12 col-lg-5 mt-5">
            <h3>{singleProduct.title}</h3>
            <p id="product_id">Product # {singleProduct.id}</p>

            <hr />

            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{
                  width: `${(singleProduct.rating.rate / 5) * 100}%`,
                }}
              ></div>
            </div>

            <hr />

            <p id="product_price">${singleProduct.price}</p>
            <div className="stockCounter d-inline">
              <span className="btn btn-danger minus" onClick={reduceQty}>
                {" "}
                -{" "}
              </span>

              <input
                type="number"
                className="form-control count d-inline"
                value={qty}
                readOnly
              />

              <span
                className="btn btn-primary plus"
                onClick={() => addQty(singleProduct)}
              >
                {" "}
                +{" "}
              </span>
            </div>
            <button
              type="button"
              id="cart_btn"
              className="btn btn-primary d-inline ml-4"
              onClick={() => handleAddToItem(singleProduct)}
              disabled={singleProduct.qty <= 0 ? true : false}
              //   onClick={() => addToCart(singleProduct)}
              //   disabled={singleProduct.stock == 0}
            >
              Add to Cart
            </button>

            <hr />

            <p>
              Status:
              <span
                id="stock_status"
                style={{
                  color: singleProduct.qty <= 0 ? "red" : "green",
                }}
              >
                {singleProduct.qty <= 0 ? "Outof stock" : "In stock"}
              </span>
            </p>

            <hr />

            <h4 className="mt-2">Description:</h4>
            <p>{singleProduct.description}</p>
            <hr />
            <p id="product_seller mb-3">
              category: <strong>{singleProduct.category}</strong>
            </p>

            <div className="rating w-50"></div>
          </div>
        </div>
      </div>
    </>
  );
}
