import React, { useContext, useState } from 'react';
import * as dayjs from 'dayjs';
import { TableCell, TableBody, TableRow } from '@windmill/react-ui';

import MainModal from '../modal/MainModal';
import { SidebarContext } from '../../context/SidebarContext';
import Status from '../table/Status';
import SelectStatus from '../form/SelectStatus';
import EditDeleteButton from '../table/EditDeleteButton';
import useToggleDrawer from '../../hooks/useToggleDrawer';

const SubscriptionTable = ({ subscriptions }) => {
  const [customerId, setCustomerId] = useState('');
    const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  
//   const [title, setTitle] = useState('');

//   const handleModalOpen = (id, title) => {
//     setCustomerId(id);
//     toggleModal();
//     setTitle(title);
//   };
// console.log(subscriptions);

  return (
    <>
      <MainModal id={customerId} title={title} />
      <TableBody>
        {/* {console.log(customers)} */}
        {subscriptions?.map((user) => (
          
          <TableRow key={user?.id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {/* {' '}
                {console.log('------' ,user)}
                {user?._id?.substring(20, 24)} */}
                {user?.id}
              </span>
            </TableCell>
            <TableCell>
                         <span className="text-sm">
                           {dayjs(user.createdAt).format('MMM D, YYYY')}
                         </span>
                       </TableCell>
           
            <TableCell>
              <span className="text-sm">{user.email}</span>{' '}
            </TableCell>
           
            {/* <TableCell className="text-center text-xs"> */}
            <TableCell >
              <Status status={user.status || "active"} />
            </TableCell>

             <TableCell >
              <SelectStatus id={user.id} order={user} component="subscription" />
            </TableCell>
           
            <TableCell  >
               <EditDeleteButton
                id={user.id}
                title={user.id}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                // action="subscriptionAction"
                action={false}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};


export default SubscriptionTable
