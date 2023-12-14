import {IconRefresh, IconTriangleDown, IconTriangleUp } from '../Icons';
import {formatCurrency} from '../util';


export default function  AccountsList(props) {
return (
  <>
<div className="w-full h-full bg-discord-darkestGray border border-discord-black rounded shadow-lg">
    <div className="flex p-2 items-center justify-between mb-[4px]">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{props.title}</h5>
        <a href="#" className="text-sm font-medium text-discord-blurple2">
            <IconRefresh/>
        </a>
   </div>
   <div className="flow-root">
        <ul role="list" className="divide-y divide-discord-darkerGray">
           {props.itemArr.map((obj, i) => (
             <li className='py-[4px] px-2'>
             <div className="flex items-center">
                 <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium ">
                     {obj.icon} {obj.accountName}
                         <span className="ml-2 text-sm text-gray-500">
                           {obj.accountId}
                          </span>
                     </p>

                     <p className=" text-lg font-medium text-discord-blurple2">
                     {formatCurrency(obj.total)}
                     </p>

                 </div>
                 <div className={`text-right flex-1 items-center text-base font-semibold ${obj.val > 0 ? 'text-discord-softGreen' : 'text-discord-softRed'}`}>
                     <p className={`text-sm==lg font-medium ${obj.val > 0 ? 'text-discord-softGreen' : 'text-discord-softRed'}`}>
                      {formatCurrency(obj.val)} {obj.val >= 0 ? (<IconTriangleUp/>) : (<IconTriangleDown/>)} ({formatCurrency(obj.val)})
                     </p>
                 </div>
             </div>
         </li>
         ))}
        </ul>
   </div>
</div>

  </>
);
}
