const TotalOrder = () => {
  return (
    <div className="fp__dsahboard_overview">
      <div className="row">
        <div className="col-xl-4 col-sm-6 col-md-4">
          <div className="fp__dsahboard_overview_item">
            <span className="icon">
              <i className="far fa-shopping-basket"></i>
            </span>
            <h4>
              total order <span>(76)</span>
            </h4>
          </div>
        </div>
        <div className="col-xl-4 col-sm-6 col-md-4">
          <div className="fp__dsahboard_overview_item green">
            <span className="icon">
              <i className="far fa-shopping-basket"></i>
            </span>
            <h4>
              Completed <span>(71)</span>
            </h4>
          </div>
        </div>
        <div className="col-xl-4 col-sm-6 col-md-4">
          <div className="fp__dsahboard_overview_item red">
            <span className="icon">
              <i className="far fa-shopping-basket"></i>
            </span>
            <h4>
              cancel <span>(05)</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalOrder;
