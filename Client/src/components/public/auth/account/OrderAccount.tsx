const OrderAccount = () => {
  return (
    <div
      className="tab-pane fade"
      id="v-pills-profile"
      role="tabpanel"
      aria-labelledby="v-pills-profile-tab"
    >
      <div className="fp_dashboard_body">
        <h3>order list</h3>
        <div className="fp_dashboard_order">
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr className="t_header">
                  <th>Order</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
                <tr>
                  <td>
                    <h5>#2545758745</h5>
                  </td>
                  <td>
                    <p>July 16, 2022</p>
                  </td>
                  <td>
                    <span className="complete">Complated</span>
                  </td>
                  <td>
                    <h5>$560</h5>
                  </td>
                  <td>
                    <a className="view_invoice">View Details</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>#2457945235</h5>
                  </td>
                  <td>
                    <p>jan 21, 2021</p>
                  </td>
                  <td>
                    <span className="complete">complete</span>
                  </td>
                  <td>
                    <h5>$654</h5>
                  </td>
                  <td>
                    <a className="view_invoice">View Details</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>#2456875648</h5>
                  </td>
                  <td>
                    <p>July 11, 2020</p>
                  </td>
                  <td>
                    <span className="active">active</span>
                  </td>
                  <td>
                    <h5>$440</h5>
                  </td>
                  <td>
                    <a className="view_invoice">View Details</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>#7896542130</h5>
                  </td>
                  <td>
                    <p>July 16, 2022</p>
                  </td>
                  <td>
                    <span className="active">active</span>
                  </td>
                  <td>
                    <h5>$225</h5>
                  </td>
                  <td>
                    <a className="view_invoice">View Details</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>#4587964125</h5>
                  </td>
                  <td>
                    <p>jan 21, 2021</p>
                  </td>
                  <td>
                    <span className="cancel">cancel</span>
                  </td>
                  <td>
                    <h5>$335</h5>
                  </td>
                  <td>
                    <a className="view_invoice">View Details</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>#89698745895</h5>
                  </td>
                  <td>
                    <p>July 11, 2020</p>
                  </td>
                  <td>
                    <span className="complete">complete</span>
                  </td>
                  <td>
                    <h5>$200</h5>
                  </td>
                  <td>
                    <a className="view_invoice">View Details</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="fp__invoice">
          <a className="go_back">
            <i className="fas fa-long-arrow-alt-left"></i> go back
          </a>
          <div className="fp__track_order">
            <ul>
              <li className="active">order pending</li>
              <li>order accept</li>
              <li>order process</li>
              <li>on the way</li>
              <li>Completed</li>
            </ul>
          </div>
          <div className="fp__invoice_header">
            <div className="header_address">
              <h4>invoice to</h4>
              <p>
                7232 Broadway Suite 308, Jackson Heights, 11372, NY, United
                States
              </p>
              <p>+1347-430-9510</p>
            </div>
            <div className="header_address">
              <p>
                <b>invoice no: </b>
                <span>4574</span>
              </p>
              <p>
                <b>Order ID:</b> <span> #4789546458</span>
              </p>
              <p>
                <b>date:</b> <span>10-11-2022</span>
              </p>
            </div>
          </div>
          <div className="fp__invoice_body">
            <div className="table-responsive">
              <table className="table table-striped">
                <tbody>
                  <tr className="border_none">
                    <th className="sl_no">SL</th>
                    <th className="package">item description</th>
                    <th className="price">Price</th>
                    <th className="qnty">Quantity</th>
                    <th className="total">Total</th>
                  </tr>
                  <tr>
                    <td className="sl_no">01</td>
                    <td className="package">
                      <p>Hyderabadi Biryani</p>
                      <span className="size">small</span>
                      <span className="coca_cola">coca-cola</span>
                      <span className="coca_cola2">7up</span>
                    </td>
                    <td className="price">
                      <b>$120</b>
                    </td>
                    <td className="qnty">
                      <b>2</b>
                    </td>
                    <td className="total">
                      <b>$240</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="sl_no">02</td>
                    <td className="package">
                      <p>Daria Shevtsova</p>
                      <span className="size">medium</span>
                      <span className="coca_cola">coca-cola</span>
                    </td>
                    <td className="price">
                      <b>$120</b>
                    </td>
                    <td className="qnty">
                      <b>2</b>
                    </td>
                    <td className="total">
                      <b>$240</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="sl_no">03</td>
                    <td className="package">
                      <p>Hyderabadi Biryani</p>
                      <span className="size">large</span>
                      <span className="coca_cola2">7up</span>
                    </td>
                    <td className="price">
                      <b>$120</b>
                    </td>
                    <td className="qnty">
                      <b>2</b>
                    </td>
                    <td className="total">
                      <b>$240</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="sl_no">04</td>
                    <td className="package">
                      <p>Hyderabadi Biryani</p>
                      <span className="size">medium</span>
                      <span className="coca_cola">coca-cola</span>
                      <span className="coca_cola2">7up</span>
                    </td>
                    <td className="price">
                      <b>$120</b>
                    </td>
                    <td className="qnty">
                      <b>2</b>
                    </td>
                    <td className="total">
                      <b>$240</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="sl_no">05</td>
                    <td className="package">
                      <p>Daria Shevtsova</p>
                      <span className="size">large</span>
                    </td>
                    <td className="price">
                      <b>$120</b>
                    </td>
                    <td className="qnty">
                      <b>2</b>
                    </td>
                    <td className="total">
                      <b>$240</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="sl_no">04</td>
                    <td className="package">
                      <p>Hyderabadi Biryani</p>
                      <span className="size">medium</span>
                      <span className="coca_cola">coca-cola</span>
                      <span className="coca_cola2">7up</span>
                    </td>
                    <td className="price">
                      <b>$120</b>
                    </td>
                    <td className="qnty">
                      <b>2</b>
                    </td>
                    <td className="total">
                      <b>$240</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="sl_no">04</td>
                    <td className="package">
                      <p>Hyderabadi Biryani</p>
                      <span className="size">medium</span>
                      <span className="coca_cola">coca-cola</span>
                      <span className="coca_cola2">7up</span>
                    </td>
                    <td className="price">
                      <b>$120</b>
                    </td>
                    <td className="qnty">
                      <b>2</b>
                    </td>
                    <td className="total">
                      <b>$240</b>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="package" colSpan={3}>
                      <b>sub total</b>
                    </td>
                    <td className="qnty">
                      <b>12</b>
                    </td>
                    <td className="total">
                      <b>$755</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="package coupon" colSpan={3}>
                      <b>(-) Discount coupon</b>
                    </td>
                    <td className="qnty">
                      <b></b>
                    </td>
                    <td className="total coupon">
                      <b>$0.00</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="package coast" colSpan={3}>
                      <b>(+) Shipping Cost</b>
                    </td>
                    <td className="qnty">
                      <b></b>
                    </td>
                    <td className="total coast">
                      <b>$10.00</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="package" colSpan={3}>
                      <b>Total Paid</b>
                    </td>
                    <td className="qnty">
                      <b></b>
                    </td>
                    <td className="total">
                      <b>$765</b>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <a className="print_btn common_btn" href="#">
            <i className="far fa-print"></i> print PDF
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderAccount;
