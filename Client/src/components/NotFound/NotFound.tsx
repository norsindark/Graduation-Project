import {useNavigate} from "react-router-dom";
import {Button} from 'antd';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <>
            <section className="fp__404">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-5 col-md-7 m-auto">
                            <div className="fp__404_text wow fadeInUp" data-wow-duration="1s">
                                <img src="images/404_img.png" alt="404" className="img-fluid w-100"/>
                                <h2>That Page Doesn't Exist!</h2>
                                <p>Sorry, the page you were looking for could not be found.</p>
                                <Button shape="round" size="large" type="primary"
                                        onClick={() => navigate('/')}
                                ><span className="text-white">Back Home</span></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default NotFound;