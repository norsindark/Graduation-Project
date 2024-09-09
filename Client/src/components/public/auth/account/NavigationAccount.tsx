const NavigationAccount = () => {
    return (
        <div className="fp__dashboard_menu">
            <div className="dasboard_header">
                <div className="dasboard_header_img">
                    <img src="images/comment_img_2.png" alt="user" className="img-fluid w-100" />
                    <label htmlFor="upload"><i className="far fa-camera"></i></label>
                    <input type="file" id="upload" hidden />
                </div>
                <h2>hasib ahmed</h2>
            </div>
            <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                aria-orientation="vertical">
                <button className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill"
                    data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home"
                    aria-selected="true"><span><i className="fas fa-user"></i></span> Parsonal Info</button>

                <button className="nav-link" id="v-pills-address-tab" data-bs-toggle="pill"
                    data-bs-target="#v-pills-address" type="button" role="tab"
                    aria-controls="v-pills-address" aria-selected="true"><span><i
                        className="fas fa-user"></i></span>address</button>

                <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill"
                    data-bs-target="#v-pills-profile" type="button" role="tab"
                    aria-controls="v-pills-profile" aria-selected="false"><span><i
                        className="fas fa-bags-shopping"></i></span> Order</button>

                <button className="nav-link" id="v-pills-messages-tab2" data-bs-toggle="pill"
                    data-bs-target="#v-pills-messages2" type="button" role="tab"
                    aria-controls="v-pills-messages2" aria-selected="false"><span><i
                        className="far fa-heart"></i></span> wishlist</button>

                <button className="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill"
                    data-bs-target="#v-pills-messages" type="button" role="tab"
                    aria-controls="v-pills-messages" aria-selected="false"><span><i
                        className="fas fa-star"></i></span> Reviews</button>

                <button className="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill"
                    data-bs-target="#v-pills-settings" type="button" role="tab"
                    aria-controls="v-pills-settings" aria-selected="false"><span><i
                        className="fas fa-user-lock"></i></span> Change Password </button>

                <button className="nav-link" type="button"><span> <i className="fas fa-sign-out-alt"></i>
                </span> Logout</button>
            </div>
        </div>
    )
}

export default NavigationAccount;