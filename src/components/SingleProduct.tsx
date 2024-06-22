import { useEffect, useState } from "react";
import Headr from "./Header";
export default function SingleProduct({ id }: { id: any }) {
  const [cartData, setCartData] = useState<any>([]);
  const [qty, setQty] = useState<any>(1);
  const [singleProduct, setSingleProduct] = useState<any>([]);

  useEffect(() => {
    async function getdata() {
      let getitem = await fetch("http://localhost:3001/cartlist");
      let addtocart = await getitem.json();
      setCartData(addtocart.getCartItem);
    }
    getdata();
  }, []);
  useEffect(() => {
    async function getdata() {
      let findProduct = await fetch("http://localhost:3001/product/" + id);
      let singleproduct = await findProduct.json();
      setSingleProduct(singleproduct.data);
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
      const url = "http://localhost:3001/cart/" + item.id;
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
        let create = await fetch("http://localhost:3001/carts", {
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
      <Headr carts={cartData} />
      {singleProduct.length && (
        <div className="container container-fluid">
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <img
                src={singleProduct[0].image}
                alt="sdf"
                height="500"
                width="500"
              />
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{singleProduct[0].title}</h3>
              <p id="product_id">Product # {singleProduct[0].id}</p>

              <hr />

              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{
                    width: `${(singleProduct[0].rating.rate / 5) * 100}%`,
                  }}
                ></div>
              </div>

              <hr />

              <p id="product_price">${singleProduct[0].price}</p>
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
                  onClick={() => addQty(singleProduct[0])}
                >
                  {" "}
                  +{" "}
                </span>
              </div>
              <button
                type="button"
                id="cart_btn"
                className="btn btn-primary d-inline ml-4"
                onClick={() => handleAddToItem(singleProduct[0])}
                disabled={singleProduct[0].qty <= 0 ? true : false}
                //   onClick={() => addToCart(singleProduct[0])}
                //   disabled={singleProduct[0].stock == 0}
              >
                Add to Cart
              </button>

              <hr />

              <p>
                Status:
                <span
                  id="stock_status"
                  style={{
                    color: singleProduct[0].qty <= 0 ? "red" : "green",
                  }}
                >
                  {singleProduct[0].qty <= 0 ? "Outof stock" : "In stock"}
                </span>
              </p>

              <hr />

              <h4 className="mt-2">Description:</h4>
              <p>{singleProduct[0].description}</p>
              <hr />
              <p id="product_seller mb-3">
                category: <strong>{singleProduct[0].category}</strong>
              </p>

              <div className="rating w-50"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
