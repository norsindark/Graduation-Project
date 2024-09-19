import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const NotPermitted = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="fp__404">
        <div className="container">
          <div className="row">
            <div className="col-xl-5 col-md-7 m-auto">
              <div className="fp__404_text wow fadeInUp" data-wow-duration="1s">
                <img
                  src="images/403_img.png"
                  alt="403"
                  className="img-fluid w-100"
                />
                <h2>You are not authorized!</h2>
                <p>Sorry, you are not authorized to access this page.</p>
                <Button
                  size="large"
                  shape="round"
                  type="primary"
                  onClick={() => navigate('/')}
                >
                  <span className="text-white">Back Home</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotPermitted;
