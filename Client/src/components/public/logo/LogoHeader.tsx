import logo from '../../../assets/images/imagelogosyndev.png';

const LogoHeader = () => {
  return (
    <>
      <a className="navbar-brand" href="/">
        <img src={logo} alt="Sync Food" className="logo-header" />
      </a>
    </>
  );
};

export default LogoHeader;
