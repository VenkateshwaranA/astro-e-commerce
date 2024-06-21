export default function Carts({ carts }: { carts: any[] }) {

  return (
    <>
      <section className="container mt-5">
        <div className="row">
          {carts.map((item: any) => (
            <div className="col-sm-12 col-md-6 col-lg-3 my-3">
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
