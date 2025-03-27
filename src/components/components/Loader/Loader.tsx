import React from 'react';
import Quosha from "../../../images/Vanilla@1x-1.0s-280px-250px.svg";

const Loader: React.FC<{ transition: boolean }> = ({ transition }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-[--main-color] transition-opacity duration-700 ${transition ? 'opacity-100' : 'opacity-0'}`}>
      <img className='w-[150px] lg:w-[250px] md:w-[200px]' src={Quosha} alt="Quosha Ink" />
    </div>
  );
}

export default Loader;
