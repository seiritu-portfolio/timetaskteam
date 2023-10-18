import React from 'react';
import Image from 'next/image';
import Slider from 'react-slick';

import LogoLargeIcon from '@svg/logo.large.svg';
import appStoreLogo from '@image/appstore.png';
import playstoreLogo from '@image/play_store_logo.png';

import { SLIDE_CLASSNAME_LIST } from '@util/constants';

// * import image resources
const TopSlider = () => {
  return (
    <Slider
      dots={true}
      infinite={true}
      slidesToShow={1}
      fade={true}
      autoplay={true}
      autoplaySpeed={4000}
      slidesToScroll={1}
    >
      {SLIDE_CLASSNAME_LIST.map((classname, index) => {
        return (
          <React.Fragment key={`top-page-slide-${index}`}>
            <LogoLargeIcon className="absolute left-40px top-80px h-660px z-20" />
            <div className={`relative w-full h-screen ${classname}`}>
              <div className="absolute bottom-0 p-40px">
                <span className="big-title-light text-backgroundSecondary">
                  カレンダーでタスクを管理しよう
                </span>
                <div className="mt-72px flex flex-row items-center">
                  <button className="cursor-pointer" onClick={() => {}}>
                    <Image
                      src={appStoreLogo}
                      alt=""
                      width={135}
                      height={40}
                      className="object-cover active:opacity-80"
                    />
                  </button>
                  <button className="ml-24px cursor-pointer">
                    <Image
                      src={playstoreLogo}
                      alt=""
                      width={135}
                      height={40}
                      className="object-cover active:opacity-80 "
                    />
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </Slider>
  );
};

export default TopSlider;
