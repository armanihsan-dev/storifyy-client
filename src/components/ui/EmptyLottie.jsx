import Lottie from 'lottie-react';
import Empty from '../../../public/lottie/Empty.json';

const EmptyLottie = () => {
  return (
    <div className="w-full flex justify-center">
      <Lottie
        animationData={Empty}
        loop
        autoPlay
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default EmptyLottie;
