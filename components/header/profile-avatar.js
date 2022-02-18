import truncateEthAddress from 'truncate-eth-address';
import {getUserAddress, getUserAvatarUrl} from '../../lib/client/authHandler.js';

export function ProfileAvatar() {

  return (
    <div className="w-12 flex items-center mr-5 md:mr-0">
      <img
        src={getUserAvatarUrl()}
        alt="Avatar"
        className="inline min-w-[3rem] min-h-[3rem] border-2 border-gray-400 rounded-full"
      />
      <div
        className="text-xs bg-orange-300 rounded-lg text-orange-700 relative left-[-4.1rem] bottom-[-1.6rem] min-w-max p-1">{truncateEthAddress(getUserAddress())}</div>
    </div>
  );
}
