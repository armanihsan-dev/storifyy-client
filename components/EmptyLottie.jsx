import Lottie from 'lottie-react';
import empty from '../constants/empty.json';
const EmptyLottie = () => {
  return (
    <div className="w-full flex justify-center">
      <Lottie
        animationData={empty}
        loop
        autoPlay
        style={{ width: 120, height: 100 }}
      />
    </div>
  );
};

export default EmptyLottie;
