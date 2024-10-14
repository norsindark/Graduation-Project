import HashLoader from 'react-spinners/HashLoader';

const Loading = () => {
  const style: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div style={style}>
      <HashLoader color="#4caf50" />
    </div>
  );
};

export default Loading;
