import logo from '../../../assets/images/imagelogosyndev.png';

const LogoHeader = () => {
  return (
    <>
      <a className="navbar-brand" href="/">
        <img src={logo} alt="Sync Food" className="img-fluid" />
      </a>
    </>
  );
};

export default LogoHeader;
