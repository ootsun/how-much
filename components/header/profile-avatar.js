import truncateEthAddress from 'truncate-eth-address';
import {getUserAddress, getUserAvatarUrl} from '../../lib/client/authHandler.js';
import Image from 'next/image';

export function ProfileAvatar() {

  return (
    <div className="w-12 flex items-center mr-5 md:mr-0">
      <div className="absolute w-[3rem] h-[3rem] border-2 border-gray-400 rounded-full">
        <Image
          src={getUserAvatarUrl()}
          alt="Avatar"
          width="48"
          height="48"/>
      </div>
      <div
        className="text-xs bg-orange-500 rounded-lg text-white relative left-[-1.4rem] bottom-[-1.5rem] min-w-max p-1">{truncateEthAddress(getUserAddress())}</div>
    </div>
  );
}
