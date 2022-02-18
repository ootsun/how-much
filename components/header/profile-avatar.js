import truncateEthAddress from 'truncate-eth-address';
import {getUserAddress, getUserAvatarUrl} from '../../lib/client/authHandler.js';

export function ProfileAvatar() {

  return (
    <div className="w-12 flex items-center">
      <img
        src={getUserAvatarUrl()}
        alt="Avatar"
        className="inline min-w-[3rem] min-h-[3rem] border-2 border-orange-500 rounded-full"
      />
      <div
        className="text-xs bg-fuchsia-500 rounded-lg text-white relative left-[-4.1rem] bottom-[-1.6rem] min-w-max p-1">{truncateEthAddress(getUserAddress())}</div>
    </div>
  );
}
