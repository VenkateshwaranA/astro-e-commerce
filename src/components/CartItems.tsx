import { useEffect, useState } from "react";
import Headr from "./Header";
export default function CartItems() {
  const [cart, setCart] = useState<any>([]);
  const [order, setOrder] = useState<any>(false);
  useEffect(() => {
    async function fetchdata() {
      const res = await fetch("http://localhost:3001/cartlist");
      let data = await res.json();
      setCart(data.getCartItem);
    }
    fetchdata();
  }, []);

  const removeItem = async (item: any) => {
    let deleted = await fetch("http://localhost:3001/delete/" + item.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    let updateData = await deleted.json();
    let remaingItem = updateData.remainingcart;

    setCart(remaingItem);
  };

  const handleOrders = async () => {
    try {
      if (cart.length) {
        await fetch("http://localhost:3001/order", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cart),
        }).then(() => {
          setOrder(true);
          setCart([]);
        });
      }
    } catch (err) {
      console.log({err});
    }
  };
  return (
    <>
      <Headr carts={cart} />
      {cart.length > 0 ? (
        <>
          <div className="container container-fluid">
            <h2 className="mt-5">
              Your Cart: <b>{cart.length}</b>
            </h2>

            <div className="row d-flex justify-content-between">
              <div className="col-12 col-lg-8">
                {cart.map((item: any) => (
                  <>
                    <hr />
                    <div className="cart-item" key={item.id}>
                      <div className="row align-items-center">
                        <div className="col-4 col-lg-3 ">
                          <img
                            src={item.image}
                            alt="Laptop"
                            height="90"
                            width="115"
                          />
                        </div>

                        <div className="col-5 col-lg-3">
                          <a href={"item/" + item.id}>{item.title}</a>
                        </div>

                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                          <p id="card_item_price">${item.price}</p>
                        </div>
                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                          <div className="stockCounter d-flex align-items-center">
                            Quantity :<h3>{item.qty}</h3>
                          </div>
                        </div>

                        <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                          <i
                            id="delete_cart_item"
                            className="fa fa-trash btn btn-danger"
                            onClick={() => removeItem(item)}
                          ></i>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </>
                ))}
              </div>

              <div className="col-12 col-lg-3 my-4">
                <div id="order_summary">
                  <h4>Order Summary</h4>
                  <hr />
                  <p>
                    Subtotal:
                    <span className="order-summary-values">
                      {cart.reduce((acc: any, item: any) => acc + item.qty, 0)}{" "}
                      (Units)
                    </span>
                  </p>
                  <p>
                    Est. total:{" "}
                    <span className="order-summary-values">
                      $
                      {cart
                        .reduce(
                          (acc: any, item: any) => acc + item.price * item.qty,
                          0
                        )
                        .toFixed(2)}{" "}
                    </span>
                  </p>

                  <hr />
                  <button
                    id="checkout_btn"
                    onClick={() => handleOrders()}
                    className="btn btn-primary btn-block"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : order ? (
        <div className="emptycart">
          <div className="position-fixed rounded-full bg-gradient-to-r h-30"></div>
          <h2>Order Complete!</h2>
          <p>Your order has been placed successfully</p>
        </div>
      ) : (
        <h2 className="emptycart">Your Cart is Empty</h2>
      )}
    </>
  );
}
