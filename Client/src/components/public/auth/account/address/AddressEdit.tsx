const AddressEdit = () => {
    return (
        <form>
        <div className="row">
            <div className="col-12">
                <h4>edit address </h4>
            </div>

            <div className="col-md-6 col-lg-12 col-xl-6">
                <div className="fp__check_single_form">
                    <input type="text" placeholder="First Name" />
                </div>
            </div>

            <div className="col-md-6 col-lg-12 col-xl-6">
                <div className="fp__check_single_form">
                    <input type="text" placeholder="Last Name" />
                </div>
            </div>
            <div className="col-md-12 col-lg-12 col-xl-12">
                <div className="fp__check_single_form">
                    <input type="text"
                        placeholder="Company Name (Optional)" />
                </div>
            </div>
            <div className="col-md-6 col-lg-12 col-xl-6">
                <div className="fp__check_single_form">
                    <select id="select_js4">
                        <option value="">select country</option>
                        <option value="">bangladesh</option>
                        <option value="">nepal</option>
                        <option value="">japan</option>
                        <option value="">korea</option>
                        <option value="">thailand</option>
                    </select>
                </div>
            </div>
            <div className="col-md-6 col-lg-12 col-xl-6">
                <div className="fp__check_single_form">
                    <input type="text" placeholder="Street Address *" />
                </div>
            </div>
            <div className="col-md-6 col-lg-12 col-xl-6">
                <div className="fp__check_single_form">
                    <input type="text"
                        placeholder="Apartment, suite, unit, etc. (optional)" />
                </div>
            </div>
            <div className="col-md-6 col-lg-12 col-xl-6">
                <div className="fp__check_single_form">
                    <input type="text" placeholder="Town / City *" />
                </div>
            </div>
            <div className="col-md-6 col-lg-12 col-xl-6">
                <div className="fp__check_single_form">
                    <input type="text" placeholder="State *" />
                </div>
            </div>
            <div className="col-md-6 col-lg-12 col-xl-6">
                <div className="fp__check_single_form">
                    <input type="text" placeholder="Zip *" />
                </div>
            </div>
            <div className="col-md-6 col-lg-12 col-xl-6">
                <div className="fp__check_single_form">
                    <input type="text" placeholder="Phone *" />
                </div>
            </div>
            <div className="col-md-6 col-lg-12 col-xl-6">
                <div className="fp__check_single_form">
                    <input type="email" placeholder="Email *" />
                </div>
            </div>
            <div className="col-md-12 col-lg-12 col-xl-12">
                <div className="fp__check_single_form">
                    <textarea cols={3} rows={4}
                        placeholder="Address"></textarea>
                </div>
            </div>
            <div className="col-12">
                <div className="fp__check_single_form check_area">
                    <div className="form-check">
                        <input className="form-check-input" type="radio"
                            name="flexRadioDefault2"
                            id="flexRadioDefault12" />
                        <label className="form-check-label"
                            htmlFor="flexRadioDefault12">
                            home
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio"
                            name="flexRadioDefault2"
                            id="flexRadioDefault22" />
                        <label className="form-check-label"
                            htmlFor="flexRadioDefault22">
                            office
                        </label>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <button type="button"
                    className="common_btn cancel_edit_address">cancel</button>

                <button type="submit" className="common_btn">update
                    address</button>
            </div>
        </div>
    </form>
    )
}

export default AddressEdit;